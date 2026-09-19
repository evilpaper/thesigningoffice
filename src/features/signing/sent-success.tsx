"use client";

import { useEffect, useRef } from "react";

export default function SentSuccess({ onAgain }: { onAgain: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <output className="flex flex-col gap-6">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="success-rise outline-none leading-[0.85] font-semibold text-[clamp(3.5rem,9vw,7.5rem)] tracking-[-0.04em]"
        >
          Skickat
          <span className="italic font-normal text-primary">!</span>
        </h1>

        <div
          className="success-draw h-0.5 w-14 origin-left bg-primary"
          style={{ animationDelay: "140ms" }}
          aria-hidden
        />

        <div
          className="success-rise flex max-w-md flex-col gap-3"
          style={{ animationDelay: "220ms" }}
        >
          <p className="text-lg leading-relaxed text-muted-foreground">
            Dokumentet har skickats för signering.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Tack för att du använder{" "}
            <span className="text-foreground">The Signing Office</span>.
          </p>
        </div>
      </output>

      <button
        type="button"
        onClick={onAgain}
        className="success-rise w-fit text-lg underline underline-offset-4 decoration-1 transition-opacity hover:opacity-70"
        style={{ animationDelay: "380ms" }}
      >
        Skicka ett till
      </button>
    </div>
  );
}
