"use client";

import { type ChangeEvent, type DragEvent, useCallback, useState } from "react";

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
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

function UploadIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-muted-foreground"
    >
      <path
        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8l-5-5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Dropzone({
  onFilesSelected,
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
      onFilesSelected(fileArray);
    },
    [validateFiles, onFilesSelected],
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
        <UploadIcon />

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
