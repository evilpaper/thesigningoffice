import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SignerList from "./signer-list";

type PrepareSidebarProps = {
  defaultDocumentName: string;
};

const documentNameId = "document-name";
const messageId = "signing-message";

export default function PrepareSidebar({
  defaultDocumentName,
}: PrepareSidebarProps) {
  return (
    <aside
      aria-label="Förbered signering"
      className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto border-b border-border bg-background p-4 md:w-[280px] md:border-b-0 md:border-r"
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
    </aside>
  );
}
