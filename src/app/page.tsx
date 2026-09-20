import InitiateSigning from "@/features/signing/initiate-signing";

export default function Home() {
  return (
    <main className="flex flex-1 w-full min-h-0 flex-col">
      <InitiateSigning />
    </main>
  );
}
