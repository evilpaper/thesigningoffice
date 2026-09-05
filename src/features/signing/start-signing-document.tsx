"use client";

import { useState } from "react";
import DocumentPicker from "./document-picker";
import DocumentViewer from "./document-viewer";

type State = { status: "idle" } | { status: "viewing"; file: File };

export default function StartSigningDocument() {
  const [state, setState] = useState<State>({ status: "idle" });

  const handleChange = (file: File) => {
    setState({ status: "viewing", file });
  };

  if (state.status === "idle") {
    return <DocumentPicker onChange={handleChange} />;
  }

  return <DocumentViewer file={state.file} />;
}
