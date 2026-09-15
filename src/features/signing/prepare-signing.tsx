"use client";

import DocumentPreview from "./document-preview";
import PrepareSidebar from "./prepare-sidebar";
import PrepareToolbar from "./prepare-toolbar";
import {
  parseSignersFromFormData,
  validatePrepareSigningValues,
} from "./prepare-values";
import { useObjectUrl } from "./use-object-url";

type PrepareSigningProps = {
  file: File;
  onCancel: () => void;
};

export default function PrepareSigning({
  file,
  onCancel,
}: PrepareSigningProps) {
  const blobUrl = useObjectUrl(file);

  return (
    <form
      className="flex flex-1 min-h-0 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const result = validatePrepareSigningValues({
          documentName: String(formData.get("documentName") ?? ""),
          message: String(formData.get("message") ?? ""),
          signers: parseSignersFromFormData(formData),
        });

        if (!result.ok) {
          return;
        }
      }}
    >
      <h1 className="sr-only">Förbered signering</h1>
      <PrepareToolbar fieldCount={0} onCancel={onCancel} />
      <section className="flex flex-1 min-h-0 flex-col md:flex-row">
        <PrepareSidebar defaultDocumentName={file.name} />
        <DocumentPreview url={blobUrl} />
      </section>
    </form>
  );
}
