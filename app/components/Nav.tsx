"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav({ showHomeButton = false }: { showHomeButton?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="0"  y="0"  width="6" height="6" rx="1" fill="#818cf8"/>
              <rect x="9"  y="0"  width="6" height="6" rx="1" fill="#4338ca"/>
              <rect x="18" y="0"  width="6" height="6" rx="1" fill="#818cf8"/>
              <rect x="0"  y="9"  width="6" height="6" rx="1" fill="#4338ca"/>
              <rect x="9"  y="9"  width="6" height="6" rx="1" fill="#818cf8"/>
              <rect x="18" y="9"  width="6" height="6" rx="1" fill="#4338ca"/>
              <rect x="0"  y="18" width="6" height="6" rx="1" fill="#818cf8"/>
              <rect x="9"  y="18" width="6" height="6" rx="1" fill="#4338ca"/>
              <rect x="18" y="18" width="6" height="6" rx="1" fill="#818cf8"/>
            </svg>
            Dave&apos;s <span className="text-indigo-400">Pixel Shop</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {showHomeButton && (
              <Link
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors"
              >
                Main
              </Link>
            )}
            <Link href="/about" className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors">
              About
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-teal-300 text-sm font-medium transition-colors">
              FAQ
            </Link>
            <a
              href="/#contact"
              className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm shadow-indigo-900/20 hover:from-indigo-400 hover:to-indigo-600 transition-all"
            >
              Get a Quote
            </a>
          </div>

          {/* Hamburger button (mobile only) */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6"  x2="17" y2="6"  />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out ${
            open ? "max-h-72 border-t border-gray-700" : "max-h-0"
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-1">
            {showHomeButton && (
              <Link
                href="/"
                onClick={close}
                className="text-gray-300 hover:text-teal-300 hover:bg-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
              >
                Main
              </Link>
            )}
            <Link
              href="/about"
              onClick={close}
              className="text-gray-300 hover:text-teal-300 hover:bg-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
            >
              About
            </Link>
            <Link
              href="/faq"
              onClick={close}
              className="text-gray-300 hover:text-teal-300 hover:bg-gray-700 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors"
            >
              FAQ
            </Link>
            <a
              href="/#contact"
              onClick={close}
              className="mt-2 bg-indigo-600 text-white text-sm font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-center"
            >
              Get a Quote
            </a>
          </div>
        </div>
      </nav>

      {/* Backdrop — closes menu when tapping outside */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-40"
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
}
