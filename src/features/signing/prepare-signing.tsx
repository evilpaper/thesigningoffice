"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// react-pdf / pdf.js need the browser (DOM, canvas, web workers).
// "use client" is not enough — Client Components still SSR in Next.js.
// dynamic(..., { ssr: false }) skips the server and loads PdfViewer only in
// the browser, where those APIs exist.
const PdfViewer = dynamic(
  () => import("@/components/pdf-viewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
  },
);

export default function PrepareSigning({
  file,
  onCancel,
}: {
  file: File;
  onCancel: () => void;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // blob: URLs are browser resources — create here and revoke on cleanup
  // so we don't leak memory when this screen unmounts or `file` changes.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <nav
        aria-label="Förbered signering"
        className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6"
      >
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-foreground cursor-pointer border-0 bg-transparent p-0"
        >
          Avbryt
        </button>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-foreground">Inga fält än</span>
          <span className="text-border" aria-hidden="true">
            |
          </span>
          <button
            type="button"
            disabled
            className="text-muted-foreground cursor-not-allowed border-0 bg-transparent p-0"
          >
            Rensa alla
          </button>
        </div>

        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white cursor-pointer border-0"
        >
          Nästa
        </button>
      </nav>

      <div className="flex flex-1 min-h-0">
        {/* Reserved for signers, field tools, and other prepare controls. */}
        <aside
          aria-hidden="true"
          className="hidden w-[280px] shrink-0 border-r border-border bg-background md:block"
        />

        <div className="flex flex-1 min-h-0 justify-center overflow-auto bg-muted p-6 md:p-10">
          {blobUrl ? <PdfViewer file={blobUrl} /> : null}
        </div>
      </div>
    </div>
  );
}
