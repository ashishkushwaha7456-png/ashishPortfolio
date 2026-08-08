import nodemailer from "nodemailer";
import { PERSON, SITE_CONFIG } from "@/constants/site";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: string;
  budget?: string;
  referrer?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) return null;

  const port = Number(SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  return transporter;
}

function escapeHtml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Sends the contact notification. */
export async function sendContactEmail(payload: ContactPayload): Promise<boolean> {
  const mailer = getTransporter();
  if (!mailer) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[mail] SMTP not configured — message stored only:", payload.subject);
    }
    return false;
  }

  const to = process.env.CONTACT_TO_EMAIL ?? PERSON.email;

  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Subject", payload.subject],
    ["Type", payload.projectType ?? "—"],
    ["Budget", payload.budget ?? "—"],
    ["Referrer", payload.referrer ?? "—"],
  ]
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 14px 6px 0;color:#71717a;font-size:13px;white-space:nowrap">${label}</td>
           <td style="padding:6px 0;font-size:14px;color:#18181b">${escapeHtml(String(value))}</td>
         </tr>`,
    )
    .join("");

  try {
    await mailer.sendMail({
      from: `"${SITE_CONFIG.shortName} — Portfolio" <${process.env.SMTP_USER}>`,
      to,
      replyTo: `"${payload.name}" <${payload.email}>`,
      subject: `Portfolio enquiry: ${payload.subject}`,
      text: [
        `New message from ${payload.name} <${payload.email}>`,
        `Subject: ${payload.subject}`,
        `Type: ${payload.projectType ?? "—"}`,
        `Budget: ${payload.budget ?? "—"}`,
        "",
        payload.message,
      ].join("\n"),
      html: `
        <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;margin:0 auto;padding:28px">
          <p style="margin:0 0 4px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8b5cf6">
            New portfolio enquiry
          </p>
          <h1 style="margin:0 0 22px;font-size:22px;color:#18181b">${escapeHtml(payload.subject)}</h1>

          <table style="border-collapse:collapse;margin-bottom:22px">${rows}</table>

          <div style="border-left:3px solid #8b5cf6;padding:2px 0 2px 16px;color:#3f3f46;font-size:15px;line-height:1.7;white-space:pre-wrap">${escapeHtml(
            payload.message,
          )}</div>

          <p style="margin:28px 0 0;font-size:12px;color:#a1a1aa">
            Sent from ${SITE_CONFIG.url} · reply directly to answer ${escapeHtml(payload.name)}.
          </p>
        </div>`,
    });
    return true;
  } catch (error) {
    console.error("[mail] send failed:", (error as Error).message);
    return false;
  }
}
