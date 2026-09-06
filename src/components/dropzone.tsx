"use client";

import { type ChangeEvent, type DragEvent, useCallback, useState } from "react";

interface DropzoneProps {
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

function acceptHint(accept: string): string {
  if (accept === "*") return "Alla filtyper";
  if (accept.includes("application/pdf") || accept.includes(".pdf")) {
    return "Endast PDF-dokument";
  }
  return `Accepterade format: ${accept}`;
}

function acceptError(accept: string): string {
  if (accept.includes("application/pdf") || accept.includes(".pdf")) {
    return "Ogiltig filtyp. Endast PDF.";
  }
  return `Ogiltig filtyp. Accepteras: ${accept}`;
}

export default function Dropzone({
  onChange,
  accept = "*",
  multiple = false,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputId = "dropzone-input";

  const validateFiles = useCallback(
    (files: File[]) => {
      if (!multiple && files.length > 1) {
        setError("Endast en fil är tillåten.");
        return false;
      }
      if (accept !== "*") {
        const allowedTypes = accept.split(",").map((t) => t.trim());
        const allValid = files.every((file) =>
          allowedTypes.some(
            (type) => file.type === type || file.name.endsWith(type),
          ),
        );
        if (!allValid) {
          setError(acceptError(accept));
          return false;
        }
      }
      setError("");
      return true;
    },
    [accept, multiple],
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (!validateFiles(fileArray)) return;
      onChange(fileArray);
    },
    [validateFiles, onChange],
  );

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center">
      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center gap-3
          border border-dashed rounded-2xl
          bg-muted p-10 cursor-pointer
          transition-colors duration-200
          ${
            isDragging
              ? "border-foreground"
              : "border-border hover:border-foreground"
          }
        `}
      >
        <span className="text-5xl select-none" aria-hidden="true">
          📄
        </span>

        <p className="text-muted-foreground text-base text-center">
          {isDragging
            ? "Släpp dokumentet här"
            : "Dra och släpp ditt dokument här, eller klicka för att välja"}
        </p>
        <p className="text-muted-foreground/70 text-sm text-center">
          {acceptHint(accept)}
        </p>

        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
      </label>

      {error && (
        <p className="mt-3 text-sm text-destructive text-center">{error}</p>
      )}
    </section>
  );
}
