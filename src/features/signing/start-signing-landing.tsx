import DocumentPicker from "./document-picker";

export default function StartSigningLanding({
  onPick,
}: {
  onPick: (file: File) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-12 lg:grid lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-16">
      <article className="flex flex-col gap-4">
        <h1 className="leading-[0.9] font-semibold text-[clamp(3rem,7vw,6rem)]">
          Signera dokument
          <span className="italic font-normal"> direkt.</span>
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Snabbaste sättet att skicka och signera dokument. Säkert, krypterat
          och helt utan krånglig registrering.
        </p>
      </article>
      <DocumentPicker onChange={onPick} />
    </div>
  );
}
