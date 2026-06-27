import type { Metadata } from "next";
import Nav from "../components/Nav";
import FadeIn from "../components/FadeIn";

export const metadata: Metadata = {
  title: "About — Dave's Pixel Shop",
  description: "Learn more about Dave's Pixel Shop and how I build websites for local businesses.",
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-800 text-gray-900 font-sans">
      <Nav showHomeButton />
      <div className="pt-24 pb-8 px-6 space-y-6">
        <FadeIn className="max-w-5xl mx-auto border border-indigo-200/60 rounded-2xl p-10 bg-gray-200 shadow-md">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Me</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-4">
            Hi, I&apos;m David. I&apos;m 19 and I build clean, professional websites for small local
            businesses. I&apos;m from Cincinnati, Ohio. I like collecting/playing card games, video
            games, and reading/watching manga and anime.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-4">
            I try to keep things simple and affordable. You pay a flat fee to get your site built
            and launched, then a low monthly rate to keep it running, updated, and secure. No
            confusing contracts, no surprise invoices.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            My goal is to make fast and affordable websites. Right now, getting a website is
            pretty rough — you either hire someone and spend close to three grand, or build it
            yourself through software that often leads to a slow and restrictive design.
          </p>
        </FadeIn>

        <FadeIn className="max-w-5xl mx-auto border border-indigo-200/60 rounded-2xl p-10 bg-gray-200 shadow-md">
          <h2 className="text-2xl font-bold tracking-tight mb-4">How I work</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mb-4">
            I start by listening. You tell me about your business, your customers, and what you
            need — and I handle the rest. Most sites are live within one to two weeks.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            Once your site is live, I take care of hosting, security, and updates so you never
            have to think about it. If you need something changed, just send me a message.
          </p>
          <div className="mt-8">
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
