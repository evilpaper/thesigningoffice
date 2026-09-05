import DocumentPicker from "./document-picker";

export default function StartSigningLanding({
  onPick,
}: {
  onPick: (file: File) => void;
}) {
  return (
    <>
      <article className="flex flex-col gap-4">
        <h1 className="leading-[0.9] font-semibold text-[clamp(3rem,7vw,6rem)]">
          Signera dokument
          <span className="italic font-normal"> direkt.</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Snabbaste sättet att skicka och signera dokument. Säkert, krypterat
          och helt utan krånglig registrering.
        </p>
      </article>
      <DocumentPicker onChange={onPick} />
    </>
  );
}
