"use client";

import { useEffect, useState } from "react";
import { useChrome } from "@/components/chrome";
import PrepareSigning from "./prepare-signing";
import StartSigningLanding from "./start-signing-landing";

type State = { status: "idle" } | { status: "preparing"; file: File };

export default function StartSigningFlow() {
  const [state, setState] = useState<State>({ status: "idle" });
  const { setPreparing } = useChrome();

  useEffect(() => {
    setPreparing(state.status === "preparing");
    return () => setPreparing(false);
  }, [state.status, setPreparing]);

  if (state.status === "idle") {
    return (
      <section className="flex flex-1 min-w-0 w-full max-w-7xl mx-auto flex-col gap-4 px-8 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
        <StartSigningLanding
          onPick={(file) => setState({ status: "preparing", file })}
        />
      </section>
    );
  }

  return (
    <section className="flex flex-1 min-h-0 min-w-0 w-full flex-col">
      <PrepareSigning
        file={state.file}
        onCancel={() => setState({ status: "idle" })}
      />
    </section>
  );
}
