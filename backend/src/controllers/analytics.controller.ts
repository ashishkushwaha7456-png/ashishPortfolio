import type { Request, Response } from "express";
import { connectDatabase } from "@/config/database";
import { AnalyticsModel, MessageModel } from "@/models";
import { clientIp, rateLimit } from "@/middlewares/rate-limit.middleware";

import { analyticsEventSchema } from "@/validators";
import { ANALYTICS_COOKIE } from "@/constants/site";
import { deviceFromUA, browserFromUA } from "@/utils/user-agent";
import type { AnalyticsSummary } from "@/types";
import { asyncHandler } from "@/utils/async-handler";

const DAY_MS = 86_400_000;

export const trackEvent = asyncHandler(async (req: Request, res: Response) => {
  const ip = clientIp(req);
  if (!rateLimit(`analytics:${ip}`, 60, 60_000).allowed) {
    return res.json({ success: true, data: { recorded: false } });
  }

  const parsed = analyticsEventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.json({ success: true, data: { recorded: false } });
  }

  const conn = await connectDatabase();
  if (!conn) {
    return res.json({ success: true, data: { recorded: false } });
  }

  const sessionId = req.cookies[ANALYTICS_COOKIE] ?? "anonymous";
  const ua = req.headers["user-agent"] ?? "";

  try {
    await AnalyticsModel.create({
      type: parsed.data.type,
      path: parsed.data.path,
      referrer: parsed.data.referrer,
      device: deviceFromUA(ua),
      browser: browserFromUA(ua),
      sessionId,
      meta: parsed.data.meta,
    });
  } catch (error) {
    console.error("[analytics] write failed:", (error as Error).message);
    return res.json({ success: true, data: { recorded: false } });
  }

  res.json({ success: true, data: { recorded: true } });
});

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const days = Math.min(
    365,
    Math.max(7, Number(req.query.days ?? 30))
  );

  const empty = {
    totalViews: 0,
    uniqueVisitors: 0,
    messages: 0,
    resumeDownloads: 0,
    viewsChange: 0,
    topPages: [],
    byDay: [],
    byDevice: [],
    byReferrer: [],
    databaseConfigured: false,
  };

  const conn = await connectDatabase();
  if (!conn) return res.json({ success: true, data: empty });

  const now = Date.now();
  const since = new Date(now - days * DAY_MS);
  const previousSince = new Date(now - days * 2 * DAY_MS);

  const [
    totalViews,
    previousViews,
    uniqueVisitors,
    messages,
    resumeDownloads,
    topPages,
    byDayRaw,
    byDevice,
    byReferrer,
  ] = await Promise.all([
    AnalyticsModel.countDocuments({ type: "pageview", createdAt: { $gte: since } }),
    AnalyticsModel.countDocuments({
      type: "pageview",
      createdAt: { $gte: previousSince, $lt: since },
    }),
    AnalyticsModel.distinct("sessionId", { createdAt: { $gte: since } }).then(
      (ids) => ids.length
    ),
    MessageModel.countDocuments({ createdAt: { $gte: since } }),
    AnalyticsModel.countDocuments({ type: "download", createdAt: { $gte: since } }),

    AnalyticsModel.aggregate([
      { $match: { type: "pageview", createdAt: { $gte: since } } },
      { $group: { _id: "$path", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, path: "$_id", views: 1 } },
    ]),

    AnalyticsModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          views: { $sum: { $cond: [{ $eq: ["$type", "pageview"] }, 1, 0] } },
          sessions: { $addToSet: "$sessionId" },
        },
      },
      { $project: { _id: 0, date: "$_id", views: 1, visitors: { $size: "$sessions" } } },
      { $sort: { date: 1 } },
    ]),

    AnalyticsModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $project: { _id: 0, device: "$_id", count: 1 } },
    ]),

    AnalyticsModel.aggregate([
      { $match: { createdAt: { $gte: since }, referrer: { $nin: [null, ""] } } },
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      { $project: { _id: 0, referrer: "$_id", count: 1 } },
    ]),
  ]);

  /* Fill gaps so the chart has a point per day rather than a jagged x-axis. */
  const byDayMap = new Map(
    (byDayRaw as { date: string; views: number; visitors: number }[]).map((d) => [d.date, d])
  );
  const byDay = Array.from({ length: days }, (_, index) => {
    const date = new Date(now - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10);
    return byDayMap.get(date) ?? { date, views: 0, visitors: 0 };
  });

  const summary = {
    totalViews,
    uniqueVisitors,
    messages,
    resumeDownloads,
    viewsChange: previousViews
      ? Math.round(((totalViews - previousViews) / previousViews) * 100)
      : 0,
    topPages: topPages as { path: string; views: number }[],
    byDay,
    byDevice: byDevice as { device: string; count: number }[],
    byReferrer: byReferrer as { referrer: string; count: number }[],
    databaseConfigured: true,
  };

  res.json({ success: true, data: summary });
});
