import { Gift, Clock3, Sparkles, ShieldCheck, Lock } from "lucide-react";
import { Reveal } from "./reveal";

const BENEFITS = [
  {
    icon: Gift,
    title: "Free to join",
    body: "No fees. Members register in under two minutes.",
  },
  {
    icon: Clock3,
    title: "24/7 access",
    body: "Order any hour. Delivered any day.",
  },
  {
    icon: Sparkles,
    title: "Curated selection",
    body: "Every product is hand-picked, sampled, and approved.",
  },
  {
    icon: Lock,
    title: "Discreet packaging",
    body: "Plain. Sealed. No branding on the outside.",
  },
  {
    icon: ShieldCheck,
    title: "POPIA-compliant",
    body: "Your data stays yours. Encrypted, never shared.",
  },
];

export function Benefits() {
  return (
    <section className="relative py-24 sm:py-32 bg-surface text-ink overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(180,240,0,0.14), transparent 40%), radial-gradient(circle at 85% 80%, rgba(116,195,52,0.14), transparent 40%)",
        }}
      />
      <div className="absolute inset-0 grain opacity-40" />

      <div className="container-wide relative">
        <Reveal className="max-w-2xl mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
            Membership
          </p>
          <h2 className="mt-3 font-display uppercase text-[34px] sm:text-h2 font-bold leading-tight tracking-tight text-balance">
            What you get when you join.
          </h2>
          <p className="mt-3 text-muted">
            Five things every member gets, every order, every time.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={i * 90}>
                <div className="group h-full rounded-card border border-purple/15 bg-glass/60 backdrop-blur p-6 transition-all duration-300 hover:bg-glass hover:border-purple/35 hover:-translate-y-1">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-purple/20 bg-purple/10 text-purple transition-colors duration-300 group-hover:bg-purple group-hover:text-background">
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="mt-4 font-display uppercase font-bold text-lg leading-tight text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">
                    {b.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
