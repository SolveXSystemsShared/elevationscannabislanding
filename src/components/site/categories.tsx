import { Flame, Leaf, Sparkles, Wind } from "lucide-react";
import { JOIN_URL } from "@/lib/constants";

const CATS = [
  {
    icon: Leaf,
    label: "Flower",
    desc: "Hydro, indoor, tunnel and greenhouse strains",
    slug: "flower",
  },
  {
    icon: Flame,
    label: "Pre-Rolls",
    desc: "Hand-rolled. Perfectly packed.",
    slug: "preroll",
  },
  {
    icon: Sparkles,
    label: "Moonsticks",
    desc: "Concentrate-coated, kief-rolled",
    slug: "moonstick",
  },
  {
    icon: Wind,
    label: "Vapes",
    desc: "Ceramic-core distillate · Reina",
    slug: "vape",
  },
];

export function Categories() {
  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="container-wide">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
            Categories
          </p>
          <h2 className="mt-3 font-display text-[34px] sm:text-h2 font-semibold leading-tight tracking-tight">
            Four ways to elevate.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.slug}
                href={JOIN_URL}
                className="group relative overflow-hidden rounded-card border border-line bg-surface p-7 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1 hover:border-purple/20 ring-focus"
              >
                <div
                  className="absolute -top-12 -right-12 h-44 w-44 rounded-full opacity-[0.08] group-hover:opacity-20 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(circle, #6C3FC5 0%, transparent 70%)",
                  }}
                />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple/10 text-purple group-hover:bg-purple group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-[22px] font-semibold tracking-tight">
                    {c.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{c.desc}</p>
                  <p className="mt-5 text-[11px] uppercase tracking-wider font-semibold text-purple opacity-70 group-hover:opacity-100 transition-opacity">
                    Members only →
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
