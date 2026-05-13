import { Clock, MapPin, Users, Sparkles } from "lucide-react";

const STATS = [
  { icon: Clock, value: "24/7", label: "Always-on delivery" },
  { icon: MapPin, value: "Stellenbosch", label: "Western Cape" },
  { icon: Users, value: "Members only", label: "Invite-driven" },
  { icon: Sparkles, value: "Premium", label: "Curated strains" },
];

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-surface">
      <div className="container-wide">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-start">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
              About Elevations247
            </p>
            <h2 className="mt-3 font-display text-[34px] sm:text-h2 font-semibold leading-tight tracking-tight text-balance">
              Not a dealer.<br />
              Not a dispensary.<br />
              <span className="text-purple">A private members club.</span>
            </h2>
            <div className="mt-6 space-y-4 text-muted leading-relaxed text-pretty">
              <p>
                Elevations247 is the only one of its kind in Stellenbosch — a
                private members club where premium cannabis is curated,
                delivered, and experienced with the same intention and refinement
                you would expect from the finest wine estates in the valley.
              </p>
              <p>
                We operate under the constitutional right to privacy, as affirmed
                by the Constitutional Court in <em>Minister of Justice v Prince</em>{" "}
                [2018] ZACC 30. Members contribute credits applied toward the
                communal growing and acquisition of cannabis for personal use.
              </p>
              <p>
                This is not retail. This is not dealing. This is a private club —
                grounded in the law, run with care, and built for those who know
                the difference.
              </p>
            </div>
            <p className="mt-7 font-display text-xl text-purple-dark italic">
              Above the rest.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-card border border-line bg-background p-6 shadow-card hover:shadow-card-hover hover:border-purple/20 transition-all"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple/10 text-purple mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-display text-2xl font-bold leading-tight">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted">
                    {s.label}
                  </p>
                </div>
              );
            })}
            <div className="col-span-2 rounded-card bg-gradient-to-br from-purple-dark to-purple p-7 text-white shadow-card-hover">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 font-semibold">
                Experience Promise
              </p>
              <p className="mt-2 font-display text-[26px] leading-tight font-semibold">
                Every member.<br />Every order. Every time.
              </p>
              <p className="mt-2 text-sm text-white/80">
                Premium cannabis, delivered with care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
