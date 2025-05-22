import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Editor - Thiết kế CV của bạn",
  description: "Tạo và chỉnh sửa CV chuyên nghiệp",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {children}
      <Toaster />
    </div>
  );
} 