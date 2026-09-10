"use client";

import DocumentPreview from "./document-preview";
import PrepareSidebar from "./prepare-sidebar";
import PrepareToolbar from "./prepare-toolbar";
import type { PrepareSigningValues } from "./prepare-values";
import { useObjectUrl } from "./use-object-url";

const prepareFormId = "prepare-signing";

type PrepareSigningProps = {
  file: File;
  onCancel: () => void;
  onContinue?: (values: PrepareSigningValues) => void;
};

export default function PrepareSigning({
  file,
  onCancel,
  onContinue,
}: PrepareSigningProps) {
  const blobUrl = useObjectUrl(file);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <h1 className="sr-only">Förbered signering</h1>
      <PrepareToolbar
        formId={prepareFormId}
        fieldCount={0}
        onCancel={onCancel}
      />
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        <PrepareSidebar
          id={prepareFormId}
          defaultDocumentName={file.name}
          onSubmit={(values) => {
            onContinue?.(values);
          }}
        />
        <DocumentPreview url={blobUrl} />
      </div>
    </div>
  );
}
