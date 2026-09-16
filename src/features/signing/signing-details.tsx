import DocumentNameField from "./document-name-field";
import MessageField from "./message-field";

type SigningDetailsProps = {
  documentName: string;
};

export default function SigningDetails({ documentName }: SigningDetailsProps) {
  return (
    <div className="flex flex-col gap-5 border-t border-border pt-6">
      <DocumentNameField defaultValue={documentName} />
      <MessageField />
    </div>
  );
}
