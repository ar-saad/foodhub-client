import { getProvider } from "@/actions/provider.actions";
import RestaurantPublicProfile from "@/components/modules/restaurants/RestaurantPublicProfile";

export default async function RestaurantProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getProvider(id);
  const provider = data.data;

  return (
    <div>
      <RestaurantPublicProfile provider={provider} />
    </div>
  );
}
