import { Clock, MapPin, Users, Sparkles } from "lucide-react";

const STATS = [
  { icon: Clock, value: "24/7", label: "Always-on delivery" },
  { icon: MapPin, value: "Stellenbosch", label: "Western Cape" },
  { icon: Users, value: "Members only", label: "Invite-driven" },
  { icon: Sparkles, value: "Lab-graded", label: "Every strain" },
];

export function About() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-surface">
      <div className="container-wide">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-start">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
              About Breaking Bud
            </p>
            <h2 className="mt-3 font-display uppercase text-[34px] sm:text-h2 font-bold leading-tight tracking-tight text-balance">
              Not a dealer.<br />
              Not a dispensary.<br />
              <span className="text-purple">A private lab.</span>
            </h2>
            <div className="mt-6 space-y-4 text-muted leading-relaxed text-pretty">
              <p>
                Breaking Bud is a chemistry-lab dispensary — a private members
                club where every strain is lab-graded, catalogued like an element,
                and served with the precision you&apos;d expect from a research
                bench, not a back room.
              </p>
              <p>
                We operate under the constitutional right to privacy, as affirmed
                by the Constitutional Court in <em>Minister of Justice v Prince</em>{" "}
                [2018] ZACC 30. Members contribute credits applied toward the
                communal growing and acquisition of cannabis for personal use.
              </p>
              <p>
                This is not retail. This is not dealing. This is a private club —
                grounded in the law, run with care, and built for those who read
                the label.
              </p>
            </div>
            <p className="mt-7 font-display uppercase tracking-wide text-xl text-purple">
              The science of a better high.
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
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-purple/20 bg-purple/10 text-purple mb-4">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="font-display text-2xl font-bold uppercase leading-tight">
                    {s.value}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">
                    {s.label}
                  </p>
                </div>
              );
            })}
            <div className="col-span-2 rounded-card bg-gradient-to-br from-purple to-purple-dark p-7 text-background shadow-card-hover">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-background/70 font-semibold">
                Experience Promise
              </p>
              <p className="mt-2 font-display text-[26px] uppercase leading-tight font-bold">
                Every member.<br />Every order. Every time.
              </p>
              <p className="mt-2 text-sm text-background/80">
                Lab-graded cannabis, delivered with care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
