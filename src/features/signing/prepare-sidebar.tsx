import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type PrepareSigningValues,
  parseSignersFromFormData,
} from "./prepare-values";
import SignerList from "./signer-list";

type PrepareSidebarProps = {
  id: string;
  defaultDocumentName: string;
  onSubmit: (values: PrepareSigningValues) => void;
};

const documentNameId = "document-name";
const messageId = "signing-message";

export default function PrepareSidebar({
  id,
  defaultDocumentName,
  onSubmit,
}: PrepareSidebarProps) {
  return (
    <aside
      aria-label="Förbered signering"
      className="w-full shrink-0 overflow-y-auto border-b border-border bg-background md:w-[280px] md:border-b-0 md:border-r"
    >
      <form
        id={id}
        className="flex flex-col gap-6 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const documentName = String(
            formData.get("documentName") ?? "",
          ).trim();
          const message = String(formData.get("message") ?? "").trim();
          const signers = parseSignersFromFormData(formData);

          if (!documentName || signers.length === 0) {
            return;
          }

          if (
            signers.some(
              (signer) =>
                !signer.name ||
                !signer.taxIdentificationNumber ||
                !signer.email,
            )
          ) {
            return;
          }

          onSubmit({ documentName, message, signers });
        }}
      >
        <SignerList />

        <div className="flex flex-col gap-5 border-t border-border pt-6">
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
        </div>
      </form>
    </aside>
  );
}
