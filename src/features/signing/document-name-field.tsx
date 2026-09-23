import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DocumentNameFieldProps = {
  defaultValue: string;
  error?: string;
  onChange?: () => void;
};

export default function DocumentNameField({
  defaultValue,
  error,
  onChange,
}: DocumentNameFieldProps) {
  const errorId = "document-name-error";

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
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={
          error
            ? "border-destructive focus-visible:ring-destructive"
            : undefined
        }
        onChange={onChange}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
