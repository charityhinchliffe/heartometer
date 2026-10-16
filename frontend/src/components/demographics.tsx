"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const regions = [
  { name: "Central Asia", rate: 516.9 },
  { name: "Eastern Europe", rate: 424.7 },
  { name: "Oceania", rate: 372.1 },
  { name: "Central sub-Saharan Africa", rate: 367.9 },
  { name: "North Africa and Middle East", rate: 361.4 },
  { name: "Western sub-Saharan Africa", rate: 313.8 },
  { name: "Southeast Asia", rate: 308.6 },
  { name: "Central Europe", rate: 298.8 },
  { name: "Southern sub-Saharan Africa", rate: 290.2 },
  { name: "South Asia", rate: 287.6 },
  { name: "East Asia", rate: 286.3 },
  { name: "Eastern sub-Saharan Africa", rate: 264.1 },
  { name: "Caribbean", rate: 240.8 },
  { name: "Central Latin America", rate: 170.2 },
  { name: "Tropical Latin America", rate: 163.1 },
  { name: "Southern Latin America", rate: 156.2 },
  { name: "High-income North America", rate: 145.4 },
  { name: "Andean Latin America", rate: 126.8 },
  { name: "Western Europe", rate: 114.6 },
  { name: "Australasia", rate: 102.2 },
  { name: "High-income Asia Pacific", rate: 76.6 },
];

const globalRate = 245.1;
const maxRate = Math.max(...regions.map((region) => region.rate));
const ranked = [...regions].sort((a, b) => b.rate - a.rate);
const ticks = [0, 150, 300, 450];

