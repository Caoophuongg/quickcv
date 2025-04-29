"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminClientLayoutProps {
  children: React.ReactNode;
  user: any; // Thay any bằng interface phù hợp cho user
}

export default function AdminClientLayout({ children, user }: AdminClientLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Lắng nghe sự thay đổi trạng thái của sidebar
  useEffect(() => {
    // Khôi phục trạng thái từ localStorage
    const savedState = localStorage.getItem('admin-sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }

    // Lắng nghe sự thay đổi
    const handleSidebarChange = (e: CustomEvent<{ isCollapsed: boolean }>) => {
      setSidebarCollapsed(e.detail.isCollapsed);
    };

    document.addEventListener('sidebar-collapse-changed', handleSidebarChange as EventListener);
    
    return () => {
      document.removeEventListener('sidebar-collapse-changed', handleSidebarChange as EventListener);
    };
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-[70px]' : 'ml-[250px]'}`}>
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 