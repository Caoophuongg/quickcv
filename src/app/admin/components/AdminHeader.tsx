"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/providers/AuthProvider";
import { LogOut, User, Settings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

interface AdminHeaderProps {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user.email} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/profile"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Hồ sơ của tôi</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/settings"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Cài đặt tài khoản</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
