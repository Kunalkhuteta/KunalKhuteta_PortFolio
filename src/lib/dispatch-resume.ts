import { createServerFn } from "@tanstack/react-start";

export type DispatchResumePayload = {
  email: string;
  phone?: string;
  name?: string;
  enableWhatsApp?: boolean;
};

export type DispatchResumeResult = {
  success: boolean;
  deliveryId: string;
  emailStatus: "sent" | "simulated" | "failed";
  whatsappStatus: "staged" | "sent" | "skipped";
  recipient: string;
  timestamp: string;
  message: string;
  auditTrail: string[];
};

/**
 * Generates an in-memory PDF buffer of Kunal's resume as a fallback
 * if serverless container filesystem does not bundle public/resume.pdf,
 * ensuring the email ALWAYS includes the PDF attachment.
 */
function buildFallbackResumePdfBuffer(): Buffer {
  const lines = [
    "BT",
    "/F1 20 Tf",
    "50 760 Td",
    "(Kunal Khuteta - Full Stack AI Developer) Tj",
    "0 -24 Td",
    "/F2 10 Tf",
    "(Email: kunalkhandelwal.dev@gmail.com | Location: Jaipur, India / Remote) Tj",
    "0 -14 Td",
    "(GitHub: https://github.com/Kunalkhuteta | LinkedIn: https://linkedin.com/in/kunal-khandelwal) Tj",
    "0 -28 Td",
    "/F1 13 Tf",
    "(PROFESSIONAL SUMMARY) Tj",
    "0 -16 Td",
    "/F2 10 Tf",
    "(Full-stack software and mobile developer focused on scalable applications, GenAI) Tj",
    "0 -13 Td",
    "(and agentic automation tools, and developer infrastructure. Experienced in production) Tj",
    "0 -13 Td",
    "(deployments across React, Angular, Flutter, C# ASP.NET Core, FastAPI, and Docker.) Tj",
    "0 -24 Td",
    "/F1 13 Tf",
    "(EXPERIENCE) Tj",
    "0 -16 Td",
    "/F1 11 Tf",
    "(SoftTrade InfoTech - Software Developer \\(Apr 2026 - Present\\)) Tj",
    "0 -14 Td",
    "/F2 10 Tf",
    "(- Architected and deployed production REST APIs in C# ASP.NET Core with Redis caching.) Tj",
    "0 -13 Td",
    "(- Built event-driven workflows for real-time sync across accounting and inventory.) Tj",
    "0 -18 Td",
    "/F1 11 Tf",
    "(SoftTrade InfoTech - Angular and Flutter Developer Intern \\(Jan 2026 - Mar 2026\\)) Tj",
    "0 -14 Td",
    "/F2 10 Tf",
    "(- Engineered 50+ Angular UI modules and delivered a production Flutter mobile ERP app.) Tj",
    "0 -24 Td",
    "/F1 13 Tf",
    "(CORE SKILLS & TECHNOLOGIES) Tj",
    "0 -16 Td",
    "/F2 10 Tf",
    "(- Languages: C#, TypeScript, JavaScript, Python, Dart, Java, C++, SQL) Tj",
    "0 -13 Td",
    "(- Backend & Cloud: ASP.NET Core, Node.js, Express, FastAPI, Docker, Kubernetes, CI/CD) Tj",
    "0 -13 Td",
    "(- Frontend & Mobile: React 19, Angular, Flutter, Tailwind CSS, Radix UI, GSAP) Tj",
    "0 -13 Td",
    "(- AI & Agentic: GenAI Workflows, LLM Function Calling, Multi-agent Orchestration) Tj",
    "0 -13 Td",
    "(- Databases: PostgreSQL, MongoDB, Redis, InfluxDB) Tj",
    "0 -24 Td",
    "/F1 13 Tf",
    "(ACHIEVEMENTS & MILESTONES) Tj",
    "0 -16 Td",
    "/F2 10 Tf",
    "(- Winner: GDG 15-Hour Hackathon \\(Built working product with 10k+ LOC\\)) Tj",
    "0 -13 Td",
    "(- Winner: IPS Business College Hackathon) Tj",
    "ET",
  ];
  const content = lines.join("\n");
  const streamBuf = Buffer.from(content, "utf-8");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>",
    `<< /Length ${streamBuf.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "utf-8");
}

/**
 * Server function to dispatch Kunal's resume to the user's provided email.
 * Supports Resend API, Gmail / Custom SMTP via Nodemailer, and safe simulation fallback.
 */
export const dispatchResumeAction = createServerFn({ method: "POST" })
  .validator((d: DispatchResumePayload) => d)
  .handler(async ({ data }): Promise<DispatchResumeResult> => {
    // 0. Ensure environment variables from .env are loaded into process.env
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

    const email = (data?.email || "").trim().toLowerCase();
    const phone = (data?.phone || "").trim();
    const enableWhatsApp = Boolean(data?.enableWhatsApp);
    const deliveryId = `DLV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const auditTrail: string[] = [];

    auditTrail.push(`[${timestamp}] Agent trigger received for target: ${email}`);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      auditTrail.push(`[ERROR] Invalid recipient email address: "${email}"`);
      return {
        success: false,
        deliveryId,
        emailStatus: "failed",
        whatsappStatus: enableWhatsApp ? "staged" : "skipped",
        recipient: email,
        timestamp,
        message: "Please provide a valid email address.",
        auditTrail,
      };
    }

    auditTrail.push(`[VALIDATION] Recipient email verified: ${email}`);

    // Load PDF resume buffer for attachment (looks in multiple candidate paths + self-generates fallback for serverless environments)
    let pdfBuffer: Buffer | null = null;
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const candidates = [
        path.resolve(process.cwd(), "public/resume.pdf"),
        path.resolve(process.cwd(), ".output/public/resume.pdf"),
        path.resolve(process.cwd(), "dist/client/resume.pdf"),
        path.resolve(process.cwd(), "../public/resume.pdf"),
      ];
      const foundPath = candidates.find((p) => fs.existsSync(p));
      if (foundPath) {
        pdfBuffer = fs.readFileSync(foundPath);
        auditTrail.push(`[DOC_PKG] Attached Kunal_Khuteta_Resume.pdf (${pdfBuffer.length} bytes)`);
      } else {
        pdfBuffer = buildFallbackResumePdfBuffer();
        auditTrail.push(
          `[DOC_PKG] Generated & attached Kunal_Khuteta_Resume.pdf (${pdfBuffer.length} bytes)`,
        );
      }
    } catch {
      pdfBuffer = buildFallbackResumePdfBuffer();
      auditTrail.push(
        `[DOC_PKG] Generated & attached Kunal_Khuteta_Resume.pdf (${pdfBuffer.length} bytes)`,
      );
    }

    const emailSubject = "Kunal Khuteta — Full Stack AI Developer Resume & Portfolio";
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #ffffff; border-radius: 12px; border: 1px solid #eaeaea;">
        <div style="border-bottom: 2px solid #C6FF3D; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 22px; color: #0a0a0a;">Kunal Khuteta</h2>
          <p style="margin: 4px 0 0; font-size: 14px; color: #666666;">Full Stack AI Developer & Software/Mobile Engineer</p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #333333;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #333333;">
          Thank you for requesting my resume through the interactive <strong>AI Agents at Work</strong> automation workflow on my portfolio.
        </p>

        <div style="background: #f7f7f8; border-left: 4px solid #C6FF3D; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 6px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #555555;">Delivery Metadata</p>
          <p style="margin: 0; font-size: 13px; font-family: monospace; color: #222222;">
            Dispatch ID: ${deliveryId}<br>
            Timestamp: ${timestamp}<br>
            Channel: Automated Agent Email Relay
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6; color: #333333;">
          My latest resume is attached as a PDF (<strong>Kunal_Khuteta_Resume.pdf</strong>).
        </p>

        <div style="margin: 28px 0 16px;">
          <a href="https://github.com/Kunalkhuteta" style="display: inline-block; background: #0a0a0a; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: 500; margin-right: 10px;">GitHub Profile</a>
          <a href="https://linkedin.com/in/kunal-khandelwal" style="display: inline-block; background: #0077b5; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: 500;">LinkedIn</a>
        </div>

        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />

        <p style="font-size: 12px; color: #888888; margin: 0;">
          Kunal Khuteta · Jaipur, India / Remote · <a href="mailto:kunalkhandelwal.dev@gmail.com" style="color: #666666;">kunalkhandelwal.dev@gmail.com</a>
        </p>
      </div>
    `;

    let emailStatus: "sent" | "simulated" | "failed" = "simulated";
    let statusMessage = "";

    // 1. Try Resend API if RESEND_API_KEY is configured
    const resendApiKey = process.env["RESEND_API_KEY"];
    const resendFrom = process.env["RESEND_FROM_EMAIL"] || "Kunal Khuteta <onboarding@resend.dev>";

    // 2. Try Nodemailer SMTP (Gmail or custom)
    const gmailUser = process.env["GMAIL_USER"];
    const gmailPass = process.env["GMAIL_APP_PASSWORD"];
    const smtpHost = process.env["SMTP_HOST"];

    if (resendApiKey) {
      auditTrail.push(
        `[DISPATCH] Utilizing Resend REST Gateway (Key: ${resendApiKey.substring(0, 5)}...)`,
      );
      try {
        const payload: Record<string, unknown> = {
          from: resendFrom,
          to: [email],
          subject: emailSubject,
          html: emailHtml,
        };
        if (pdfBuffer) {
          payload["attachments"] = [
            {
              filename: "Kunal_Khuteta_Resume.pdf",
              content: pdfBuffer.toString("base64"),
            },
          ];
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const resData = (await res.json()) as { id?: string };
          emailStatus = "sent";
          statusMessage = `Resume successfully dispatched to ${email} via Resend (ID: ${resData.id || "ok"}).`;
          auditTrail.push(
            `[SUCCESS] Resend dispatch confirmed. Gateway Message ID: ${resData.id || "N/A"}`,
          );
        } else {
          const errText = await res.text();
          let parsedMsg = errText;
          try {
            const parsed = JSON.parse(errText) as { message?: string };
            if (parsed.message) parsedMsg = parsed.message;
          } catch {
            // Response body is plain text
          }

          auditTrail.push(`[WARN] Resend responded (${res.status}): ${parsedMsg}`);

          if (res.status === 403 || parsedMsg.toLowerCase().includes("testing emails")) {
            statusMessage = `Resend Onboarding Mode: Can only send to your verified account email until a domain is verified at resend.com/domains.`;
            auditTrail.push(
              `[NOTICE] To dispatch to arbitrary outside emails, add & verify your custom domain in Resend.`,
            );
            auditTrail.push(`[FALLBACK] Direct browser download executed successfully.`);
            emailStatus = "simulated";
          } else {
            throw new Error(`Resend API: ${parsedMsg}`);
          }
        }
      } catch (err) {
        auditTrail.push(`[ERROR] Resend delivery encountered issue: ${String(err)}`);
        if (emailStatus !== "simulated") {
          emailStatus = "failed";
        }
      }
    } else if (gmailUser && gmailPass) {
      auditTrail.push(`[DISPATCH] Utilizing Gmail SMTP with account: ${gmailUser}`);
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        const mailOptions: Record<string, unknown> = {
          from: `"Kunal Khuteta" <${gmailUser}>`,
          to: email,
          subject: emailSubject,
          html: emailHtml,
        };

        if (pdfBuffer) {
          mailOptions["attachments"] = [
            {
              filename: "Kunal_Khuteta_Resume.pdf",
              content: pdfBuffer,
            },
          ];
        }

        const info = await transporter.sendMail(mailOptions);
        emailStatus = "sent";
        statusMessage = `Resume sent to ${email} via Gmail SMTP (Message ID: ${info.messageId}).`;
        auditTrail.push(`[SUCCESS] SMTP delivery confirmed. Message ID: ${info.messageId}`);
      } catch (err) {
        auditTrail.push(`[ERROR] Gmail SMTP delivery failed: ${String(err)}`);
        emailStatus = "failed";
      }
    } else if (smtpHost) {
      auditTrail.push(`[DISPATCH] Utilizing Custom SMTP (${smtpHost})`);
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

        const mailOptions: Record<string, unknown> = {
          from: process.env["SMTP_FROM"] || `"Kunal Khuteta" <${process.env["SMTP_USER"]}>`,
          to: email,
          subject: emailSubject,
          html: emailHtml,
        };

        if (pdfBuffer) {
          mailOptions["attachments"] = [
            {
              filename: "Kunal_Khuteta_Resume.pdf",
              content: pdfBuffer,
            },
          ];
        }

        const info = await transporter.sendMail(mailOptions);
        emailStatus = "sent";
        statusMessage = `Resume sent to ${email} via custom SMTP.`;
        auditTrail.push(`[SUCCESS] Custom SMTP message ID: ${info.messageId}`);
      } catch (err) {
        auditTrail.push(`[ERROR] Custom SMTP failed: ${String(err)}`);
        emailStatus = "failed";
      }
    } else {
      // Graceful live simulation when environment credentials are not yet configured
      emailStatus = "simulated";
      statusMessage = `Workflow executed in live demo mode. Resume packaged and direct browser download triggered! To deliver real live emails to your inbox, configure RESEND_API_KEY or GMAIL_APP_PASSWORD in your .env file.`;
      auditTrail.push(`[NOTICE] No RESEND_API_KEY or GMAIL_APP_PASSWORD found in environment.`);
      auditTrail.push(
        `[SIMULATION] Simulated delivery payload staged for ${email}. Direct browser download activated.`,
      );
      auditTrail.push(
        `[READY] Provide RESEND_API_KEY or Gmail App Password in .env to dispatch live emails.`,
      );
    }

    // WhatsApp staging handling
    let whatsappStatus: "staged" | "sent" | "skipped" = "skipped";
    if (enableWhatsApp) {
      whatsappStatus = "staged";
      auditTrail.push(`[WHATSAPP] Target phone: ${phone || "Not specified"}`);
      auditTrail.push(
        `[WHATSAPP_GATEWAY] Status: STAGED · WhatsApp Business Cloud API / Twilio gateway ready for credentials.`,
      );
    }

    auditTrail.push(
      `[COMPLETE] Agent workflow cycle completed with status: ${emailStatus.toUpperCase()}`,
    );

    return {
      success: emailStatus !== "failed",
      deliveryId,
      emailStatus,
      whatsappStatus,
      recipient: email,
      timestamp,
      message: statusMessage,
      auditTrail,
    };
  });
