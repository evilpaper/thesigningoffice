import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DocumentNameFieldProps = {
  defaultValue: string;
};

export default function DocumentNameField({
  defaultValue,
}: DocumentNameFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="document-name">
        Dokumentnamn{" "}
        <span className="font-normal text-muted-foreground">
          (obligatoriskt)
        </span>
      </Label>
      <Input
        id="document-name"
        name="documentName"
        required
        defaultValue={defaultValue}
        autoComplete="off"
      />
    </div>
  );
}
