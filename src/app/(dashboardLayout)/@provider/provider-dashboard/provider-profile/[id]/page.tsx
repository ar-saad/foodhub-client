import RestaurantPublicProfile from "@/components/modules/restaurants/RestaurantPublicProfile";
import { Button } from "@/components/ui/button";
import { providerService } from "@/services/provider.service";
import { SquarePen } from "lucide-react";
import Link from "next/link";

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await providerService.getById(id);
  const provider = data.data;

  return (
    <div>
      <RestaurantPublicProfile provider={provider} />
      <div className="flex justify-center mb-2">
        <Link href={`/provider-dashboard/provider-profile/${id}/update`}>
          <Button>
            Update Provider Profile <SquarePen />
          </Button>
        </Link>
      </div>
    </div>
  );
}
