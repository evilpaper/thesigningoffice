"use client";

import { uploadFile } from "./start-signing-upload-action";

export default function StartSigningForm() {
  return (
    <form className="flex flex-col items-start gap-4" action={uploadFile}>
      <label className="flex flex-col items-start gap-2">
        <input
          type="file"
          name="file"
          className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
        />
      </label>
      <button type="submit">Upload</button>
    </form>
  );
}
