import { Button } from "@/components/ui/button";

type PrepareToolbarProps = {
  formId: string;
  fieldCount: number;
  onCancel: () => void;
};

export default function PrepareToolbar({
  formId,
  fieldCount,
  onCancel,
}: PrepareToolbarProps) {
  const hasFields = fieldCount > 0;
  const fieldStatus =
    fieldCount === 0
      ? "Inga fält än"
      : fieldCount === 1
        ? "1 fält"
        : `${fieldCount} fält`;

  return (
    <header
      role="toolbar"
      aria-label="Förbered signering"
      className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6"
    >
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        Avbryt
      </Button>

      <div className="flex items-center gap-3 text-sm">
        <output className="text-foreground">{fieldStatus}</output>
        <span className="text-border" aria-hidden="true">
          |
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!hasFields}
          title={hasFields ? "Rensa alla fält" : "Inga fält att rensa ännu"}
        >
          Rensa alla
        </Button>
      </div>

      <Button type="submit" form={formId}>
        Nästa
      </Button>
    </header>
  );
}
