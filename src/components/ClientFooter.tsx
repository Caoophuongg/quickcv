"use client";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ClientFooter() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isEditor = pathname.startsWith("/editor") || pathname.startsWith("/(main)/editor");

  if (isAdmin || isEditor) return null;
  return <Footer />;
} 