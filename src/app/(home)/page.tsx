import { QUERIES } from "@/src/server/db/queries";
import Hero from "@/src/components/home/Hero";
import Features from "@/src/components/home/Features";
import Featured from "@/src/components/home/Featured";

export default function Home() {
  const featuredMapsPromise = QUERIES.getFeaturedMaps();

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-background via-primary-50/30 to-accent-50/20">
        <div className="container mx-auto px-4 py-16">
          <Hero />
          <Featured featuredMapsPromise={featuredMapsPromise} />
          <Features />
        </div>
      </main>
    </>
  );
}
