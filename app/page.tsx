"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Nav from "./components/Nav";
import FadeIn from "./components/FadeIn";
import IntroAnimation from "./components/IntroAnimation";

const iconProps = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: "1.5", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true,
};
const ZapIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);
const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const ChatIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const PencilSquareIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const EyeIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg {...iconProps} className={className}>
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function Home() {
  const [formState, setFormState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    const onScroll = () =>
      setHeroProgress(Math.min(window.scrollY / (window.innerHeight * 0.45), 1));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="min-h-screen bg-gray-800 text-gray-900 font-sans">
      <IntroAnimation />
      <Nav />

      {/* Hero */}
      <div style={{ height: "150vh" }}>
        <section
          className="sticky top-0 h-screen flex items-center px-6 pt-16 relative overflow-hidden"
          style={{
            opacity: 1 - heroProgress,
            transform: `scale(${1 - heroProgress * 0.05}) translateY(${heroProgress * -24}px)`,
            pointerEvents: heroProgress >= 1 ? "none" : "auto",
            backgroundImage: "url('/hero-bg.png.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />
          <div className="max-w-5xl mx-auto w-full border border-white/20 rounded-2xl p-10 bg-white/10 backdrop-blur-sm relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-teal-400/20 text-teal-200 border border-teal-400/40 text-sm font-medium px-3 py-1 rounded-full mb-6">
                  Web Design for Local Businesses
                </span>
                <div className="flex items-center gap-4 mb-6">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
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
                  <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                    Dave&apos;s Pixel Shop
                  </h1>
                </div>
                <p className="text-xl text-white/75 leading-relaxed mb-10">
                  Professional websites for local businesses.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#services"
                    className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm shadow-indigo-900/20 hover:from-indigo-400 hover:to-indigo-600 transition-all"
                  >
                    See Pricing
                  </a>
                  <a
                    href="#how-it-works"
                    className="bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium shadow-sm shadow-black/10 hover:bg-white/30 transition-colors"
                  >
                    How It Works
                  </a>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <Image
                  src="/globe-icon.png.png"
                  alt="Globe icon"
                  width={280}
                  height={280}
                  className="rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Services */}
      <section id="services" className="py-8 px-6">
        <FadeIn className="max-w-5xl mx-auto border border-indigo-200/60 rounded-2xl p-10 bg-gray-200 shadow-md overflow-visible">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-500 text-lg mb-12 max-w-xl">
            Every plan includes a flat setup fee and a low monthly rate for hosting and maintenance. No hidden fees, no surprises.
          </p>
          <div className="grid md:grid-cols-3 gap-6 items-start">

            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200/70 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <ZapIcon className="w-7 h-7 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold mb-1">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Great for getting online fast</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">$200</span>
                <span className="text-gray-400 text-sm ml-1">setup</span>
              </div>
              <div className="mb-8">
                <span className="text-2xl font-semibold text-gray-700">$30</span>
                <span className="text-gray-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                1-page site with hero, services, contact, and hours/location. Includes hosting plus up to 2 small updates per month.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {[
                  "Single-page layout",
                  "Mobile-responsive design",
                  "Contact form & map",
                  "Hosting included",
                  "2 updates/month",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block text-center border border-indigo-300/50 text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-50 transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Growth — featured */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-8 text-white relative shadow-xl shadow-indigo-900/30 md:-mt-4 md:-mb-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/40">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-400 text-teal-900 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </span>
              <TrendingUpIcon className="w-7 h-7 text-indigo-200 mb-4" />
              <h3 className="text-lg font-semibold mb-1">Growth</h3>
              <p className="text-indigo-200 text-sm mb-6">Perfect for most local businesses</p>
              <div className="mb-1">
                <span className="text-4xl font-bold">$400</span>
                <span className="text-indigo-300 text-sm ml-1">setup</span>
              </div>
              <div className="mb-8">
                <span className="text-2xl font-semibold">$50</span>
                <span className="text-indigo-300 text-sm ml-1">/ month</span>
              </div>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Multi-page site (Home, About, Services, Gallery, Contact) with your brand colors and logo integrated. Includes hosting plus up to 4 updates per month.
              </p>
              <ul className="space-y-2 text-sm text-indigo-100 mb-8">
                {[
                  "5-page site",
                  "Brand colors & logo integration",
                  "Mobile-responsive design",
                  "Contact form & map",
                  "Hosting included",
                  "4 updates/month",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-indigo-300 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block text-center bg-white text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-indigo-900/15 hover:bg-indigo-50 transition-colors"
              >
                Get Started
              </a>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200/70 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <ShieldCheckIcon className="w-7 h-7 text-indigo-500 mb-4" />
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <p className="text-gray-400 text-sm mb-6">For businesses ready to grow</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-gray-900">$800</span>
                <span className="text-gray-400 text-sm ml-1">setup</span>
              </div>
              <div className="mb-8">
                <span className="text-2xl font-semibold text-gray-700">$75</span>
                <span className="text-gray-400 text-sm ml-1">/ month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Everything in Growth, plus a smart contact/booking form and basic SEO setup to help you show up better in Google. Includes hosting plus unlimited small updates and priority support.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                {[
                  "Everything in Growth",
                  "Smart contact/booking form",
                  "Basic SEO setup",
                  "Hosting included",
                  "Unlimited small updates",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block text-center border border-indigo-300/50 text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-50 transition-colors"
              >
                Get Started
              </a>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-8 px-6">
        <FadeIn className="max-w-5xl mx-auto border border-indigo-200/60 rounded-2xl p-10 bg-gray-200 shadow-md">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-gray-500 text-lg mb-16 max-w-xl">
            From first conversation to live website in just a few steps. Simple, fast, no surprises.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "We talk", desc: "You tell me about your business — what you do, who you serve, what matters most.", icon: <ChatIcon className="w-6 h-6 text-indigo-500 mb-2" /> },
              { step: "02", title: "I design & build", desc: "I design and develop your site quickly, without cutting corners on quality.", icon: <PencilSquareIcon className="w-6 h-6 text-indigo-500 mb-2" /> },
              { step: "03", title: "You review & approve", desc: "You see the site before it goes live and can request changes until you're happy.", icon: <EyeIcon className="w-6 h-6 text-indigo-500 mb-2" /> },
              { step: "04", title: "Launch & maintain", desc: "Your site goes live and I keep it running, secure, and updated every month.", icon: <SendIcon className="w-6 h-6 text-indigo-500 mb-2" /> },
            ].map(({ step, title, desc, icon }) => (
              <div key={step}>
                {icon}
                <div className="text-4xl font-bold text-teal-500 mb-2">{step}</div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Contact */}
      <section id="contact" className="py-8 px-6">
        <FadeIn className="max-w-5xl mx-auto border border-indigo-200/60 rounded-2xl p-10 bg-gray-200 shadow-md">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-500 text-lg mb-10">
              Send me a message and I'll get back to you within one business day with a quote and timeline.
            </p>
            {formState === "success" ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <p className="font-semibold text-green-800 mb-1">Message sent!</p>
                <p className="text-green-700 text-sm">Thanks for reaching out. I'll get back to you within one business day.</p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormState("sending");
                  const data = new FormData(e.currentTarget);
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: data.get("name"),
                      business: data.get("business"),
                      email: data.get("email"),
                      message: data.get("message"),
                    }),
                  });
                  setFormState(res.ok ? "success" : "error");
                }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jane Smith"
                      className="w-full border border-gray-200/80 rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
                    <input
                      id="business"
                      name="business"
                      type="text"
                      required
                      placeholder="Smith Plumbing Co."
                      className="w-full border border-gray-200/80 rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="w-full border border-gray-200/80 rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Tell me about your business</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What does your business do? What do you need from a website?"
                    className="w-full border border-gray-200/80 rounded-lg px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                {formState === "error" && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again or email me directly.</p>
                )}
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  className="bg-gradient-to-b from-indigo-500 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm shadow-indigo-900/20 hover:from-indigo-400 hover:to-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </FadeIn>
      </section>

      <footer className="py-8 px-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Dave&apos;s Pixel Shop. All rights reserved.
      </footer>
    </div>
  );
}
