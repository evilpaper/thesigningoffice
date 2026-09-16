"use client";

import { useState } from "react";
import { createSigningAction } from "./create-signing-action";
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
};

export default function PrepareSigning({
  document,
  onCancel,
}: PrepareSigningProps) {
  const documentUrl = useObjectUrl(document);
  const [taxIdentificationNumberErrors, setTaxIdentificationNumberErrors] =
    useState<Readonly<Record<number, TaxIdentificationNumberErrorCode>>>({});

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

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
    const result = await createSigningAction(formData);

    console.log("createSigningAction result:", result);
  };

  if (!documentUrl) {
    return <div>Loading...</div>;
  }

  return (
    <form className="flex flex-1 min-h-0 flex-col" onSubmit={handleSubmit}>
      <h1 className="sr-only">Förbered signering</h1>
      <PrepareSigningHeader onCancel={onCancel} />
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
