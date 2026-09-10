import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type DocumentDetailsValues = {
  documentName: string;
  message: string;
};

type DocumentDetailsFormProps = {
  id: string;
  defaultDocumentName: string;
  onSubmit: (values: DocumentDetailsValues) => void;
};

const documentNameId = "document-name";
const messageId = "signing-message";

export default function DocumentDetailsForm({
  id,
  defaultDocumentName,
  onSubmit,
}: DocumentDetailsFormProps) {
  return (
    <aside
      aria-label="Dokumentuppgifter"
      className="w-full shrink-0 border-b border-border bg-background md:w-[280px] md:border-b-0 md:border-r"
    >
      <form
        id={id}
        className="flex flex-col gap-5 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const documentName = String(
            formData.get("documentName") ?? "",
          ).trim();
          const message = String(formData.get("message") ?? "").trim();

          if (!documentName) {
            return;
          }

          onSubmit({ documentName, message });
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor={documentNameId}>
            Dokumentnamn{" "}
            <span className="font-normal text-muted-foreground">
              (obligatoriskt)
            </span>
          </Label>
          <Input
            id={documentNameId}
            name="documentName"
            required
            defaultValue={defaultDocumentName}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={messageId}>
            Meddelande{" "}
            <span className="font-normal text-muted-foreground">
              (valfritt)
            </span>
          </Label>
          <Textarea id={messageId} name="message" rows={4} />
        </div>
      </form>
    </aside>
  );
}
