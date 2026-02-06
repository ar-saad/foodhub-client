import Hero from "@/components/modules/homepage/Hero";
import BrowseByCraving from "@/components/modules/homepage/BrowseByCraving";
import FeaturedVendors from "@/components/modules/homepage/FeaturedVendors";
import DualActionSplitSection from "@/components/modules/homepage/DualActionSplitSection";
import { getCategories } from "@/actions/category.actions";

export default async function HomePage() {
  const [categoriesResponse] = await Promise.all([getCategories()]);

  const allCategories = categoriesResponse.data ?? [];

  // Shuffle and pick up to 16 random categories, then split into 2 sets of 8
  const shuffled = [...allCategories].sort(() => Math.random() - 0.5);
  const heroCategories = shuffled.slice(0, 8);
  const cravingCategories = shuffled.slice(8, 16);

  return (
    <div>
      <Hero categories={heroCategories} />
      <BrowseByCraving categories={cravingCategories} />
      <FeaturedVendors />
      <DualActionSplitSection />
    </div>
  );
}
