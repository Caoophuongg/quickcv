import { getAuthSession, getUserById } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  // Kiểm tra người dùng đã đăng nhập và có quyền admin
  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN") {
    redirect("/");
  }

  // Lấy thông tin đầy đủ của người dùng
  const user = await getUserById(session.id);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
