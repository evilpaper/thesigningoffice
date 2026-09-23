import type { Signer } from "./prepare-values";

export type DocumentStore = {
  store(input: {
    bytes: Uint8Array;
    signingId: string;
    fileName: string;
  }): Promise<string>;
  delete(key: string): Promise<void>;
};

export type CreatedSigning = {
  id: string;
  documentName: string;
  signerEmails: string[];
};

export type SigningRepository = {
  create(input: {
    signingId: string;
    documentName: string;
    message: string;
    signers: Signer[];
    documentKey: string;
  }): Promise<CreatedSigning>;
};
