import ProviderProfileUpdateForm from "@/components/modules/providerDashboard/providerProfile/ProviderProfileUpdateForm";
import { providerService } from "@/services/provider.service";

export default async function ProviderProfileUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await providerService.getById(id);
  const provider = data.data;

  return (
    <div>
      <ProviderProfileUpdateForm provider={provider} />
    </div>
  );
}
