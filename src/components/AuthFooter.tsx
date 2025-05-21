"use client";

import Link from "next/link";

export default function AuthFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-md space-y-2 px-4">
        <div className="flex justify-center space-x-4">
          <Link href="/" className="hover:text-primary hover:underline">
            Trang chủ
          </Link>
          <Link href="/tos" className="hover:text-primary hover:underline">
            Điều khoản dịch vụ
          </Link>
          <Link href="#" className="hover:text-primary hover:underline">
            Trợ giúp
          </Link>
        </div>
        <p>
          &copy; {currentYear} Quick CV. Bản quyền thuộc về Quick CV.
        </p>
      </div>
    </footer>
  );
} 