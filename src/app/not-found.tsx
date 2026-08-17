import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 w-full max-w-7xl mx-auto flex-col lg:flex-row lg:items-start gap-12 lg:gap-16">
      <section className="flex flex-1 min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
        <article className="flex flex-col gap-4">
          <h1 className="leading-[0.9] font-semibold text-[clamp(3rem,7vw,6rem)]">
            Sidan
            <br />
            finns
            <br />
            <span className="italic font-normal">inte.</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Den här adressen leder ingenstans. Gå tillbaka till startsidan för
            att skicka och signera dokument.
          </p>
          <Link
            href="/"
            className="text-lg w-fit underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity"
          >
            Till startsidan
          </Link>
        </article>
      </section>
      <section className="flex flex-1 min-w-0 flex-col gap-2" />
    </main>
  );
}
