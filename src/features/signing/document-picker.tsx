"use client";

import Dropzone from "@/components/dropzone";

export default function DocumentPicker({
  onChange,
}: {
  onChange: (file: File) => void;
}) {
  return (
    <Dropzone
      onChange={(files) => {
        onChange(files[0]);
      }}
      accept="application/pdf"
      multiple={false}
    />
  );
}
