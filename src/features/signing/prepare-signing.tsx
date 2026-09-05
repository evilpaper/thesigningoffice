"use client";

import { useEffect, useState } from "react";

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

  return (
    <iframe
      title={file.name}
      src={blobUrl}
      className="min-h-[70dvh] w-full flex-1 border-0 bg-muted lg:min-h-0"
    />
  );
}
