import StartSigningForm from "./start-signing-form";
import StartSigningHero from "./start-signing-hero";

export default function StartSigningSection() {
  return (
    <section className="flex flex-1 min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
      <StartSigningHero />
      <StartSigningForm />
    </section>
  );
}
