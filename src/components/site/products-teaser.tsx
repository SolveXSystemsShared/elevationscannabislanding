import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { SEED_PRODUCTS } from "@/lib/seed";
import { ProductTile } from "./product-tile";
import { JOIN_URL, LOGIN_URL } from "@/lib/constants";

export function ProductsTeaser() {
  const featured = SEED_PRODUCTS.slice(0, 8);
  return (
    <section
      id="products"
      className="relative py-24 sm:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #FAFAFA 0%, #F4EEFB 50%, #FAFAFA 100%)",
      }}
    >
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
              The Menu
            </p>
            <h2 className="mt-3 font-display text-[34px] sm:text-h2 font-semibold leading-tight tracking-tight">
              Curated, never compromised.
            </h2>
            <p className="mt-3 text-muted text-pretty">
              Indoor flower, hand-rolled pre-rolls, microdosed edibles, and
              ceramic-core vapes. Selected by people who know.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={JOIN_URL}>Unlock the Full Menu</a>
          </Button>
        </div>

        <div className="relative">
          {/* Locked grid — visible but blurred */}
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 [filter:blur(6px)] pointer-events-none select-none">
            {featured.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-card bg-surface border border-line shadow-card-hover px-6 py-7 text-center max-w-md mx-4 animate-fade-in">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple/10 text-purple mb-3">
                <Lock className="h-5 w-5" />
              </div>
              <Badge variant="subtle" className="mb-2">
                Members only
              </Badge>
              <h3 className="font-display text-h3 leading-tight">
                Join free to unlock the full menu.
              </h3>
              <p className="mt-1.5 text-sm text-muted">
                Browse stock, prices, and live availability — for verified
                members only.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild>
                  <a href={JOIN_URL}>Join Free</a>
                </Button>
                <Button asChild variant="ghost">
                  <a href={LOGIN_URL}>Already a member?</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
