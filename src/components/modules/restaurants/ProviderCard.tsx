import { Provider } from "@/types/provider.type";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, MapPin as RestaurantIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProviderCardProps {
  provider: Provider;
}

export default function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full py-0 gap-2">
      <div className="relative h-48 w-full bg-gray-100">
        {provider.logo ? (
          <Image
            src={provider.logo}
            alt={provider.name}
            height={300}
            width={500}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-indigo-100">
            <RestaurantIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={provider.isOpen ? "default" : "secondary"}
            className={provider.isOpen ? "bg-green-600" : "bg-gray-500"}
          >
            {provider.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        <div>
          <h3 className="text-lg font-semibold line-clamp-2">
            {provider.name}
          </h3>
          {provider.user && (
            <p className="text-sm text-muted-foreground">
              {provider.user.name}
            </p>
          )}
        </div>

        {provider.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
            {provider.description}
          </p>
        )}

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{provider.address}</span>
        </div>

        {provider.meals && provider.meals.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">{provider.meals.length}</span>
            <span className="text-muted-foreground">
              {provider.meals.length === 1 ? "featured meal" : "featured meals"}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Link href={`/restaurants/${provider.id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Menu
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
