"use client";

import { useState } from "react";
import PrepareSigning from "./prepare-signing";
import StartSigningLanding from "./start-signing-landing";

type State = { status: "idle" } | { status: "preparing"; file: File };

export default function StartSigningFlow() {
  const [state, setState] = useState<State>({ status: "idle" });

  const layoutClassName =
    state.status === "idle"
      ? "flex flex-1 min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center"
      : "flex flex-1 min-w-0 flex-col gap-4 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)]";

  return (
    <section className={layoutClassName}>
      {state.status === "idle" ? (
        <StartSigningLanding
          onPick={(file) => setState({ status: "preparing", file })}
        />
      ) : (
        <PrepareSigning file={state.file} />
      )}
    </section>
  );
}
