import Hero from "@/components/modules/homepage/Hero";
import BrowseByCraving from "@/components/modules/homepage/BrowseByCraving";
import FeaturedVendors from "@/components/modules/homepage/FeaturedVendors";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import StatsSection from "@/components/modules/homepage/StatsSection";
import WhyChooseFoodHub from "@/components/modules/homepage/WhyChooseFoodHub";
import DualActionSplitSection from "@/components/modules/homepage/DualActionSplitSection";
import Testimonials from "@/components/modules/homepage/Testimonials";
import FAQ from "@/components/modules/homepage/FAQ";
import BecomePartnerCTA from "@/components/modules/homepage/BecomePartnerCTA";
import { getCategories } from "@/actions/category.actions";
import { getAllProviders } from "@/actions/provider.actions";
import { getPlatformStats } from "@/actions/stats.actions";

export default async function HomePage() {
  const [categoriesResponse, providersResponse, statsResponse] = await Promise.all([
    getCategories({ limit: "99999" }),
    getAllProviders(),
    getPlatformStats(),
  ]);

  const allCategories = categoriesResponse.data?.data?.data ?? [];
  const allProviders = providersResponse.data.data ?? [];
  const stats = statsResponse.data;

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
      {/* 1. Hero */}
      <Hero categories={heroCategories} restaurantCount={allProviders.length} />
      {/* 2. Browse by Craving */}
      <BrowseByCraving categories={cravingCategories} />
      {/* 3. Featured Vendors */}
      <FeaturedVendors providers={featuredProviders} />
      {/* 4. How It Works */}
      <HowItWorks />
      {/* 5. Stats */}
      <StatsSection
        restaurantCount={stats?.restaurantCount ?? allProviders.length}
        customerCount={stats?.customerCount ?? 0}
        orderCount={stats?.orderCount ?? 0}
      />
      {/* 6. Why Choose FoodHub */}
      <WhyChooseFoodHub />
      {/* 7. Explore (Dual Action) */}
      <DualActionSplitSection
        categories={splitSectionCategories}
        providers={featuredProviders}
      />
      {/* 8. Testimonials */}
      <Testimonials />
      {/* 9. FAQ */}
      <FAQ />
      {/* 10. Become a Partner CTA */}
      <BecomePartnerCTA />
    </div>
  );
}
