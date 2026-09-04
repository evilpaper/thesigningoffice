"use client";

import { useEffect, useState } from "react";

/**
 * What we know about the Document on this screen.
 * blob URLs are a DOM resource — created/revoked in an effect, not stored here.
 */
type State = { status: "idle" } | { status: "viewing"; file: File };

export default function StartSigningDocument() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state.status !== "viewing") {
      setBlobUrl(null);
      return;
    }

    const url = URL.createObjectURL(state.file);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [state]);

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

  if (!blobUrl) {
    return null;
  }

  return (
    <iframe
      title={state.file.name}
      src={blobUrl}
      className="min-h-[70dvh] w-full flex-1 border-0 bg-muted lg:min-h-0"
    />
  );
}
