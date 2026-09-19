import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="w-full flex flex-col sm:flex-row justify-between items-center p-8 gap-8">
      <a
        href="/"
        className="flex items-center gap-1 w-fit"
        aria-label="The Signing Office - Home"
      >
        <Logo />
        <h1>The Signing Office</h1>
      </a>
      <Link href="/system-admin">
        <button type="button">System Admin</button>
      </Link>
    </header>
  );
}
