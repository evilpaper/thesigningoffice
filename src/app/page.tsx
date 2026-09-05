import StartSigningFlow from "@/features/signing/start-signing-flow";

export default function Home() {
  return (
    <main className="flex flex-1 w-full max-w-7xl mx-auto flex-col lg:flex-row lg:items-start gap-12 lg:gap-16 px-8">
      <StartSigningFlow />
    </main>
  );
}
