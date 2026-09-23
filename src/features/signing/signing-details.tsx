import DocumentNameField from "./document-name-field";
import MessageField from "./message-field";
import type { PrepareFieldError } from "./prepare-values";

type SigningDetailsProps = {
  documentName: string;
  fieldErrors?: readonly PrepareFieldError[];
  onDismissFieldError?: (path: string) => void;
};

export default function SigningDetails({
  documentName,
  fieldErrors = [],
  onDismissFieldError,
}: SigningDetailsProps) {
  const documentNameError = fieldErrors.some(
    (error) => error.path === "documentName",
  )
    ? "Ange ett dokumentnamn."
    : undefined;

  return (
    <div className="flex flex-col gap-5 border-t border-border pt-6">
      <DocumentNameField
        defaultValue={documentName}
        error={documentNameError}
        onChange={
          documentNameError
            ? () => onDismissFieldError?.("documentName")
            : undefined
        }
      />
      <MessageField />
    </div>
  );
}
