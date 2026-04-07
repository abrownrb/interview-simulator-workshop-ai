import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50">
      <Hero />
      <FeatureCards />
    </main>
  );
}
