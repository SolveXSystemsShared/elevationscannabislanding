import { ClipboardCheck, FlaskConical, PackageCheck } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: ClipboardCheck,
    n: "01",
    title: "Register",
    body:
      "Sign up with your details and become a member instantly. Free to join — invite-driven at launch.",
  },
  {
    icon: FlaskConical,
    n: "02",
    title: "Browse",
    body:
      "Explore our curated selection of premium flower, pre-rolls, edibles and vapes — all categorised by type, grade and effect.",
  },
  {
    icon: PackageCheck,
    n: "03",
    title: "Order",
    body:
      "Place your order, pay securely via Yoco, and we'll deliver discreetly to your door. 24/7, anywhere in Stellenbosch.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-background">
      <div className="container-wide">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
            How It Works
          </p>
          <h2 className="mt-3 font-display uppercase text-[34px] sm:text-h2 font-bold leading-tight tracking-tight text-balance">
            Three steps. <span className="text-purple">One reaction.</span>
          </h2>
          <p className="mt-3 text-muted text-pretty">
            From sign-up to your door in under an hour. Designed for adults who
            refuse to compromise.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n} delay={i * 120}>
                <div className="group relative h-full rounded-card border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-purple/30">
                  <div className="absolute right-6 top-6 font-mono text-[44px] font-bold leading-none text-purple/15 select-none">
                    {s.n}
                  </div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-purple/20 bg-purple/10 text-purple transition-colors duration-300 group-hover:bg-purple group-hover:text-background">
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{s.body}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-px w-6 bg-line" />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