export function Demographics() {
  const stats = useInView<HTMLDivElement>(0.45);
  const chart = useInView<HTMLElement>(0.2);

  return (
    <section id="demographics" className="scroll-mt-28 pb-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-medium tracking-[0.16em] text-pine uppercase">World demographics</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
            Heart disease is still the leading cause of death.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Cardiovascular disease killed an estimated 19.8 million people in 2022, about a third of all deaths. More than three quarters of those deaths were in low- and middle-income countries. The chart shows how uneven the age-standardized rate still is across regions.
          </p>
        </div>

        <div ref={stats.ref} className="mt-12 grid gap-4 lg:grid-cols-4">
          <article className="reveal relative overflow-hidden rounded-[28px] border border-line bg-white p-6 lg:col-span-2 lg:row-span-2">
            <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-pine/10 blur-2xl" />
            <p className="text-xs font-medium tracking-[0.16em] text-pine uppercase">Share of global deaths</p>
            <div className="mt-6 flex items-center gap-6">
              <Ring active={stats.active} />
              <div>
                <p className="text-5xl font-semibold tracking-[-0.05em] text-ink tabular-nums">
                  <Count to={32} active={stats.active} />
                  <span className="text-pine">%</span>
                </p>
                <p className="mt-2 max-w-[14rem] text-sm leading-relaxed text-muted">
                  of all deaths worldwide in 2022 were from cardiovascular disease.
                </p>
              </div>
            </div>
          </article>

          <Stat
            value={<Count to={19.8} decimals={1} active={stats.active} />}
            unit="million"
            label="Deaths from cardiovascular disease in 2022"
          />
          <Stat
            value={<Count to={85} active={stats.active} />}
            unit="%"
            label="Of those deaths were heart attack or stroke"
          />
          <Stat
            value={<Count to={38} active={stats.active} />}
            unit="%"
            label="Of premature NCD deaths under age 70, in 2021"
            className="lg:col-span-2"
          />
        </div>

        <figure ref={chart.ref} className="reveal relative mt-5 overflow-hidden rounded-[32px] border border-line bg-white p-5 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(47,191,120,0.16),transparent_42%)]" />
          <figcaption className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-lg font-semibold tracking-tight">Age-standardized cardiovascular deaths</p>
              <p className="mt-1 max-w-xl text-sm text-muted">
                Deaths per 100,000 people, by region, 2021. The marker is the global rate of {globalRate.toFixed(1)}.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-gradient-to-r from-[#8eecc0] to-pine" />
                Regional rate
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-0.5 rounded-full bg-ink" />
                Global average
              </span>
            </div>
          </figcaption>

          <div className="relative mt-8 hidden grid-cols-[11rem_1fr_3.4rem] text-[11px] text-muted sm:grid" aria-hidden="true">
            <span />
            <div className="relative h-4">
              {ticks.map((tick) => (
                <span
                  key={tick}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${(tick / maxRate) * 100}%` }}
                >
                  {tick}
                </span>
              ))}
            </div>
            <span />
          </div>

          <ul className="relative mt-2 space-y-1.5" aria-label="Regional cardiovascular mortality rates">
            {ranked.map((region, index) => {
              const width = (region.rate / maxRate) * 100;
              return (
                <li key={region.name} className="group rounded-xl px-1 py-1 transition-colors hover:bg-mist">
                  <div className="mb-1 flex items-baseline justify-between gap-3 sm:hidden">
                    <span className="text-sm text-ink">{region.name}</span>
                    <span className="font-mono text-xs text-pine tabular-nums">{region.rate.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[11rem_1fr_3.4rem]">
                    <span className="hidden text-[13px] leading-tight text-ink sm:block">{region.name}</span>
                    <div className="relative h-3">
                      <div className="absolute inset-0 rounded-full bg-pine-soft" />
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#8eecc0] to-[#0b6b3c] shadow-[0_0_16px_-4px_rgba(14,122,70,0.8)] transition-[width] duration-1000 ease-out"
                        style={{
                          width: chart.active ? `${width}%` : "0%",
                          transitionDelay: `${index * 35}ms`,
                        }}
                      />
                      <div
                        className="absolute top-1/2 z-10 h-5 w-px -translate-y-1/2 bg-ink/80"
                        style={{ left: `${(globalRate / maxRate) * 100}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="hidden text-right font-mono text-xs text-muted tabular-nums transition-colors group-hover:text-pine sm:block">
                      {region.rate.toFixed(1)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </figure>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
          Death counts and shares: World Health Organization,{" "}
          <a
            className="underline decoration-line underline-offset-2 transition-colors hover:text-pine"
            href="https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)"
            target="_blank"
            rel="noreferrer"
          >
            Cardiovascular diseases fact sheet
          </a>
          . Regional rates: Global Burden of Cardiovascular Diseases and Risks Collaboration, 1990–2021,{" "}
          <a
            className="underline decoration-line underline-offset-2 transition-colors hover:text-pine"
            href="https://www.jacc.org/doi/full/10.1016/j.jacc.2022.11.001"
            target="_blank"
            rel="noreferrer"
          >
            Journal of the American College of Cardiology
          </a>
          . Rates are age-standardized and are not the same figure as the 2022 death count.
        </p>
      </div>
    </section>
  );
}

function useInView<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, active };
}

function Stat({
  value,
  unit,
  label,
  className = "",
}: {
  value: ReactNode;
  unit: string;
  label: string;
  className?: string;
}) {
  return (
    <article className={`reveal rounded-[28px] border border-line bg-white p-6 transition-transform duration-500 hover:-translate-y-1 ${className}`}>
      <p className="text-4xl font-semibold tracking-[-0.05em] text-ink tabular-nums">
        {value}
        <span className="ml-1 text-xl font-medium text-pine">{unit}</span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{label}</p>
    </article>
  );
}

function Ring({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="h-36 w-36 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8eecc0" />
          <stop offset="100%" stopColor="#0b6b3c" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="48" fill="none" stroke="#e7f6ee" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="url(#ring)"
        strokeWidth="12"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="32 100"
        strokeDashoffset={active ? 0 : 32}
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </svg>
  );
}

function Count({
  to,
  active,
  decimals = 0,
}: {
  to: number;
  active: boolean;
  decimals?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(to);
      return;
    }
    const start = performance.now();
    const duration = 1600;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(to * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, to]);

  return <>{decimals ? value.toFixed(decimals) : Math.round(value)}</>;
}
