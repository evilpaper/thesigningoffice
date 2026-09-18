import type { SigningRepository } from "@/features/signing/ports";
import { db } from "./db";
import { signers, signings } from "./schema";

export const signingRepository: SigningRepository = {
  async create(input) {
    await db.transaction(async (tx) => {
      await tx.insert(signings).values({
        id: input.signingId,
        documentName: input.documentName,
        message: input.message,
        documentKey: input.documentKey,
        // status defaults to "draft" in schema
      });

      await tx.insert(signers).values(
        input.signers.map((signer) => ({
          signingId: input.signingId,
          name: signer.name,
          taxIdentificationNumber: signer.taxIdentificationNumber,
          email: signer.email,
        })),
      );
    });
  },
};
