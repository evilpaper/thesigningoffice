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

export default function PrepareSigning({ file }: { file: File }) {
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

  if (!blobUrl) {
    return null;
  }

  return <PdfViewer file={blobUrl} />;
}
