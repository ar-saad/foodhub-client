"use client";

import RestaurantListBlock from "@/components/modules/restaurants/RestaurantsListBlock";
import { getAllProviders } from "@/actions/provider.actions";
import { useEffect, useState } from "react";
import { Provider } from "@/types";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CommonPagesLoading from "../loading";

export default function RestaurantsListPage() {
  const [loading, setLoading] = useState<Boolean>(true);
  const [providers, setProviders] = useState<Provider[]>();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      const result = await getAllProviders(searchQuery);

      setProviders(result.data.data || []);
    };

    const debounceTimer = setTimeout(() => {
      fetchProviders();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl text-primary font-bold tracking-tight">
          Our Partners
        </h1>
        <p className="text-muted-foreground">
          Discover restaurants and food partners near you
        </p>
      </div>
      <div className="border border-primary rounded-lg flex items-center">
        <Search className="h-5 w-5 text-primary ml-2" />
        <Input
          placeholder="Search restaurants or partners by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-10"
        />
      </div>
      <RestaurantListBlock
        providers={providers || []}
        searchQuery={searchQuery}
      />
    </div>
  );
}
