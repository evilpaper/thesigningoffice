"use client";

import Link from "next/link";
import { useChrome } from "./chrome";
import ThemeToggle from "./theme-toggle";

export default function Footer() {
  const { preparing } = useChrome();

  if (preparing) {
    return null;
  }

  return (
    <footer className="w-full flex gap-6 flex-wrap items-center justify-between p-8">
      <Link href="/privacy" className="text-sm">
        Privacy
      </Link>
      <ThemeToggle />
    </footer>
  );
}
