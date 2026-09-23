import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PrepareSigningActionsProps = {
  onCancel: () => void;
};

export default function PrepareSigningActions({
  onCancel,
}: PrepareSigningActionsProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="gap-1.5"
      >
        <ArrowLeft aria-hidden className="size-4" strokeWidth={1.75} />
        Avbryt
      </Button>
      <Button type="submit">Nästa</Button>
    </header>
  );
}
