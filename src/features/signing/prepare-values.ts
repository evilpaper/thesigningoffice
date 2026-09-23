import { z } from "zod";
import { normalizeSwedishTaxIdentificationNumber } from "./swedish-tax-identification-number";

export const MAX_SIGNERS = 8;

export const INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER =
  "invalidSwedishTaxIdentificationNumber" as const;

export type PrepareFieldErrorCode =
  | typeof INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER
  | "invalidInput";

export type PrepareFieldError = {
  path: string;
  code: PrepareFieldErrorCode;
};

const signerEmail = z
  .string()
  .trim()
  .regex(/[^\s@]+@[^\s@]+\.[^\s@]+/);

const swedishTaxIdentificationNumber = z
  .string()
  .trim()
  .transform((value, ctx) => {
    const normalized = normalizeSwedishTaxIdentificationNumber(value);
    if (normalized == null) {
      ctx.addIssue({
        code: "custom",
        message: INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER,
      });
      return z.NEVER;
    }
    return normalized;
  });

const signerSchema = z.object({
  name: z.string().trim().min(1),
  taxIdentificationNumber: swedishTaxIdentificationNumber,
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
  | { ok: false; reason: "invalidInput"; fieldErrors: PrepareFieldError[] };

function pathToString(path: PropertyKey[]): string {
  return path.map(String).join(".");
}

function fieldErrorsFromIssues(
  issues: readonly { path: PropertyKey[]; message?: string }[],
): PrepareFieldError[] {
  return issues.map((issue) => ({
    path: pathToString(issue.path),
    code:
      issue.message === INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER
        ? INVALID_SWEDISH_TAX_IDENTIFICATION_NUMBER
        : "invalidInput",
  }));
}

export function validatePrepareSigningValues(
  input: PrepareSigningValues,
): ValidatePrepareSigningResult {
  const result = prepareSigningValuesSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      reason: "invalidInput",
      fieldErrors: fieldErrorsFromIssues(result.error.issues),
    };
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
