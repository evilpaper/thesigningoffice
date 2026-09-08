"use client";

import DocumentDetailsForm, {
  type DocumentDetailsValues,
} from "./document-details-form";
import DocumentPreview from "./document-preview";
import PrepareToolbar from "./prepare-toolbar";
import { useObjectUrl } from "./use-object-url";

const prepareFormId = "prepare-signing";

type PrepareSigningProps = {
  file: File;
  onCancel: () => void;
  onContinue?: (values: DocumentDetailsValues) => void;
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
        <DocumentDetailsForm
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
