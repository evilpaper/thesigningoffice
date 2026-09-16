"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import PrepareSigning from "./prepare-signing";
import StartSigningLanding from "./start-signing-landing";

type State = { status: "idle" } | { status: "preparing"; document: File };

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

  return (
    <section className="flex flex-1 min-h-0 min-w-0 w-full flex-col">
      <PrepareSigning
        document={state.document}
        onCancel={() => setState({ status: "idle" })}
      />
    </section>
  );
}
