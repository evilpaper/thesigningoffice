"use client";

import { useState } from "react";
import DocumentViewer from "./document-viewer";

type State = { status: "idle" } | { status: "viewing"; file: File };

export default function StartSigningDocument() {
  const [state, setState] = useState<State>({ status: "idle" });

  if (state.status === "idle") {
    return (
      <label className="flex flex-col items-start gap-2">
        <input
          type="file"
          name="document"
          accept="application/pdf"
          required
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            setState({ status: "viewing", file });
          }}
          className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
        />
      </label>
    );
  }

  return <DocumentViewer file={state.file} />;
}
