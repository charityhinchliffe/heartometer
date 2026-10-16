"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#introduction", label: "Introduction" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#demographics", label: "Demographics" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-30 h-28 bg-gradient-to-b from-white via-white/80 to-transparent transition-opacity duration-500 ${
        scrolled ? "opacity-100" : "opacity-70"
      }`}
      aria-hidden="true"
    />
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
          scrolled
            ? "border-line bg-white/95 shadow-[0_16px_50px_-28px_rgba(14,122,70,0.7)] backdrop-blur-xl"
            : "border-white/70 bg-white/55 backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 pl-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pine text-white shadow-[0_8px_20px_-10px_rgba(14,122,70,0.9)]">
            <PulseMark />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Heartometer</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative transition-colors hover:text-pine focus-visible:text-pine focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          href="/heartometer"
          className="btn-pine inline-flex h-10 items-center gap-2 rounded-full bg-pine px-4 text-sm font-medium text-white transition-colors hover:bg-pine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        >
          Try out
          <Arrow />
        </Link>
      </div>
      <nav className="mx-auto mt-2 flex max-w-6xl gap-5 overflow-x-auto px-2 text-sm text-muted md:hidden">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="shrink-0 hover:text-pine">
            {link.label}
          </a>
        ))}
      </nav>
    </header>
    </>
  );
}

function PulseMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M1.5 9h3.2l1.6-3.4 2.4 6.8L10.6 9H16.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
