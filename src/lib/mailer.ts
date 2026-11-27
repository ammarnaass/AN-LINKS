export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  sent: boolean;
  provider: "resend" | "console";
  messageId?: string;
  error?: string;
}

/**
 * Dispatches transactional email via Resend REST API when `RESEND_API_KEY` is configured,
 * or safely logs to stdout in local development/test environments.
 */
export async function sendTransactionalEmail(
  payload: SendEmailPayload
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress =
    process.env.EMAIL_FROM?.trim() || "AN LINKS <noreply@anlinks.dev>";

  if (!apiKey) {
    console.log(`[MAILER:DEV] To=${payload.to} | Subject="${payload.subject}"`);
    return { sent: true, provider: "console" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        from: fromAddress,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      return {
        sent: false,
        provider: "resend",
        error: `HTTP ${res.status}: ${errorText}`,
      };
    }

    const json = (await res.json().catch(() => ({}))) as { id?: string };
    return { sent: true, provider: "resend", messageId: json.id };
  } catch (err) {
    return {
      sent: false,
      provider: "resend",
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Sends a localized RTL Arabic password reset email with a 1-hour expiry notice.
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<SendEmailResult> {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://anlinks.dev").replace(/\/$/, "");
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px;">
      <h2 style="color: #4edea3; margin-top: 0;">استعادة كلمة المرور | AN LINKS</h2>
      <p style="line-height: 1.7; color: #cbd5e1;">
        تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك. اضغط على الزر أدناه لتعيين كلمة مرور جديدة (صالح لمدة ساعة واحدة):
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetUrl}" style="background: #4edea3; color: #052e16; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; display: inline-block;">
          تعيين كلمة مرور جديدة
        </a>
      </div>
      <p style="font-size: 12px; color: #94a3b8;">
        إذا لم تطلب تغيير كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.
      </p>
    </div>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: "إعادة تعيين كلمة المرور | AN LINKS",
    html,
    text: `لإعادة تعيين كلمة المرور، افتح الرابط التالي: ${resetUrl}`,
  });
}
