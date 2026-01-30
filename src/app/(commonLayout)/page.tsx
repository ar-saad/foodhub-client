import Hero from "@/components/modules/homepage/Hero";
import BrowseByCraving from "@/components/modules/homepage/BrowseByCraving";
import FeaturedVendors from "@/components/modules/homepage/FeaturedVendors";

export default async function HomePage() {
  return (
    <div>
      <Hero />
      <BrowseByCraving />
      <FeaturedVendors />
    </div>
  );
}
