import { getOrder } from "@/actions/order.actions";
import OrderDetailBlock from "@/components/modules/userDashboard/orders/OrderDetailBlock";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrder(id);

  if (result.error || !result.data?.data) {
    notFound();
  }

  return (
    <div>
      <OrderDetailBlock order={result.data.data} role="CUSTOMER" />
    </div>
  );
}
