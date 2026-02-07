import { Resend } from "resend";

interface EmailAttachment {
  filename: string;
  content: Buffer;
}

interface SendAssessmentEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments: EmailAttachment[];
}

export async function sendAssessmentEmail(options: SendAssessmentEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "MSP+ Assessment <onboarding@resend.dev>",
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return data;
}
