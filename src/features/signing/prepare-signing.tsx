"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DocumentViewer from "./document-viewer";
import {
  parseSignersFromFormData,
  validatePrepareSigningValues,
} from "./prepare-values";
import SignerList from "./signer-list";
import { useObjectUrl } from "./use-object-url";

type PrepareSigningProps = {
  file: File;
  onCancel: () => void;
};

export default function PrepareSigning({
  file,
  onCancel,
}: PrepareSigningProps) {
  const blobUrl = useObjectUrl(file);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const result = validatePrepareSigningValues({
      documentName: String(formData.get("documentName") ?? ""),
      message: String(formData.get("message") ?? ""),
      signers: parseSignersFromFormData(formData),
    });

    if (!result.ok) {
      return;
    }
  };

  if (!blobUrl) {
    return <div>Loading...</div>;
  }

  return (
    <form className="flex flex-1 min-h-0 flex-col" onSubmit={handleSubmit}>
      <h1 className="sr-only">Förbered signering</h1>
      {/* SiganturePreparationHeader */}
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
        <output className="text-sm text-foreground">Inga fält än</output>
        <Button type="submit">Nästa</Button>
      </header>
      {/* SiganturePreparationContent */}
      <section className="flex flex-1 min-h-0 flex-col md:flex-row">
        <aside
          aria-label="Förbered signering"
          className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto border-b border-border bg-background p-4 md:w-[280px] md:border-b-0 md:border-r"
        >
          {/* SignaturePreparationSignerList */}
          <SignerList />
          {/* SignaturePreparationDetails */}
          <div className="flex flex-col gap-5 border-t border-border pt-6">
            {/* DocumentTitleField */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="document-name">
                Dokumentnamn{" "}
                <span className="font-normal text-muted-foreground">
                  (obligatoriskt)
                </span>
              </Label>
              <Input
                id="document-name"
                name="document-name"
                required
                defaultValue={file.name}
                autoComplete="off"
              />
            </div>
            {/* DocumentMessageField */}
            <div className="flex flex-col gap-2">
              <Label htmlFor={"document-message"}>
                Meddelande{" "}
                <span className="font-normal text-muted-foreground">
                  (valfritt)
                </span>
              </Label>
              <Textarea
                id={"document-message"}
                name="document-message"
                rows={4}
              />
            </div>
          </div>
        </aside>
        {/* SignaturePreparationDocument */}
        <DocumentViewer url={blobUrl} />
      </section>
    </form>
  );
}
