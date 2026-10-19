"use client";

import { useEffect, useState } from "react";
import type { AlcoholStatus, Gender } from "@/lib/estimate";

type StoredResult = {
  signature: string;
  age: number;
  gender: Gender;
  systolic: number;
  sugar: number;
  alcohol: AlcoholStatus;
  heart_disease: boolean;
  probability: number;
};

const genderLabel: Record<Gender, string> = { female: "Female", male: "Male" };
const alcoholLabel: Record<AlcoholStatus, string> = {
  none: "None",
  occasional: "Occasional",
  regular: "Regular",
};

export function VerifiedResult({ signature }: { signature: string }) {
  const [result, setResult] = useState<StoredResult | null>(null);
  const [status, setStatus] = useState<"loading" | "verified" | "missing">("loading");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const response = await fetch(`/api/results/${encodeURIComponent(signature)}`);
        if (!response.ok) {
          if (!ignore) setStatus("missing");
          return;
        }
        const body = (await response.json()) as StoredResult;
        if (!ignore) {
          setResult(body);
          setStatus("verified");
        }
      } catch {
        if (!ignore) setStatus("missing");
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [signature]);

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col items-center justify-center px-5 pt-32 pb-20">
        <p className="text-sm font-medium tracking-wide text-muted">Checking this result</p>
      </div>
    );
  }

  if (status === "missing" || !result) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-5 pt-32 pb-20 text-center">
        <p className="text-xs font-medium tracking-[0.16em] text-pine uppercase">Score card</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">This result could not be verified.</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          Heartometer has no stored record for this score card.
        </p>
      </div>
    );
  }

  const chance = Math.round(result.probability * 100);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-xl flex-col justify-center px-5 pt-32 pb-20 sm:px-8">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium tracking-[0.16em] text-pine uppercase">
          <span className="h-2 w-2 rounded-full bg-pine" />
          Verified
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          This result is verified.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
          Heartometer stored this score card. The details below match that record.
        </p>
      </div>

      <article className="mt-8 rounded-[32px] border border-line bg-white p-6 shadow-[0_24px_60px_-40px_rgba(14,122,70,0.8)] sm:p-8">
        <p className="text-xs font-medium tracking-[0.16em] text-pine uppercase">Prediction</p>
        <p className="mt-3 text-6xl font-semibold tracking-[-0.06em] text-ink tabular-nums">
          {chance}
          <span className="text-pine">%</span>
        </p>
        <p className="mt-2 text-base text-muted">
          {result.heart_disease
            ? "Classified as heart disease, with this model probability."
            : "Classified as no heart disease, with this model probability."}
        </p>
        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-pine-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8eecc0] to-[#0b6b3c]"
            style={{ width: `${chance}%` }}
          />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Detail term="Gender" value={genderLabel[result.gender]} />
          <Detail term="Alcohol status" value={alcoholLabel[result.alcohol]} />
          <Detail term="Blood pressure" value={`${Math.round(result.systolic)} mmHg`} />
          <Detail term="Sugar level" value={`${result.sugar.toFixed(1)} mmol/L`} />
          <Detail term="Age" value={`${Math.round(result.age)} years`} />
        </dl>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          An informational estimate from these inputs. Not a medical diagnosis.
        </p>
      </article>
    </div>
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
