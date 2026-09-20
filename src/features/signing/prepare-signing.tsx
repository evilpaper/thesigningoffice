"use client";

import { X } from "lucide-react";
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

const STORAGE_FAILED_MESSAGE =
  "Dokumentet kunde inte sparas, så signeringen skapades inte. Försök igen.";
const DATABASE_UNAVAILABLE_MESSAGE =
  "Uppgifterna kunde inte sparas, så signeringen skapades inte. Försök igen.";
const NETWORK_ERROR_MESSAGE =
  "Anslutningen bröts, så signeringen kunde inte skapas. Kontrollera din internetanslutning och försök igen.";

type PrepareSigningProps = {
  document: File;
  onCancel: () => void;
  onSuccess: () => void;
};

export default function PrepareSigning({
  document,
  onCancel,
  onSuccess,
}: PrepareSigningProps) {
  const documentUrl = useObjectUrl(document);
  const [taxIdentificationNumberErrors, setTaxIdentificationNumberErrors] =
    useState<Readonly<Record<number, TaxIdentificationNumberErrorCode>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

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
        onSuccess();
        return;
      }

      if (result.reason === "storageFailed") {
        setSubmitError(STORAGE_FAILED_MESSAGE);
        return;
      }

      if (result.reason === "databaseUnavailable") {
        setSubmitError(DATABASE_UNAVAILABLE_MESSAGE);
      }
    } catch {
      setSubmitError(NETWORK_ERROR_MESSAGE);
    }
  };

  if (!documentUrl) {
    return <div>Loading...</div>;
  }

  return (
    <form className="flex flex-1 min-h-0 flex-col" onSubmit={handleSubmit}>
      <h1 className="sr-only">Förbered signering</h1>
      <PrepareSigningHeader onCancel={onCancel} />
      {submitError ? (
        <div className="flex shrink-0 items-center justify-between gap-4 bg-destructive px-4 py-3 text-destructive-foreground sm:px-6">
          <p role="alert" className="text-sm">
            {submitError}
          </p>
          <button
            type="button"
            aria-label="Stäng"
            onClick={() => setSubmitError(null)}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-destructive-soft-foreground/10 focus-visible:ring-2 focus-visible:ring-destructive-soft-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-destructive-soft"
          >
            <X aria-hidden className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      ) : null}
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
