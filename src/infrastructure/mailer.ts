import { Resend } from "resend";
import type { Mailer } from "@/features/signing/ports";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendForSigning(input: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const { error } = await resend.emails.send({
    from: "The Signing Office <onboarding@resend.dev>",
    to: [input.to],
    subject: input.subject,
    text: input.body,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export const mailer: Mailer = {
  sendForSigning,
};
