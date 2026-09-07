"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// pdf.js does heavy PDF parsing in a separate background thread (a "web worker")
// so the page stays responsive while the document loads. We have to point it at
// the worker script file — without this line, PDF rendering will fail.
//
// This is a global setting on the shared pdfjs module — we do not pass it into
// <Document> or <Page>. Those components use the same module under the hood and
// pick up this worker path automatically.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PdfViewer({ file }: { file: string }) {
  return (
    <Document file={file}>
      <Page pageNumber={1} />
    </Document>
  );
}
