import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function MessageField() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="document-message">
        Meddelande{" "}
        <span className="font-normal text-muted-foreground">(valfritt)</span>
      </Label>
      <Textarea id="document-message" name="message" rows={4} />
    </div>
  );
}
