import { Flame, Leaf, Moon, Wind } from "lucide-react";
import { JOIN_URL } from "@/lib/constants";
import { Reveal } from "./reveal";

const CATS = [
  {
    icon: Leaf,
    label: "Flower",
    desc: "Hydro, indoor, tunnel and greenhouse strains",
    slug: "flower",
    symbol: "Fl",
    n: "01",
  },
  {
    icon: Flame,
    label: "Pre-Rolls",
    desc: "Hand-rolled. Perfectly packed.",
    slug: "preroll",
    symbol: "Pr",
    n: "05",
  },
  {
    icon: Moon,
    label: "Moonsticks",
    desc: "Concentrate-coated, kief-rolled",
    slug: "moonstick",
    symbol: "Mo",
    n: "07",
  },
  {
    icon: Wind,
    label: "Vapes",
    desc: "Ceramic-core distillate · Reina",
    slug: "vape",
    symbol: "Va",
    n: "09",
  },
];

export function Categories() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-wide">
        <Reveal className="max-w-2xl mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
            The Groups
          </p>
          <h2 className="mt-3 font-display uppercase text-[34px] sm:text-h2 font-bold leading-tight tracking-tight">
            Four families on the table.
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.slug} delay={i * 100}>
                <a
                  href={JOIN_URL}
                  className="group relative flex h-full flex-col overflow-hidden rounded-card border border-purple/15 bg-glass p-7 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 hover:border-purple/40 ring-focus"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 top-2 font-display text-[90px] font-bold leading-none text-purple/10 transition-all duration-300 group-hover:text-purple/20 group-hover:scale-105"
                  >
                    {c.symbol}
                  </span>
                  <span className="relative font-mono text-xs text-purple/80">{c.n}</span>
                  <div className="relative mt-3">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-purple/20 bg-purple/10 text-purple transition-colors duration-300 group-hover:bg-purple group-hover:text-background">
                      <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                    </div>
                    <h3 className="mt-5 font-display text-[22px] font-bold uppercase tracking-tight text-ink">
                      {c.label}
                    </h3>
                    <p className="mt-1 text-sm normal-case text-muted">{c.desc}</p>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-wider font-semibold text-purple opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                      Members only →
                    </p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
