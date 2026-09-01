"use client";

import { useState } from "react";
import { startSigning } from "./start-signing";

export default function StartSigningForm() {
  const [hasDocument, setHasDocument] = useState(false);

  return (
    <form className="flex flex-col items-start gap-4" action={startSigning}>
      <label className="flex flex-col items-start gap-2">
        <input
          type="file"
          name="document"
          className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
          onChange={(event) => {
            setHasDocument((event.target.files?.length ?? 0) > 0);
          }}
        />
      </label>
      <button
        type="submit"
        disabled={!hasDocument}
        className="rounded-none border border-foreground bg-foreground px-3 py-1.5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
      >
        Starta signering
      </button>
    </form>
  );
}
