"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: string;
  _count: {
    resumes: number;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  const fetchUsers = async (page = 1, search = searchTerm) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách người dùng");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải danh sách người dùng");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý thay đổi role
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật quyền người dùng");
      }

      // Cập nhật danh sách người dùng
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );

      toast.success("Cập nhật quyền thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật quyền");
      console.error(error);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, searchTerm);
  };

  // Xử lý phân trang
  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchTerm);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý người dùng
        </h1>
        <Button size="sm" className="gap-1">
          <UserPlus className="h-4 w-4" />
          <span>Thêm người dùng</span>
        </Button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex items-center gap-2">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm email, tên người dùng..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm">
            Tìm kiếm
          </Button>
        </form>
      </div>

      {/* Bảng người dùng */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>CV đã tạo</TableHead>
              <TableHead>Quyền</TableHead>
              <TableHead className="w-[100px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không tìm thấy người dùng
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{user._count.resumes}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user.id, value as UserRole)
                      }
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue>
                          <Badge
                            variant={
                              user.role === "ADMIN" ? "default" : "outline"
                            }
                          >
                            {user.role === "ADMIN" ? "Admin" : "User"}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <span className="sr-only">Chi tiết</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M12 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" />
                        <path d="M19 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" />
                        <path d="M5 13a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z" />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      {pagination.totalPages > 1 && (
        <Pagination className="mx-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.page - 1)}
                className={
                  pagination.page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNumber)}
                      isActive={pagination.page === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}

            {pagination.totalPages > 5 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(pagination.totalPages)}
                    isActive={pagination.page === pagination.totalPages}
                    className="cursor-pointer"
                  >
                    {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.page + 1)}
                className={
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
