import type { SigningRepository } from "@/features/signing/ports";
import { db } from "./db";
import { signers, signings } from "./schema";

export const signingRepository: SigningRepository = {
  async create(input) {
    return db.transaction(async (tx) => {
      const [createdSigning] = await tx
        .insert(signings)
        .values({
          id: input.signingId,
          documentName: input.documentName,
          message: input.message,
          documentKey: input.documentKey,
          // status defaults to "draft" in schema
        })
        .returning({
          id: signings.id,
          documentName: signings.documentName,
        });

      const createdSigners = await tx
        .insert(signers)
        .values(
          input.signers.map((signer) => ({
            signingId: input.signingId,
            name: signer.name,
            taxIdentificationNumber: signer.taxIdentificationNumber,
            email: signer.email,
          })),
        )
        .returning({ email: signers.email });

      return {
        id: createdSigning.id,
        documentName: createdSigning.documentName,
        signerEmails: createdSigners.map(({ email }) => email),
      };
    });
  },
};
