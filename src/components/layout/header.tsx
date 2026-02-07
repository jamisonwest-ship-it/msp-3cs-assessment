"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/">
          <Logo width={140} height={46} />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/assess"
            className="text-msp-primary hover:text-msp-blue transition-colors"
          >
            Assessment
          </Link>
        </nav>
      </div>
    </header>
  );
}
