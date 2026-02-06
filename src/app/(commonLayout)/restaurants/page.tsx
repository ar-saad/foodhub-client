"use client";

import RestaurantListBlock from "@/components/modules/restaurants/RestaurantsListBlock";
import { getAllProviders } from "@/actions/provider.actions";
import { useEffect, useState } from "react";
import { Provider } from "@/types";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RestaurantsListPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);

    const fetchProviders = async () => {
      try {
        const result = await getAllProviders(searchQuery);
        setProviders(result.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProviders();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-5 py-12 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl text-primary font-bold tracking-tight">
          Our Partners
        </h1>
        <p className="text-muted-foreground">
          Discover restaurants and food partners near you
        </p>
      </div>
      <div className="mb-6 mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 text-lg"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <RestaurantListBlock providers={providers} searchQuery={searchQuery} />
      )}
    </div>
  );
}
