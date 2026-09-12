export const MAX_SIGNERS = 8;

export type Signer = {
  name: string;
  taxIdentificationNumber: string;
  email: string;
};

export type PrepareSigningValues = {
  documentName: string;
  message: string;
  signers: Signer[];
};

export type ValidatePrepareSigningResult =
  | { ok: true; values: PrepareSigningValues }
  | { ok: false; reason: "invalidInput" };

export function validatePrepareSigningValues(
  input: PrepareSigningValues,
): ValidatePrepareSigningResult {
  const documentName = input.documentName.trim();
  const message = input.message.trim();
  const signers = input.signers.map((signer) => ({
    name: signer.name.trim(),
    taxIdentificationNumber: signer.taxIdentificationNumber.trim(),
    email: signer.email.trim(),
  }));

  if (!documentName || signers.length === 0) {
    return { ok: false, reason: "invalidInput" };
  }

  if (
    signers.some(
      (signer) =>
        !signer.name || !signer.taxIdentificationNumber || !signer.email,
    )
  ) {
    return { ok: false, reason: "invalidInput" };
  }

  return { ok: true, values: { documentName, message, signers } };
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
