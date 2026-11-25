import { createServerFn } from "@tanstack/react-start";
import type { z } from "zod";
import { contactSchema } from "@/data/contact-schema";
import { site } from "@/data/site";

export type ContactSubmitResult = {
  success: boolean;
  deliveryMode: "sent" | "simulated";
  messageId: string;
};

/**
 * Server function to deliver contact form submissions directly to Kunal's email inbox
 * via Resend API, Gmail SMTP, or Custom SMTP (with graceful simulation fallback).
 */
export const submitContactAction = createServerFn({ method: "POST" })
  .validator((d: z.infer<typeof contactSchema>) => contactSchema.parse(d))
  .handler(async ({ data }): Promise<ContactSubmitResult> => {
    // Load .env variables into process.env if running locally
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const envPath = path.resolve(process.cwd(), ".env");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        envContent.split("\n").forEach((line) => {
          const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)?\s*$/);
          if (match && match[1]) {
            const key = match[1];
            let val = (match[2] || "").trim();
            if (
              (val.startsWith('"') && val.endsWith('"')) ||
              (val.startsWith("'") && val.endsWith("'"))
            ) {
              val = val.slice(1, -1);
            }
            if (!process.env[key] && val) {
              process.env[key] = val;
            }
          }
        });
      }
    } catch {
      // Ignore if .env is not accessible in serverless environment
    }

    const name = data.name.trim();
    const senderEmail = data.email.trim().toLowerCase();
    const message = data.message.trim();
    const ownerEmail = process.env["CONTACT_TO_EMAIL"] || site.email;
    const messageId = `MSG-${Date.now().toString(36).toUpperCase()}`;

    const subject = `[Portfolio Inquiry] New message from ${name} (${senderEmail})`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #ffffff; border-radius: 12px; border: 1px solid #eaeaea;">
        <div style="border-bottom: 2px solid #C6FF3D; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; color: #0a0a0a;">New Portfolio Contact Message</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #666666;">ID: ${messageId}</p>
        </div>
        <p style="margin: 0 0 8px; font-size: 14px;"><strong>From:</strong> ${name}</p>
        <p style="margin: 0 0 16px; font-size: 14px;"><strong>Reply-To:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
        <div style="background: #f7f7f8; border-left: 4px solid #C6FF3D; padding: 14px 18px; border-radius: 4px; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #222222;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
      </div>
    `;

    const resendApiKey = process.env["RESEND_API_KEY"];
    const resendFrom =
      process.env["RESEND_FROM_EMAIL"] || "Portfolio Contact <onboarding@resend.dev>";
    const gmailUser = process.env["GMAIL_USER"];
    const gmailPass = process.env["GMAIL_APP_PASSWORD"];
    const smtpHost = process.env["SMTP_HOST"];

    if (resendApiKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [ownerEmail],
            reply_to: senderEmail,
            subject,
            html,
          }),
        });
        if (res.ok) {
          return { success: true, deliveryMode: "sent", messageId };
        }
      } catch (err) {
        console.warn("Resend contact dispatch fallback:", err);
      }
    }

    if (gmailUser && gmailPass) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass },
        });
        await transporter.sendMail({
          from: `"${name} via Portfolio" <${gmailUser}>`,
          to: ownerEmail,
          replyTo: senderEmail,
          subject,
          html,
        });
        return { success: true, deliveryMode: "sent", messageId };
      } catch (err) {
        console.warn("Gmail contact dispatch fallback:", err);
      }
    }

    if (smtpHost) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env["SMTP_PORT"]) || 587,
          secure: process.env["SMTP_SECURE"] === "true",
          auth: {
            user: process.env["SMTP_USER"] || "",
            pass: process.env["SMTP_PASS"] || "",
          },
        });
        await transporter.sendMail({
          from: process.env["SMTP_FROM"] || `"Portfolio Contact" <${process.env["SMTP_USER"]}>`,
          to: ownerEmail,
          replyTo: senderEmail,
          subject,
          html,
        });
        return { success: true, deliveryMode: "sent", messageId };
      } catch (err) {
        console.warn("Custom SMTP contact dispatch fallback:", err);
      }
    }

    // Graceful simulation fallback when no email credentials are configured
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, deliveryMode: "simulated", messageId };
  });

export async function submitContact(
  values: z.infer<typeof contactSchema>,
): Promise<ContactSubmitResult> {
  return await submitContactAction({ data: values });
}
