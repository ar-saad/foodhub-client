import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { userService } from "@/services/user.service";

export default async function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = await userService.getSession();
  const userInfo = data?.user;

  return (
    <div>
      <Navbar user={userInfo} />
      {children}
      <Footer />
    </div>
  );
}
