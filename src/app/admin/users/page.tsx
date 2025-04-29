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
import { 
  Search, 
  UserPlus, 
  Loader2, 
  MoreHorizontal, 
  Eye,
  Pencil,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

      const data = await api.get(`/api/admin/users?${params.toString()}`);
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
      await api.patch(`/api/admin/users/${userId}`, { role: newRole });

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

  // Xử lý xóa người dùng
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await api.delete(`/api/admin/users/${selectedUser.id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
      toast.success("Xóa người dùng thành công");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa người dùng");
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
                      <SelectTrigger 
                        className={cn(
                          "w-28 justify-center font-medium",
                          user.role === "ADMIN" 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        <SelectValue>
                          {user.role === "ADMIN" ? "Admin" : "User"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER" className="font-medium">
                          User
                        </SelectItem>
                        <SelectItem value="ADMIN" className="font-medium">
                          Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Thao tác</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Xóa</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Dialog xem chi tiết người dùng */}
      {selectedUser && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chi tiết người dùng</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về người dùng
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium">ID:</span>
                <span className="col-span-2 text-sm">{selectedUser.id}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium">Email:</span>
                <span className="col-span-2 text-sm">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium">Họ tên:</span>
                <span className="col-span-2 text-sm">
                  {selectedUser.firstName && selectedUser.lastName
                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                    : "Chưa cập nhật"}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium">Quyền:</span>
                <Badge
                  variant={selectedUser.role === "ADMIN" ? "default" : "secondary"}
                  className="col-span-2 w-fit"
                >
                  {selectedUser.role === "ADMIN" ? "Admin" : "User"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium">CV đã tạo:</span>
                <span className="col-span-2 text-sm">{selectedUser._count.resumes}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="text-sm font-medium">Ngày tạo:</span>
                <span className="col-span-2 text-sm">
                  {format(new Date(selectedUser.createdAt), "dd/MM/yyyy HH:mm:ss")}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDetailOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog xác nhận xóa người dùng */}
      {selectedUser && (
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Xác nhận xóa người dùng
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser.email}</strong>? 
                Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu của người dùng này,
                bao gồm tất cả CV đã tạo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
