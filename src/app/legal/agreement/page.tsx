import { PublicNav } from "@/components/site/public-nav";
import { Footer } from "@/components/site/footer";

export const metadata = { title: "Membership Agreement" };

export default function AgreementPage() {
  return (
    <>
      <PublicNav />
      <main className="container-tight pt-32 pb-20 prose-purple">
        <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
          Legal · April 2026
        </p>
        <h1 className="mt-3 font-display text-h2 font-semibold tracking-tight">
          Membership Agreement
        </h1>
        <div className="mt-8 space-y-6 text-ink/80 leading-relaxed">
          <Clause n="01" title="Nature of the Club">
            Elevations247 is a private members club, not a retail outlet. Cannabis
            exchanged between members is facilitated as club credits applied
            toward the communal growing and acquisition of cannabis for personal
            use by adult members, as permitted under the Constitutional Court
            judgment in <em>Minister of Justice and Constitutional Development v
              Prince</em> [2018] ZACC 30.
          </Clause>
          <Clause n="02" title="Eligibility">
            Member confirms they are 18 years of age or older and a South African
            resident. Membership is non-transferable.
          </Clause>
          <Clause n="03" title="Personal Use Only">
            Member confirms that all cannabis received is strictly for their own
            personal use. Resale, redistribution or supply to third parties is
            strictly prohibited and constitutes a criminal offence.
          </Clause>
          <Clause n="04" title="Member Obligations">
            Member agrees to provide accurate and truthful registration
            information; to keep login credentials confidential; to comply with
            all applicable laws; and to use the platform in good faith.
          </Clause>
          <Clause n="05" title="Termination">
            Elevations247 reserves the right to suspend or terminate any
            membership at its sole discretion, without notice, if it reasonably
            believes a member is in breach of any of these terms.
          </Clause>
          <Clause n="06" title="Liability Limitation">
            Elevations247 accepts no liability for loss, injury or damage arising
            from the use of cannabis by its members. Members consume at their own
            risk.
          </Clause>
          <Clause n="07" title="Governing Law">
            This agreement is governed by the laws of the Republic of South
            Africa. Any disputes shall be subject to the jurisdiction of the
            courts of the Western Cape.
          </Clause>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Clause({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
        {n}
      </p>
      <h2 className="mt-1 font-display text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-pretty">{children}</p>
    </section>
  );
}
