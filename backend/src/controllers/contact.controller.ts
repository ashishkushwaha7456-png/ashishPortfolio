import type { Request, Response } from "express";
import { connectDatabase } from "@/config/database";
import { MessageModel } from "@/models";
import { clientIp, rateLimit } from "@/middlewares/rate-limit.middleware";

import { contactSchema } from "@/validators";
import { sendContactEmail } from "@/services/mail.service";
import { asyncHandler } from "@/utils/async-handler";

export const handleContact = asyncHandler(async (req: Request, res: Response) => {
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, 3, 10 * 60_000);
  if (!limit.allowed) {
    return res.status(429).json({
      success: false,
      error: "You've sent a few messages already — try again shortly, or email me directly.",
    });
  }

  const data = contactSchema.parse(req.body);

  // Honeypot. Return success so the bot doesn't learn anything.
  if (data.website) {
    return res.json({ success: true, data: { received: true } });
  }

  const record = {
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    subject: data.subject.trim(),
    projectType: data.projectType,
    budget: data.budget,
    message: data.message.trim(),
    ip,
    userAgent: req.headers["user-agent"] ?? undefined,
    referrer: req.headers["referer"] ?? undefined,
  };

  let stored = false;
  const conn = await connectDatabase();
  if (conn) {
    try {
      await MessageModel.create(record);
      stored = true;
    } catch (error) {
      console.error("[contact] failed to store message:", (error as Error).message);
    }
  }

  const emailed = await sendContactEmail(record);

  // Only a total failure is worth reporting to the sender.
  if (!stored && !emailed) {
    return res.status(502).json({
      success: false,
      error: "Your message couldn't be delivered. Please email me directly instead.",
    });
  }

  res.json({
    success: true,
    data: { received: true, stored, emailed },
  });
});
