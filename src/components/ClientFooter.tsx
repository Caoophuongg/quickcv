"use client";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ClientFooter() {
  const pathname = usePathname();
  
  // Không hiển thị footer trong trang Editor và Admin
  const isEditorRoute = pathname.startsWith("/editor");
  const isAdminRoute = pathname.startsWith("/admin");
  
  if (isEditorRoute || isAdminRoute) return null;
  
  return <Footer />;
} 