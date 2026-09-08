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
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer border-0 bg-transparent p-0 text-sm text-foreground"
      >
        Avbryt
      </button>

      <div className="flex items-center gap-3 text-sm">
        <output className="text-foreground">{fieldStatus}</output>
        <span className="text-border" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          disabled={!hasFields}
          title={hasFields ? "Rensa alla fält" : "Inga fält att rensa ännu"}
          className="cursor-pointer border-0 bg-transparent p-0 text-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
        >
          Rensa alla
        </button>
      </div>

      <button
        type="submit"
        form={formId}
        className="cursor-pointer rounded-md border-0 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Nästa
      </button>
    </header>
  );
}
