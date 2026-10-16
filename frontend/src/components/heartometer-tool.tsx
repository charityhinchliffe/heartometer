"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal, flushSync } from "react-dom";
import { estimateChance, type AlcoholStatus } from "@/lib/estimate";

const alcoholOptions: { id: AlcoholStatus; label: string; hint: string }[] = [
  { id: "none", label: "None", hint: "No alcohol" },
  { id: "occasional", label: "Occasional", hint: "Now and then" },
  { id: "regular", label: "Regular", hint: "Most weeks" },
];

type Result = {
  chance: number;
  age: number;
  systolic: number;
  sugarMmol: number;
  alcohol: AlcoholStatus;
};

export function HeartometerTool() {
  const [age, setAge] = useState(42);
  const [systolic, setSystolic] = useState(120);
  const [sugar, setSugar] = useState(5.4);
  const [alcohol, setAlcohol] = useState<AlcoholStatus | null>(null);
  const [alcoholError, setAlcoholError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!result || loading) return;
    document.getElementById("prediction")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [result, loading]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!alcohol) {
      setAlcoholError(true);
      return;
    }
    setAlcoholError(false);
    flushSync(() => setLoading(true));
    const chance = estimateChance({
      age,
      systolic,
      sugarMmol: sugar,
      alcohol,
    });
    await new Promise((resolve) => setTimeout(resolve, 2400));
    setResult({ chance, age, systolic, sugarMmol: sugar, alcohol });
    setLoading(false);
  }

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-5 pt-32 pb-20 sm:px-8">
      <div className={loading ? "scale-[0.985] blur-lg transition duration-500" : "transition duration-500"}>
        <div className="rise text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium tracking-[0.16em] text-pine uppercase">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inset-0 rounded-full bg-pine" />
              <span className="relative h-2 w-2 rounded-full bg-pine" />
            </span>
            Try Heartometer
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
            Four measures. One prediction.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            Enter your alcohol status, blood pressure, sugar level, and age.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rise mt-8 rounded-[32px] border border-line bg-white/85 p-6 shadow-[0_30px_80px_-48px_rgba(14,122,70,0.65)] backdrop-blur-sm sm:p-8"
          style={{ animationDelay: "120ms" }}
        >
          <fieldset>
            <legend className="text-sm font-medium text-ink">Alcohol status</legend>
            <AlcoholPicker value={alcohol} invalid={alcoholError} onChange={(value) => {
              setAlcohol(value);
              setAlcoholError(false);
            }} />
            {alcoholError ? (
              <p className="mt-2 text-sm text-pine-deep">Choose an alcohol status to continue.</p>
            ) : null}
          </fieldset>

          <div className="mt-7 space-y-7">
            <Meter
              label="Blood pressure"
              min={90}
              max={200}
              step={1}
              value={systolic}
              display={String(systolic)}
              unit="mmHg"
              onChange={setSystolic}
            />
            <Meter
              label="Sugar level"
              min={3}
              max={15}
              step={0.1}
              value={sugar}
              display={sugar.toFixed(1)}
              unit="mmol/L"
              onChange={setSugar}
            />
            <Meter
              label="Age"
              min={18}
              max={90}
              step={1}
              value={age}
              display={String(age)}
              unit="years"
              onChange={setAge}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-pine mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-pine text-sm font-medium text-white shadow-[0_14px_30px_-16px_rgba(14,122,70,0.95)] transition-colors hover:bg-pine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine disabled:opacity-70"
          >
            Get a prediction
            <Arrow />
          </button>
        </form>

        {result ? (
          <PredictionCard
            key={`${result.chance}-${result.age}-${result.systolic}-${result.sugarMmol}-${result.alcohol}`}
            result={result}
          />
        ) : null}
      </div>

      {loading && mounted
        ? createPortal(
            <div
              className="fixed inset-0 z-[80] flex items-center justify-center bg-white/55 backdrop-blur-2xl"
              role="status"
              aria-live="assertive"
            >
              <div className="flex flex-col items-center gap-5 rounded-[32px] border border-line bg-white px-10 py-9 shadow-[0_30px_80px_-36px_rgba(14,122,70,0.85)]">
                <span className="relative grid h-24 w-24 place-items-center">
                  <span className="prediction-spin absolute inset-0 rounded-full border-[5px] border-pine-soft border-t-pine border-r-pine" />
                  <span className="prediction-spin-reverse absolute inset-3 rounded-full border-4 border-transparent border-b-[#8eecc0]" />
                  <span className="prediction-pulse h-3 w-3 rounded-full bg-pine" />
                </span>
                <p className="text-sm font-medium tracking-wide text-ink">Preparing your prediction</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function PredictionCard({ result }: { result: Result }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(1 - (1 - t) ** 3);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [result]);

  const shown = Math.round(result.chance * progress);

  return (
    <article
      id="prediction"
      className="prediction-card mt-5 rounded-[32px] border border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(14,122,70,0.8)] sm:p-8"
      aria-live="polite"
    >
      <p className="text-xs font-medium tracking-[0.16em] text-pine uppercase">Prediction</p>
      <p className="mt-3 text-6xl font-semibold tracking-[-0.06em] text-ink tabular-nums">
        {shown}
        <span className="text-pine">%</span>
      </p>
      <p className="mt-2 text-base text-muted">Estimated chance of heart disease.</p>
      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-pine-soft">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#8eecc0] to-[#0b6b3c] shadow-[0_0_16px_-4px_rgba(14,122,70,0.9)]"
          style={{ width: `${result.chance * progress}%` }}
        />
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <Detail term="Alcohol status" value={labelFor(result.alcohol)} />
        <Detail term="Blood pressure" value={`${result.systolic} mmHg`} />
        <Detail term="Sugar level" value={`${result.sugarMmol.toFixed(1)} mmol/L`} />
        <Detail term="Age" value={`${result.age} years`} />
      </dl>
      <p className="mt-5 text-xs leading-relaxed text-muted">
        An informational estimate from these inputs. Not a medical diagnosis.
      </p>
    </article>
  );
}

function AlcoholPicker({
  value,
  invalid,
  onChange,
}: {
  value: AlcoholStatus | null;
  invalid: boolean;
  onChange: (value: AlcoholStatus) => void;
}) {
  const labelId = useId();
  const index = value ? alcoholOptions.findIndex((option) => option.id === value) : -1;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className={`relative mt-3 grid grid-cols-3 rounded-full bg-mist p-1 ${invalid ? "ring-2 ring-pine" : ""}`}
    >
      <span id={labelId} className="sr-only">
        Alcohol status
      </span>
      {index >= 0 ? (
        <span
          className="pointer-events-none absolute inset-y-1 rounded-full bg-pine shadow-[0_8px_18px_-10px_rgba(14,122,70,1)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: "calc((100% - 0.5rem) / 3)",
            left: `calc(0.25rem + ${index} * (100% - 0.5rem) / 3)`,
          }}
          aria-hidden="true"
        />
      ) : null}
      {alcoholOptions.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={`relative z-10 rounded-full px-2 py-2.5 text-center transition-colors ${
              selected ? "text-white" : "text-muted hover:text-pine"
            }`}
          >
            <span className="block text-sm font-medium">{option.label}</span>
            <span className={`block text-[10px] ${selected ? "text-white/80" : "text-muted"}`}>{option.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function Meter({
  label,
  min,
  max,
  step,
  value,
  display,
  unit,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  unit: string;
  onChange: (value: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-end justify-between gap-3">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-2xl font-semibold tracking-tight text-pine tabular-nums">
          {display}
          <span className="ml-1 text-xs font-medium text-muted">{unit}</span>
        </span>
      </span>
      <input
        className="range-pine mt-4"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ["--pct" as string]: `${pct}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="mt-2 flex justify-between text-[11px] text-muted">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  );
}

function Detail({ term, value }: { term: string; value: string }) {
  return (
    <div className="rounded-2xl bg-mist px-3 py-3">
      <dt className="text-xs text-muted">{term}</dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  );
}

function labelFor(alcohol: AlcoholStatus) {
  return alcoholOptions.find((option) => option.id === alcohol)?.label ?? alcohol;
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
