import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Footer() {
  return (
    <footer className="w-full flex gap-6 flex-wrap items-center justify-between p-8">
      <Link href="/privacy" className="text-sm">
        Privacy
      </Link>
      <ThemeToggle />
    </footer>
  );
}
