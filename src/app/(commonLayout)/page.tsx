import Hero from "@/components/modules/homepage/Hero";
import BrowseByCraving from "@/components/modules/homepage/BrowseByCraving";
import FeaturedVendors from "@/components/modules/homepage/FeaturedVendors";
import DualActionSplitSection from "@/components/modules/homepage/DualActionSplitSection";

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <BrowseByCraving />
      <FeaturedVendors />
      <DualActionSplitSection />
    </div>
  );
}
