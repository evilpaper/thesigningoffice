"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import PrepareSigning from "./prepare-signing";
import StartSigningLanding from "./start-signing-landing";

type State =
  | { status: "idle" }
  | { status: "preparing"; document: File }
  | { status: "success" };

export default function StartSigningFlow() {
  const [state, setState] = useState<State>({ status: "idle" });

  if (state.status === "idle") {
    return (
      <>
        <section className="flex flex-1 min-w-0 w-full max-w-7xl mx-auto flex-col gap-4 px-8 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
          <StartSigningLanding
            onPick={(document) => setState({ status: "preparing", document })}
          />
        </section>
        <Footer />
      </>
    );
  }

  if (state.status === "success") {
    return (
      <>
        <section className="flex flex-1 min-w-0 w-full max-w-7xl mx-auto flex-col gap-4 px-8 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
          <h1 className="leading-[0.9] font-semibold text-[clamp(3rem,7vw,6rem)] outline-none">
            Skickat!
          </h1>
          <p>Dokumentet har skickats för signering.</p>
          <p>Tack för att du använder The Signing Office..</p>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <section className="flex flex-1 min-h-0 min-w-0 w-full flex-col">
      <PrepareSigning
        document={state.document}
        onCancel={() => setState({ status: "idle" })}
        onSuccess={() => setState({ status: "success" })}
      />
    </section>
  );
}
