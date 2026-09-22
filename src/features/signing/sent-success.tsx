"use client";

import { useEffect, useRef } from "react";
import type { CreatedSigning } from "./ports";

type SentSuccessProps = {
  signing: CreatedSigning;
  onAgain: () => void;
};

export default function SentSuccess({ signing, onAgain }: SentSuccessProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="success-rise outline-none leading-[0.95] font-semibold text-[clamp(3rem,8vw,6rem)] tracking-[-0.04em]"
        >
          Dokumentet skickat
          <span className="italic font-normal text-primary">!</span>
        </h1>

        <div
          className="success-draw h-0.5 w-14 origin-left bg-primary"
          style={{ animationDelay: "140ms" }}
          aria-hidden
        />

        <dl
          className="success-rise flex max-w-md flex-col gap-6"
          style={{ animationDelay: "220ms" }}
        >
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Dokument
            </dt>
            <dd className="text-lg text-foreground">{signing.documentName}</dd>
          </div>

          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-muted-foreground">Till</dt>
            <dd>
              <ul className="flex flex-col gap-1 text-lg text-foreground">
                {signing.signerEmails.map((email, index) => (
                  <li key={`${index}-${email}`}>{email}</li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

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
