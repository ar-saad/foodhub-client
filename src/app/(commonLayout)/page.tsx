import Hero from "@/components/modules/homepage/Hero";
import BrowseByCraving from "@/components/modules/homepage/BrowseByCraving";
import FeaturedVendors from "@/components/modules/homepage/FeaturedVendors";
import DualActionSplitSection from "@/components/modules/homepage/DualActionSplitSection";
import { getCategories } from "@/actions/category.actions";
import { getAllProviders } from "@/actions/provider.actions";

export default async function HomePage() {
  const [categoriesResponse, providersResponse] = await Promise.all([
    getCategories(),
    getAllProviders(),
  ]);

  const allCategories = categoriesResponse.data ?? [];
  const allProviders = providersResponse.data.data ?? [];

  // Shuffle and pick up to 16 random categories, then split into 2 sets of 8
  const categoriesShuffled = [...allCategories].sort(() => Math.random() - 0.5);
  const heroCategories = categoriesShuffled.slice(0, 8);
  const cravingCategories = categoriesShuffled.slice(8, 16);
  // Just take the first 4 providers for now; randomize later when there are more
  const featuredProviders = allProviders.slice(0, 4);
  // Pick 9 categories from the middle for the split section
  const splitSectionCategories = allCategories.slice(4, 13);

  return (
    <div>
      <Hero categories={heroCategories} />
      <BrowseByCraving categories={cravingCategories} />
      <FeaturedVendors providers={featuredProviders} />
      <DualActionSplitSection
        categories={splitSectionCategories}
        providers={featuredProviders}
      />
    </div>
  );
}
