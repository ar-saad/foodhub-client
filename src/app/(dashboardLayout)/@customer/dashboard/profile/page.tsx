import UserProfileViewPage from "@/components/modules/common/userProfile/UserProfileView";
import Link from "next/link";
import {} from "lucide-react";

export default function UserProfilePage() {
  return (
    <div>
      <UserProfileViewPage />
      <Link href="/dashboard/profile/update">Update</Link>
    </div>
  );
}
