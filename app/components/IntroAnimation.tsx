"use client";

import { useEffect, useState } from "react";

// 3×3 logo colours, row-major
const FILLS = [
  "#818cf8", "#4338ca", "#818cf8",
  "#4338ca", "#818cf8", "#4338ca",
  "#818cf8", "#4338ca", "#818cf8",
];

// Where each square flies in from (px offset from its final position)
const SCATTER: [number, number][] = [
  [-150, -110], [   0, -160], [ 150, -110],
  [-160,    0], [  30, -100], [ 160,    0],
  [-150,  110], [   0,  160], [ 150,  110],
];

// Stagger — centre square arrives last so it feels like the finishing piece
const DELAYS = [0, 0.05, 0.02, 0.08, 0.18, 0.07, 0.03, 0.06, 0.01];

// Unique keyframe per square avoids CSS-variable typing issues
const KEYFRAMES = FILLS.map((_, i) => {
  const [dx, dy] = SCATTER[i];
  return `
    @keyframes __flyIn${i} {
      from { transform: translate(${dx}px,${dy}px) scale(0.2); opacity: 0; }
      to   { transform: translate(0,0) scale(1); opacity: 1; }
    }
  `;
}).join("");

export default function IntroAnimation() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("intro-played")) return;
    setVisible(true);
    const t1 = setTimeout(() => setFading(true), 1100);
    const t2 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("intro-played", "1");
    }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800"
        style={{
          opacity: fading ? 0 : 1,
          transition: "opacity 0.4s ease-in-out",
          pointerEvents: fading ? "none" : "auto",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 28px)", gap: "7px" }}>
          {FILLS.map((fill, i) => (
            <div
              key={i}
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                background: fill,
                animation: `__flyIn${i} 0.55s cubic-bezier(0.34,1.56,0.64,1) ${DELAYS[i]}s both`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
