"use client";

export default function DocumentPicker({
  onChange,
}: {
  onChange: (file: File) => void;
}) {
  return (
    <label className="flex flex-col items-start gap-2">
      <input
        type="file"
        name="document"
        accept="application/pdf"
        required
        className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }
          onChange(file);
        }}
      />
    </label>
  );
}
