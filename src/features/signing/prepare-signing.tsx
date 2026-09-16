"use client";

import PrepareSigningContent from "./prepare-signing-content";
import PrepareSigningHeader from "./prepare-signing-header";
import {
  parseSignersFromFormData,
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

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const validationResult = validatePrepareSigningValues({
      documentName: String(formData.get("documentName") ?? ""),
      message: String(formData.get("message") ?? ""),
      signers: parseSignersFromFormData(formData),
    });

    if (!validationResult.ok) {
      return;
    }
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
      />
    </form>
  );
}
