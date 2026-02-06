import UserStatusUpdateForm from "@/components/modules/adminDashboard/users/UserStatusUpdate";
import UserProfileViewPage from "@/components/modules/common/userProfile/UserProfileView";

export default async function AdminDashboardUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <UserProfileViewPage userId={id} />
      {/* Admin control */}
      <UserStatusUpdateForm userId={id} />
    </div>
  );
}
