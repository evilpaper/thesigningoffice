"use client";

import { useEffect, useState } from "react";

export default function StartSigningForm() {
  const [file, setFile] = useState<File | null>(null);
  /**
   * Viewers and media tags expect a string URL as src="..."
   * Thus when we have the file in JS memory we need to create a URL for it
   * so it can be used as a src="..." and rendered in the browser
   */
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setBlobUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setBlobUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (file) {
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

  return (
    <form className="flex flex-col items-start gap-4">
      <label className="flex flex-col items-start gap-2">
        <input
          type="file"
          name="document"
          accept="application/pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
          }}
          className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
        />
      </label>
    </form>
  );
}
