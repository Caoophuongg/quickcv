"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-[#f6f2fc]">
      <div className="px-4 py-12 sm:px-6 md:px-8 lg:px-24 xl:px-52 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-xl font-bold tracking-tight text-[#7129be]">
                Quick CV
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Công cụ tạo CV đơn giản, chuyên nghiệp và hiện đại giúp bạn nổi bật trước nhà tuyển dụng.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/resumes" className="text-muted-foreground hover:text-primary">
                  CV của tôi
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/tos" className="text-muted-foreground hover:text-primary">
                  Điều khoản dịch vụ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Tạo CV
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  AI viết CV
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Mẫu CV
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Nâng cấp Premium
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Liên hệ</h3>
            <address className="not-italic">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">+84 123 456 789</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-muted-foreground" />
                  <a href="mailto:support@quickcv.com" className="text-muted-foreground hover:text-primary">
                    support@quickcv.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM
                  </span>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} Quick CV. Bản quyền thuộc về Quick CV.
          </p>
        </div>
      </div>
    </footer>
  );
} 