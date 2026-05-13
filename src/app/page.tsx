import { PublicNav } from "@/components/site/public-nav";
import { Hero } from "@/components/site/hero";
import { HowItWorks } from "@/components/site/how-it-works";
import { ProductsTeaser } from "@/components/site/products-teaser";
import { About } from "@/components/site/about";
import { Categories } from "@/components/site/categories";
import { Benefits } from "@/components/site/benefits";
import { FAQ } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";

export default function HomePage() {
  return (
    <>
      <PublicNav overlay />
      <main>
        <Hero />
        <HowItWorks />
        <ProductsTeaser />
        <About />
        <Categories />
        <Benefits />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
