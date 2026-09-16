import DocumentPreview from "./document-preview";
import SignerList from "./signer-list";
import SigningDetails from "./signing-details";

type PrepareSigningContentProps = {
  documentName: string;
  documentUrl: string;
};

export default function PrepareSigningContent({
  documentName,
  documentUrl,
}: PrepareSigningContentProps) {
  return (
    <section className="flex flex-1 min-h-0 flex-col md:flex-row">
      <aside
        aria-label="Förbered signering"
        className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto border-b border-border bg-background p-4 md:w-[280px] md:border-b-0 md:border-r"
      >
        <SignerList />
        <SigningDetails documentName={documentName} />
      </aside>
      <DocumentPreview url={documentUrl} />
    </section>
  );
}
