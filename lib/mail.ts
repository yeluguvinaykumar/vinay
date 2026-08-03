/**
 * E-mail abstraction.
 * Uses SMTP (nodemailer) when SMTP_HOST is configured; otherwise logs the
 * message to the console so local development still "works".
 */

type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function wrap(m: MailMessage): string {
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <div style="background:#0b1739;padding:24px 32px">
      <span style="color:#e5b72c;font-size:20px;font-weight:800;letter-spacing:3px">VINAY</span>
      <span style="color:#9fb3d9;font-size:12px;margin-left:8px">Find Your Dream Property</span>
    </div>
    <div style="padding:32px">${m.html}</div>
    <div style="background:#f8fafc;padding:16px 32px;font-size:12px;color:#64748b">
      © ${new Date().getFullYear()} VINAY · 1280 Mission Street, San Francisco, CA
    </div>
  </div>`;
}

export async function sendMail(m: MailMessage): Promise<boolean> {
  const hasHost = !!process.env.SMTP_HOST;
  const composed = wrap(m);

  if (!hasHost) {
    console.log("\n📧 [mail] (SMTP not configured — skipping send)", {
      to: m.to,
      subject: m.subject,
    });
    return true;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || "587"),
      secure: String(process.env.SMTP_PORT) === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM || "VINAY <no-reply@vinay.com>",
      to: m.to,
      subject: m.subject,
      text: m.text ?? m.html.replace(/<[^>]+>/g, " "),
      html: composed,
    });
    return true;
  } catch (e) {
    console.error("[mail] failed to send:", e);
    return false;
  }
}

export function confirmationHtml(title: string, lines: { label: string; value: string }[], cta?: { url: string; label: string }): string {
  const rows = lines
    .map((l) => `<tr><td style="padding:8px 0;color:#64748b;width:40%">${l.label}</td><td style="padding:8px 0;color:#0f172a;font-weight:600">${l.value}</td></tr>`)
    .join("");
  return `
    <h2 style="color:#0b1739;margin-top:0">${title}</h2>
    <table style="width:100%">
      <tbody>${rows}</tbody>
    </table>
    ${
      cta
        ? `<p style="margin-top:24px"><a href="${cta.url}" style="display:inline-block;background:#1d3a8f;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">${cta.label}</a></p>`
        : ""
    }
    <p style="color:#64748b;font-size:14px;margin-top:24px">Thank you for choosing VINAY.</p>`;
}