import { PublicNav } from "@/components/site/public-nav";
import { Footer } from "@/components/site/footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PublicNav />
      <main className="container-tight pt-32 pb-20">
        <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
          POPIA · April 2026
        </p>
        <h1 className="mt-3 font-display text-h2 font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-muted">
          How Elevations247 collects, processes, and protects your personal
          information under the Protection of Personal Information Act (POPIA),
          Act 4 of 2013.
        </p>
        <div className="mt-8 space-y-6 text-ink/80 leading-relaxed">
          <ul className="space-y-4">
            <li>
              Elevations247 collects personal information (name, cell, email, ID
              number, address) solely for the purposes of verifying membership
              eligibility, processing orders, and maintaining the private club
              register.
            </li>
            <li>
              Personal information will not be shared with, sold to, or disclosed
              to any third party except where required by law.
            </li>
            <li>
              Members have the right to request access to their personal
              information, request correction of inaccurate information, and
              request deletion of their information in accordance with POPIA
              (Act 4 of 2013).
            </li>
            <li>
              All data is stored securely. Elevations247 takes all reasonable
              measures to protect personal information against loss, damage, and
              unauthorised access.
            </li>
            <li>
              By registering, members consent to the processing of their personal
              information as described in this notice and the Privacy Policy.
            </li>
          </ul>
          <p>
            For any data-protection request, contact{" "}
            <a className="text-purple underline" href="mailto:info@elevations247.com">
              info@elevations247.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
