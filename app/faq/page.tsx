"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import FadeIn from "../components/FadeIn";

const ip = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
  className: "w-4 h-4 text-indigo-500 shrink-0 mt-0.5",
};

const faqs = [
  {
    q: "How does pricing work?",
    a: "Flat fee to build + monthly fee to maintain, no hidden costs.",
    icon: (
      <svg {...ip}>
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    q: "How long does it take to get my site built?",
    a: "About 1-2 weeks, depending on package and what you want included.",
    icon: (
      <svg {...ip}>
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    q: "What if I want changes after my site is live?",
    a: "No problem! Depending on your package, we offer anywhere from 2 to unlimited updates after the site is live.",
    icon: (
      <svg {...ip}>
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
      </svg>
    ),
  },
  {
    q: "Do I need to know anything about tech to work with you?",
    a: "Nope! You tell me what you want, and I make it happen.",
    icon: (
      <svg {...ip}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    q: "What if I want to cancel?",
    a: "No worries, things happen! I can make a backup of your site, and if you decide to renew, you will NOT have to pay the setup fee again.",
    icon: (
      <svg {...ip}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-900 font-sans">
      <Nav showHomeButton />
      <div className="pt-24 pb-8 px-6">
        <FadeIn className="max-w-5xl mx-auto border border-indigo-200/60 rounded-2xl p-10 bg-gray-200 shadow-md">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-lg mb-8">Everything you need to know before getting started.</p>
          <div className="divide-y divide-gray-300">
            {faqs.map(({ q, a, icon }, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                  aria-expanded={open === i}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {icon}
                    <span className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{q}</span>
                  </span>
                  <svg
                    className={`shrink-0 w-5 h-5 text-indigo-500 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {open === i && (
                  <p className="pb-5 pl-4 border-l-2 border-teal-400 text-gray-600 leading-relaxed">{a}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-300">
            <p className="text-gray-500 text-sm mb-4">Still have questions?</p>
            <a
              href="/#contact"
              className="inline-block bg-gradient-to-b from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm shadow-indigo-900/20 hover:from-indigo-400 hover:to-indigo-600 transition-all"
            >
              Get in touch
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
