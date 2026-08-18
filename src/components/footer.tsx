import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex gap-[24px] flex-wrap items-center justify-between p-8">
      <Link href="/privacy" className="text-sm">
        Privacy
      </Link>
    </footer>
  );
}
