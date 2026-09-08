"use client";

import dynamic from "next/dynamic";

// react-pdf / pdf.js need the browser (DOM, canvas, web workers).
// "use client" is not enough — Client Components still SSR in Next.js.
// dynamic(..., { ssr: false }) skips the server and loads PdfViewer only in
// the browser, where those APIs exist.
const PdfViewer = dynamic(
  () => import("@/components/pdf-viewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <PreviewSkeleton />,
  },
);

function PreviewSkeleton() {
  return (
    <output
      aria-busy="true"
      className="block h-120 w-full max-w-105 animate-pulse rounded-md bg-border/60"
    >
      <span className="sr-only">Laddar dokumentförhandsvisning</span>
    </output>
  );
}

export default function DocumentPreview({ url }: { url: string | null }) {
  return (
    <div className="flex flex-1 min-h-0 justify-center overflow-auto bg-muted p-6 md:p-10">
      {url ? <PdfViewer file={url} /> : <PreviewSkeleton />}
    </div>
  );
}
