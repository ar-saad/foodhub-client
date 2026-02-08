import OrderDetailBlock from "@/components/modules/userDashboard/orders/OrderDetailBlock";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <OrderDetailBlock orderId={id} role="ADMIN" />
    </div>
  );
}
