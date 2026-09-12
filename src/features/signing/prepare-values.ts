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
