"use client";

export default function DocumentViewer({ file }: { file: File }) {
  const blobUrl = URL.createObjectURL(file);
  return (
    <iframe
      title={file.name}
      src={blobUrl}
      className="min-h-[70dvh] w-full flex-1 border-0 bg-muted lg:min-h-0"
    />
  );
}
