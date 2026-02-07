import UserProfileUpdateForm from "@/components/modules/common/userProfile/UserProfileUpdateForm";
import { userService } from "@/services/user.service";

export default async function UserProfileUpdatePage() {
  const { data, error } = await userService.getSession();
  const user = data.user;

  return <UserProfileUpdateForm user={user} />;
}
