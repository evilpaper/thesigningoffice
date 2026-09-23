"use client";

import { useEffect, useRef, useState } from "react";
import { createSigningAction } from "./create-signing-action";
import CreateSigningError, {
  type CreateSigningErrorReason,
} from "./create-signing-error";
import DocumentPreview from "./document-preview";
import type { CreatedSigning } from "./ports";
import PrepareSigningActions from "./prepare-signing-actions";
import {
  type PrepareFieldError,
  parseSignersFromFormData,
  validatePrepareSigningValues,
} from "./prepare-values";
import SignerList from "./signer-list";
import SigningDetails from "./signing-details";
import { useObjectUrl } from "./use-object-url";

type PrepareSigningProps = {
  document: File;
  onCancel: () => void;
  onSuccess: (signing: CreatedSigning) => void;
};

function prepareFieldErrorRank(path: string): number {
  if (path === "signers") {
    return 0;
  }

  const signerField =
    /^signers\.(\d+)\.(name|taxIdentificationNumber|email)$/.exec(path);
  if (signerField) {
    const fieldRank =
      signerField[2] === "name"
        ? 0
        : signerField[2] === "taxIdentificationNumber"
          ? 1
          : 2;
    return 1000 + Number(signerField[1]) * 10 + fieldRank;
  }

  if (path === "documentName") {
    return 100000;
  }

  return 1000000;
}

function earliestPrepareFieldError(
  fieldErrors: readonly PrepareFieldError[],
): PrepareFieldError | undefined {
  return [...fieldErrors].sort(
    (left, right) =>
      prepareFieldErrorRank(left.path) - prepareFieldErrorRank(right.path),
  )[0];
}

export default function PrepareSigning({
  document,
  onCancel,
  onSuccess,
}: PrepareSigningProps) {
  const documentUrl = useObjectUrl(document);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldErrorsRef = useRef<readonly PrepareFieldError[]>([]);
  const [fieldErrors, setFieldErrors] = useState<readonly PrepareFieldError[]>(
    [],
  );
  const [fieldErrorFocusAttempt, setFieldErrorFocusAttempt] = useState(0);
  const [createSigningError, setCreateSigningError] =
    useState<CreateSigningErrorReason | null>(null);

  fieldErrorsRef.current = fieldErrors;

  useEffect(() => {
    if (fieldErrorFocusAttempt === 0) {
      return;
    }

    const earliest = earliestPrepareFieldError(fieldErrorsRef.current);
    if (!earliest) {
      return;
    }

    const form = formRef.current;
    const target =
      form?.querySelector<HTMLElement>(
        `[name="${CSS.escape(earliest.path)}"]`,
      ) ??
      form?.querySelector<HTMLElement>(
        `[data-prepare-field="${CSS.escape(earliest.path)}"]`,
      );
    target?.focus();
  }, [fieldErrorFocusAttempt]);

  const dismissFieldError = (path: string) => {
    setFieldErrors((current) => {
      const next = current.filter(
        (error) => error.path !== path && !error.path.startsWith(`${path}.`),
      );
      return next.length === current.length ? current : next;
    });
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateSigningError(null);

    const formData = new FormData(event.currentTarget);

    const validationResult = validatePrepareSigningValues({
      documentName: String(formData.get("documentName") ?? ""),
      message: String(formData.get("message") ?? ""),
      signers: parseSignersFromFormData(formData),
    });

    if (!validationResult.ok) {
      setFieldErrors(validationResult.fieldErrors);
      setFieldErrorFocusAttempt((attempt) => attempt + 1);
      return;
    }

    setFieldErrors([]);

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
    <form
      ref={formRef}
      className="flex flex-1 min-h-0 flex-col"
      noValidate
      onSubmit={handleSubmit}
    >
      <h1 className="sr-only">Förbered signering</h1>
      <PrepareSigningActions onCancel={onCancel} />
      {createSigningError && (
        <CreateSigningError
          reason={createSigningError}
          onDismiss={() => setCreateSigningError(null)}
        />
      )}
      <section className="flex flex-1 min-h-0 flex-col md:flex-row">
        <aside
          aria-label="Förbered signering"
          className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto border-b border-border bg-background p-4 md:w-[280px] md:border-b-0 md:border-r"
        >
          <SignerList
            fieldErrors={fieldErrors}
            onDismissFieldError={dismissFieldError}
          />
          <SigningDetails
            documentName={document.name}
            fieldErrors={fieldErrors}
            onDismissFieldError={dismissFieldError}
          />
        </aside>
        <DocumentPreview url={documentUrl} />
      </section>
    </form>
  );
}
