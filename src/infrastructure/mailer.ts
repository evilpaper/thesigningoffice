import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendForSigning = async (input: {
  to: string;
  subject: string;
  body: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "The Signing Office <onboarding@resend.dev>", // or whatever you named it
    to: [input.to],
    subject: input.subject,
    text: input.body,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
