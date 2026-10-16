const steps = [
  {
    number: "01",
    kicker: "You share",
    title: "Four measures",
    text: "You give your sugar level, blood pressure, age, and alcohol status.",
  },
  {
    number: "02",
    kicker: "We process",
    title: "The model reads them",
    text: "Our machine learning model processes your inputs and weighs them together.",
  },
  {
    number: "03",
    kicker: "You receive",
    title: "A prediction",
    text: "A prediction is given on the chances of heart disease.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal overflow-hidden rounded-[36px] border border-line bg-white/80 px-5 py-14 shadow-[0_30px_80px_-48px_rgba(14,122,70,0.45)] backdrop-blur-sm sm:px-10 lg:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-medium tracking-[0.16em] text-pine uppercase">How it works</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                Three steps from your numbers to a prediction.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted">
              Heartometer stays narrow on purpose. The same four inputs go in, the model reads them, and a risk prediction comes back.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="pointer-events-none absolute top-8 right-8 left-8 hidden overflow-hidden md:block" aria-hidden="true">
              <div className="h-px bg-line" />
              <div className="beam absolute top-0 left-0" />
            </div>
            <ol className="grid gap-5 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.number}>
                  <article className="step-card group relative h-full overflow-hidden rounded-[28px] border border-line bg-white p-6 sm:p-7">
                    <div className="pointer-events-none absolute -top-6 -right-2 font-mono text-7xl font-semibold tracking-tighter text-pine/10 transition-colors duration-500 group-hover:text-pine/20">
                      {step.number}
                    </div>
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-pine text-sm font-semibold tracking-wide text-white shadow-[0_12px_24px_-14px_rgba(14,122,70,1)] transition-transform duration-500 group-hover:scale-105">
                      {step.number}
                    </div>
                    <p className="relative mt-8 text-xs font-medium tracking-[0.16em] text-pine uppercase">
                      {step.kicker}
                    </p>
                    <h3 className="relative mt-2 text-2xl font-semibold tracking-tight">{step.title}</h3>
                    <p className="relative mt-3 text-[15px] leading-relaxed text-muted">{step.text}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-8 text-sm text-muted">
            The result is a model estimate. It is not a diagnosis or a substitute for clinical care.
          </p>
        </div>
      </div>
    </section>
  );
}
