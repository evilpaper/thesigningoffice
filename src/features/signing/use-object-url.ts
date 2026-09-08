"use client";

import { useEffect, useState } from "react";

/**
 * Creates a blob: URL for a File/Blob and revokes it on cleanup
 * so we don't leak memory when the consumer unmounts or `source` changes.
 */
export function useObjectUrl(source: Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source) {
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(source);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [source]);

  return url;
}
