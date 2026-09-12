import type { Signer } from "./prepare-values";

export type DocumentStore = {
  store(input: { bytes: Uint8Array; key: string }): Promise<void>;
  delete(key: string): Promise<void>;
};

export type SigningRepository = {
  create(input: {
    signingId: string;
    documentName: string;
    message: string;
    signers: Signer[];
    documentKey: string;
  }): Promise<void>;
};
