import Image from "next/image";
import Link from "next/link";

const capabilities = [
  {
    kicker: "01",
    title: "Four everyday measures",
    text: "Blood sugar, blood pressure, age, and alcohol status are enough to start.",
  },
  {
    kicker: "02",
    title: "One model",
    text: "A machine learning model weighs those inputs together, instead of one number at a time.",
  },
  {
    kicker: "03",
    title: "A single prediction",
    text: "You receive an estimate of the chance of heart disease.",
  },
];

const ticker = [
  "Blood sugar",
  "Blood pressure",
  "Age",
  "Alcohol status",
  "Machine learning",
  "Heart-disease prediction",
];

export function Hero() {
  return (
    <section id="introduction" className="relative scroll-mt-28 overflow-x-clip">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-32 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pt-36 lg:pb-20">
        <div>
          <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium tracking-[0.16em] text-pine uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inset-0 rounded-full bg-pine" />
              <span className="relative h-2 w-2 rounded-full bg-pine" />
            </span>
            Heart disease risk
          </p>
          <h1 className="rise mt-6 max-w-xl text-[2.7rem] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-ink sm:text-6xl lg:text-[4.15rem]" style={{ animationDelay: "80ms" }}>
            Estimate your chance of{" "}
            <span className="gradient-text">heart disease</span> from four measures.
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-muted" style={{ animationDelay: "160ms" }}>
            Heartometer is a straightforward way to read personal risk. You enter your sugar level, blood pressure, age, and alcohol status. A machine learning model turns those inputs into a prediction of how likely heart disease is for you.
          </p>
          <div className="rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
            <Link
              href="/heartometer"
              className="btn-pine inline-flex h-12 items-center justify-center gap-2 rounded-full bg-pine px-6 text-sm font-medium text-white shadow-[0_14px_30px_-16px_rgba(14,122,70,0.95)] transition-colors hover:bg-pine-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              Try out
              <Arrow />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white/80 px-6 text-sm font-medium text-ink backdrop-blur transition-colors hover:border-pine hover:text-pine focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
            >
              See the three steps
            </a>
          </div>

          <svg
            className="rise mt-10 h-12 w-full max-w-md text-pine"
            viewBox="0 0 480 64"
            fill="none"
            aria-hidden="true"
            style={{ animationDelay: "320ms" }}
          >
            <path
              className="ecg-base"
              d="M0 32h70l16-18 18 36 16-18h62l16-22 20 44 16-22h246"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="ecg-spark"
              d="M0 32h70l16-18 18 36 16-18h62l16-22 20 44 16-22h246"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="rise relative" style={{ animationDelay: "180ms" }}>
          <div className="absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(circle_at_30%_20%,rgba(47,191,120,0.35),transparent_55%)] blur-2xl" />
          <div className="overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_30px_80px_-36px_rgba(14,122,70,0.75)]">
            <Image
              src="/hero-heart-health.jpg"
              alt="A woman checks a heart-health reading on a tablet, with a blood pressure cuff and a glass of water on the table."
              width={1280}
              height={720}
              priority
              className="aspect-[4/3] w-full object-cover object-[72%_center]"
            />
          </div>

          <div className="float-slower absolute top-6 -right-2 w-44 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_18px_40px_-24px_rgba(16,33,23,0.55)] backdrop-blur-md sm:right-[-18px]">
            <p className="text-[11px] font-medium tracking-wide text-pine uppercase">Inputs</p>
            <p className="mt-1 text-sm font-semibold text-ink">Four measures in</p>
            <div className="mt-3 flex gap-1.5">
              {["Sugar", "BP", "Age", "Alcohol"].map((label, index) => (
                <span key={label} className="flex flex-col items-center gap-1">
                  <span
                    className="dot-seq h-2.5 w-2.5 rounded-full bg-pine"
                    style={{ animationDelay: `${index * 0.35}s` }}
                  />
                  <span className="text-[9px] text-muted">{label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="float-slow absolute bottom-6 left-3 w-52 rounded-2xl border border-white/80 bg-white/92 p-3.5 shadow-[0_18px_40px_-24px_rgba(16,33,23,0.55)] backdrop-blur-md sm:left-[-18px]">
            <p className="text-[11px] font-medium tracking-wide text-pine uppercase">Output</p>
            <p className="mt-1 text-sm font-semibold text-ink">One prediction</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Chances of heart disease, returned by the model.
            </p>
          </div>
        </div>
      </div>

      <ul className="mx-auto grid max-w-6xl gap-3 px-5 sm:px-8 md:grid-cols-3">
        {capabilities.map((item, index) => (
          <li
            key={item.title}
            className="rise rounded-3xl border border-line/80 bg-white/75 p-5 backdrop-blur-sm transition-colors hover:border-pine"
            style={{ animationDelay: `${380 + index * 90}ms` }}
          >
            <p className="font-mono text-xs text-pine">{item.kicker}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
          </li>
        ))}
      </ul>

      <div className="marquee mt-14 overflow-hidden border-y border-line/80 bg-white/50 py-4">
        <div className="marquee-track flex w-max items-center gap-8 pr-8">
          {[...ticker, ...ticker].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-8 text-sm font-medium tracking-wide text-muted">
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-pine" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </section>
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
