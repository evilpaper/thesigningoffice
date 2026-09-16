"use server";

/**
 * The action exists to turn “what the form sent” into “what createSigning understands,” then run that on the server with real (or stub) ports.
 */

import { randomUUID } from "node:crypto";
import { documentStore } from "@/infrastructure/document";
import { createSigning } from "./create-signing";
import type { SigningRepository } from "./ports";
import { parseSignersFromFormData } from "./prepare-values";

/**
 * createSigning always needs both ports.
 * You don’t have a real DB yet, so the stub says “pretend the DB write succeeded.”
 * That lets you finish the PDF path without blocking on Postgres.
 */
const stubSigningRepository: SigningRepository = {
  async create() {},
};

/**
 *
 * @param formData That’s what the browser sends on submit: named fields (documentName, message, signers…) plus the PDF file once you append it. The action’s job is to unpack that bag.
 */
export async function createSigningAction(formData: FormData) {
  /**
   * Check document is a non-empty File
   * Without bytes there’s nothing to store. Fail early with a clear reason instead of calling createSigning with garbage.
   */
  const document = formData.get("document");
  if (!(document instanceof File) || document.size === 0) {
    return { ok: false, reason: "invalidDocument" };
  }

  /**
   * Read documentName, message, signers
   * Those are the prepare fields. The PDF alone isn’t a signing — metadata + who signs matter too. This is what makes this action different from the old pick-file path in start-signing.ts.
   */
  const documentName = String(formData.get("documentName") ?? "");
  const message = String(formData.get("message") ?? "");
  const signers = parseSignersFromFormData(formData);

  /**
   * Create signingId
   * Both the file key and the DB row need the same id. Create it once up front so document storage and (later) Postgres stay in sync.
   */
  const signingId = randomUUID();

  /**
   * Modify the file to bytes
   * File is a browser/form type. createSigning / documentStore want raw bytes.
   * This converts “uploaded file” → “bytes we can write.”
   */
  const arrayBuffer = await document.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  /**
   * Call createSigning(command, ports)
   * This is the whole point of the bridge: after adapting FormData, hand off to the domain function.
   * The action should not store files or talk to the DB itself.
   */
  const result = await createSigning(
    {
      signingId,
      document: {
        bytes: buffer,
        fileName: document.name,
      },
      values: {
        documentName,
        message,
        signers,
      },
    },
    {
      documentStore,
      signingRepository: stubSigningRepository,
    },
  );

  /**
   * Return the result
   * So the UI (later) can show success or an error.
   * For now you can just log it — returning keeps the door open.
   */
  return result;
}
