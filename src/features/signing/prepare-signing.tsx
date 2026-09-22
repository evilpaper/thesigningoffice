"use client";

import { useState } from "react";
import { createSigningAction } from "./create-signing-action";
import CreateSigningError, {
  type CreateSigningErrorReason,
} from "./create-signing-error";
import type { CreatedSigning } from "./ports";
import PrepareSigningContent from "./prepare-signing-content";
import PrepareSigningHeader from "./prepare-signing-header";
import {
  parseSignersFromFormData,
  selectTaxIdentificationNumberErrorsBySigner,
  type TaxIdentificationNumberErrorCode,
  validatePrepareSigningValues,
} from "./prepare-values";
import { useObjectUrl } from "./use-object-url";

type PrepareSigningProps = {
  document: File;
  onCancel: () => void;
  onSuccess: (signing: CreatedSigning) => void;
};

export default function PrepareSigning({
  document,
  onCancel,
  onSuccess,
}: PrepareSigningProps) {
  const documentUrl = useObjectUrl(document);
  const [taxIdentificationNumberErrors, setTaxIdentificationNumberErrors] =
    useState<Readonly<Record<number, TaxIdentificationNumberErrorCode>>>({});
  const [createSigningError, setCreateSigningError] =
    useState<CreateSigningErrorReason | null>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateSigningError(null);

    const formData = new FormData(event.currentTarget);

    const validationResult = validatePrepareSigningValues({
      documentName: String(formData.get("documentName") ?? ""),
      message: String(formData.get("message") ?? ""),
      signers: parseSignersFromFormData(formData),
    });

    // UI only surfaces Personnummer for now — select that subset (or clear).
    setTaxIdentificationNumberErrors(
      validationResult.ok
        ? {}
        : selectTaxIdentificationNumberErrorsBySigner(
            validationResult.fieldErrors,
          ),
    );

    if (!validationResult.ok) {
      return;
    }

    /**
     * The PDF lives in the document prop, not in the form. FormData(event.currentTarget) only has the text fields.
     */
    formData.set("document", document);

    try {
      const result = await createSigningAction(formData);

      if (result.ok) {
        onSuccess(result.signing);
        return;
      }

      setCreateSigningError(result.reason);
    } catch {
      setCreateSigningError("networkError");
    }
  };

  if (!documentUrl) {
    return <div>Loading...</div>;
  }

  return (
    <form className="flex flex-1 min-h-0 flex-col" onSubmit={handleSubmit}>
      <h1 className="sr-only">Förbered signering</h1>
      <PrepareSigningHeader onCancel={onCancel} />
      {createSigningError && (
        <CreateSigningError
          reason={createSigningError}
          onDismiss={() => setCreateSigningError(null)}
        />
      )}
      <PrepareSigningContent
        documentName={document.name}
        documentUrl={documentUrl}
        taxIdentificationNumberErrors={taxIdentificationNumberErrors}
        onTaxIdentificationNumberChange={(signerIndex) => {
          setTaxIdentificationNumberErrors((current) => {
            if (!(signerIndex in current)) {
              return current;
            }

            const next = { ...current };
            delete next[signerIndex];
            return next;
          });
        }}
      />
    </form>
  );
}
