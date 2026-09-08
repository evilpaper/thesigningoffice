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

const fieldClassName =
  "rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
          <label
            htmlFor={documentNameId}
            className="text-sm font-medium text-foreground"
          >
            Dokumentnamn{" "}
            <span className="font-normal text-muted-foreground">
              (obligatoriskt)
            </span>
          </label>
          <input
            id={documentNameId}
            name="documentName"
            type="text"
            required
            defaultValue={defaultDocumentName}
            autoComplete="off"
            className={fieldClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={messageId}
            className="text-sm font-medium text-foreground"
          >
            Meddelande{" "}
            <span className="font-normal text-muted-foreground">
              (valfritt)
            </span>
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={4}
            className={`resize-y ${fieldClassName}`}
          />
        </div>
      </form>
    </aside>
  );
}
