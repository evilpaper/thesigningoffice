"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import ChooseDocument from "./choose-document";
import type { CreatedSigning } from "./ports";
import PrepareSigning from "./prepare-signing";
import SentSuccess from "./sent-success";

type State =
  | { status: "choosing" }
  | { status: "preparing"; document: File }
  | { status: "sent"; signing: CreatedSigning };

export default function InitiateSigning() {
  const [state, setState] = useState<State>({ status: "choosing" });

  if (state.status === "choosing") {
    return (
      <>
        <section className="flex flex-1 min-w-0 w-full max-w-7xl mx-auto flex-col gap-4 px-8 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
          <ChooseDocument
            onPick={(document) => setState({ status: "preparing", document })}
          />
        </section>
        <Footer />
      </>
    );
  }

  if (state.status === "sent") {
    return (
      <>
        <section className="flex flex-1 min-w-0 w-full max-w-7xl mx-auto flex-col gap-4 px-8 lg:sticky lg:top-8 lg:h-[calc(100dvh-12rem)] lg:justify-center">
          <SentSuccess
            signing={state.signing}
            onAgain={() => setState({ status: "choosing" })}
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
        onCancel={() => setState({ status: "choosing" })}
        onSuccess={(signing) => setState({ status: "sent", signing })}
      />
    </section>
  );
}
