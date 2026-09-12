import { z } from "zod";

export const MAX_SIGNERS = 8;

const signerEmail = z
  .string()
  .trim()
  .regex(/[^\s@]+@[^\s@]+\.[^\s@]+/);

const signerSchema = z.object({
  name: z.string().trim().min(1),
  taxIdentificationNumber: z.string().trim().min(1),
  email: signerEmail,
});

export const prepareSigningValuesSchema = z.object({
  documentName: z.string().trim().min(1),
  message: z.string().trim(),
  signers: z.array(signerSchema).min(1).max(MAX_SIGNERS),
});

export type Signer = z.infer<typeof signerSchema>;

export type PrepareSigningValues = z.infer<typeof prepareSigningValuesSchema>;

export type ValidatePrepareSigningResult =
  | { ok: true; values: PrepareSigningValues }
  | { ok: false; reason: "invalidInput" };

export function validatePrepareSigningValues(
  input: PrepareSigningValues,
): ValidatePrepareSigningResult {
  const result = prepareSigningValuesSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, reason: "invalidInput" };
  }

  return { ok: true, values: result.data };
}

export function parseSignersFromFormData(formData: FormData): Signer[] {
  const signers: Signer[] = [];

  for (let index = 0; index < MAX_SIGNERS; index += 1) {
    const nameValue = formData.get(`signers.${index}.name`);
    if (nameValue == null) {
      break;
    }

    signers.push({
      name: String(nameValue).trim(),
      taxIdentificationNumber: String(
        formData.get(`signers.${index}.taxIdentificationNumber`) ?? "",
      ).trim(),
      email: String(formData.get(`signers.${index}.email`) ?? "").trim(),
    });
  }

  return signers;
}
