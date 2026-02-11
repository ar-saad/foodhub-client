import { Provider } from "@/types/provider.type";
import { Card } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";
import ProviderCard from "./ProviderCard";

export default function RestaurantsListBlock({
  providers,
  searchQuery,
}: {
  providers: Provider[];
  searchQuery: string;
}) {
  if (providers.length === 0) {
    return (
      <div className="space-y-4 my-5">
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4 mb-2">
            <UtensilsCrossed className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Providers Found</h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery
                ? "We couldn't find any providers matching your search. Try adjusting your search query."
                : "No providers available at the moment."}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-5">
      <div>
        <p className="text-sm text-muted-foreground">
          Found {providers.length}{" "}
          {providers.length === 1 ? "partner" : "partners"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 gap-y-10">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
}
