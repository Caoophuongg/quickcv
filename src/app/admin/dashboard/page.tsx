import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, BarChart3 } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function DashboardPage() {
  // Đếm tổng số người dùng
  const totalUsers = await prisma.user.count();

  // Đếm số người dùng theo role
  const usersByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true,
    },
  });

  // Đếm tổng số resume
  const totalResumes = await prisma.resume.count();

  // Format dữ liệu role
  const adminCount =
    usersByRole.find((item) => item.role === "ADMIN")?._count.role || 0;
  const regularUserCount =
    usersByRole.find((item) => item.role === "USER")?._count.role || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Tổng quan về hệ thống AI Resume Builder
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card tổng số người dùng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng người dùng
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {adminCount} admin, {regularUserCount} người dùng
            </p>
          </CardContent>
        </Card>

        {/* Card tổng số resume */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng CV đã tạo
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResumes}</div>
            <p className="text-xs text-muted-foreground">
              Trung bình{" "}
              {totalUsers > 0 ? (totalResumes / totalUsers).toFixed(1) : 0}{" "}
              CV/người dùng
            </p>
          </CardContent>
        </Card>

        {/* Card thống kê khác */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tỉ lệ chuyển đổi
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalUsers > 0
                ? Math.round((totalResumes / totalUsers) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Tỉ lệ người dùng tạo CV
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
