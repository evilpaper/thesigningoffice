import type {
  CreatedSigning,
  DocumentStore,
  Mailer,
  SigningRepository,
} from "./ports";
import type { PrepareSigningValuesInput } from "./prepare-values";
import { validatePrepareSigningValues } from "./prepare-values";

export type CreateSigningCommand = {
  signingId: string;
  document: {
    bytes: Uint8Array;
    fileName: string;
  };
  values: PrepareSigningValuesInput;
};

export type CreateSigningPorts = {
  documentStore: DocumentStore;
  signingRepository: SigningRepository;
  mailer: Mailer;
};

export type CreateSigningResult =
  | { ok: true; signing: CreatedSigning }
  | {
      ok: false;
      reason:
        | "invalidDocument"
        | "invalidInput"
        | "storageFailed"
        | "askFailed";
    }
  | {
      ok: false;
      reason: "databaseUnavailable";
      documentOrphaned: boolean;
    };

function askBody(documentName: string, message: string): string {
  if (message.length === 0) {
    return documentName;
  }

  return `${documentName}\n\n${message}`;
}

export async function createSigning(
  command: CreateSigningCommand,
  ports: CreateSigningPorts,
): Promise<CreateSigningResult> {
  const prepared = validatePrepareSigningValues(command.values);

  if (!prepared.ok) {
    return { ok: false, reason: "invalidInput" };
  }

  if (command.document.bytes.length === 0) {
    return { ok: false, reason: "invalidDocument" };
  }

  let documentKey: string;

  try {
    documentKey = await ports.documentStore.store({
      bytes: command.document.bytes,
      signingId: command.signingId,
      fileName: command.document.fileName,
    });
  } catch {
    return { ok: false, reason: "storageFailed" };
  }

  let signing: CreatedSigning;

  try {
    signing = await ports.signingRepository.create({
      signingId: command.signingId,
      documentName: prepared.values.documentName,
      message: prepared.values.message,
      signers: prepared.values.signers,
      documentKey,
    });
  } catch {
    try {
      await ports.documentStore.delete(documentKey);
    } catch {
      return {
        ok: false,
        reason: "databaseUnavailable",
        documentOrphaned: true,
      };
    }

    return {
      ok: false,
      reason: "databaseUnavailable",
      documentOrphaned: false,
    };
  }

  const body = askBody(prepared.values.documentName, prepared.values.message);

  try {
    for (const signer of prepared.values.signers) {
      await ports.mailer.sendForSigning({
        to: signer.email,
        subject: prepared.values.documentName,
        body,
      });
    }
  } catch {
    return { ok: false, reason: "askFailed" };
  }

  return { ok: true, signing };
}
