import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center p-8 gap-8">
      <Link
        href="/"
        className="flex items-center gap-3 w-fit"
        aria-label="Express Signering - Home"
      >
        <h1>The Signing Office</h1>
      </Link>
      <Link href="/system-admin">
        <button type="button">System Admin</button>
      </Link>
    </header>
  );
}
