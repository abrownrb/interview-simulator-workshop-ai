"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          InterviewPrep AI
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/interview?mode=practice"
            className={`text-sm font-medium transition-colors ${
              pathname === "/interview"
                ? "text-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Practice
          </Link>
        </nav>
      </div>
    </header>
  );
}
