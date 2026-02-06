import UserProfileViewPage from "@/components/modules/common/userProfile/UserProfileView";

export default async function AdminDashboardUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserProfileViewPage userId={id} />;
}
