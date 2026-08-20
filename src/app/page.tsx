export default function Home() {
  return (
    <main className="flex flex-1 w-full max-w-7xl mx-auto flex-col lg:flex-row lg:items-start gap-12 lg:gap-16 px-8">
      <section className="flex flex-1 min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
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
        <form className="flex flex-col items-start gap-4">
          <label className="flex flex-col items-start gap-2">
            <input
              type="file"
              name="file"
              className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
            />
          </label>
          <button type="submit">Upload</button>
        </form>
      </section>
    </main>
  );
}
