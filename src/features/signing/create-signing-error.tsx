import { X } from "lucide-react";
import type { CreateSigningResult } from "./create-signing";

type CreateSigningErrorProps = {
  reason: CreateSigningErrorReason;
  onDismiss: () => void;
};

type CreateSigningFailureReason = Extract<
  CreateSigningResult,
  { ok: false }
>["reason"];

export type CreateSigningErrorReason =
  | CreateSigningFailureReason
  | "networkError";

const MESSAGE_BY_REASON: Record<CreateSigningErrorReason, string> = {
  invalidDocument:
    "Dokumentet saknas eller är tomt. Gå tillbaka och välj ett annat dokument.",
  invalidInput:
    "Uppgifterna kunde inte verifieras. Kontrollera formuläret och försök igen.",
  storageFailed:
    "Dokumentet kunde inte sparas, så signeringen skapades inte. Försök igen.",
  databaseUnavailable:
    "Uppgifterna kunde inte sparas, så signeringen skapades inte. Försök igen.",
  networkError:
    "Anslutningen bröts, så signeringen kunde inte skapas. Kontrollera din internetanslutning och försök igen.",
};

export default function CreateSigningError({
  reason,
  onDismiss,
}: CreateSigningErrorProps) {
  return (
    <div
      role="alert"
      className="flex shrink-0 items-center justify-between gap-4 bg-destructive px-4 py-3 text-destructive-foreground sm:px-6"
    >
      <p className="text-sm">{MESSAGE_BY_REASON[reason]}</p>
      <button
        type="button"
        aria-label="Stäng felmeddelande"
        onClick={onDismiss}
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-destructive-soft-foreground/10 focus-visible:ring-2 focus-visible:ring-destructive-soft-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-destructive-soft"
      >
        <X aria-hidden className="size-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
