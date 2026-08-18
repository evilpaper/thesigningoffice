import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Signing Office",
  description: "The Signing Office is a fast and easy e-signing service for small businesses, organizations, and individuals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <header className="w-full flex flex-col sm:flex-row justify-between items-center p-8 gap-8">
					<Link
						href="/"
						className="flex items-center gap-3 w-fit"
						aria-label="Express Signering - Home"
					>
						<h1>The Signing Office</h1>
					</Link>
					<Link href="/system-admin">
						<button>System Admin</button>
					</Link>
				</header>
				{children}
        <footer className="w-full flex gap-[24px] flex-wrap items-center justify-between p-8">
					<Link href="/privacy" className="text-sm">
						Privacy
					</Link>
				</footer>
      </body>
    </html>
  );
}
