import { startSigning } from "./start-signing";

export default function StartSigningForm() {
  return (
    <form className="flex flex-col items-start gap-4" action={startSigning}>
      <label className="flex flex-col items-start gap-2">
        <input
          type="file"
          name="document"
          className="text-foreground file:mr-4 file:rounded-none file:border file:border-foreground file:bg-transparent file:px-3 file:py-1.5 file:font-medium file:text-foreground"
        />
      </label>
      <button type="submit">Starta signering</button>
    </form>
  );
}
