"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/AuthProvider";
import { Bot, FileText, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const newsData = [
  {
    id: 1,
    thumbnail: "/item1.png",
    title: "How to Write a Shipping Clerk Resume with Skills and Job Duties",
    content:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea aperiam similique, fugit harum reiciendis blanditiis enim natus officia dolorum vitae.",
    author: "Admin",
    date: "22-04-2025",
  },
  {
    id: 2,
    thumbnail: "/item2.png",
    title: "Physical Therapist Resume Tips That Get You Hired in 2025",
    content:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea aperiam similique, fugit harum reiciendis blanditiis enim natus officia dolorum vitae.",
    author: "Admin",
    date: "22-04-2025",
  },
  {
    id: 3,
    thumbnail: "/item3.png",
    title:
      "Truck Driver Resume Writing Guide with Job Description and Top Skills",
    content:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea aperiam similique, fugit harum reiciendis blanditiis enim natus officia dolorum vitae.",
    author: "Admin",
    date: "22-04-2025",
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <div className="px-72">
      <header className="flex items-center justify-between py-4">
        <Image src="/logo.png" alt="Logo" width={50} height={50} />
        <div className="flex items-center justify-between gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.firstName?.[0] || user?.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex gap-3 text-lg font-medium">
              <Link href="/login" className="px-5 py-3 text-prim">
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-prim px-5 py-3 text-white hover:bg-[#3d4080]"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* banner */}
        <section className="flex items-center justify-between py-52">
          <div className="flex flex-1 flex-col items-start gap-5">
            <p className="text-xl font-semibold uppercase text-prim">
              Welcome to QuickCV
            </p>
            <h1 className="scroll-m-20 text-4xl font-semibold !leading-tight tracking-tight lg:text-6xl">
              <span className="inline-block text-prim">Tạo một CV hấp dẫn</span>{" "}
              với sự hỗ trợ của AI trong vài phút.
            </h1>
            <div className="text-xl text-[#212529]">
              <p>Trình tạo sơ yếu lý lịch trực tuyến với sự hỗ trợ của AI</p>
              <p>
                <span className="text-prim">
                  Tạo một sơ yếu lý lịch chuyên nghiệp
                </span>{" "}
                - dễ dàng với trình xây dựng hỗ trợ AI của chúng tôi.
              </p>
            </div>
            <Button asChild className="bg-prim hover:bg-[#3d4080]">
              <Link href="/resumes" className="px-8 py-7 text-xl">
                Bắt đầu
              </Link>
            </Button>
          </div>
          <div className="flex-1">
            <Image
              src="/resume-preview.jpg"
              alt="Resume preview"
              width={1800}
              height={0}
            />
          </div>
        </section>
        {/* feat */}
        <section className="space-y-10 text-3xl text-prim">
          <h2 className="text-center font-bold">Tính năng của chúng tôi</h2>
          <div className="flex flex-col gap-6 lg:flex-row">
            {" "}
            {/* Feature 1 */}
            <div className="w-full flex-1 transform rounded-xl border border-[#a5a8e6] px-8 py-12 text-center shadow-xl transition duration-300 hover:-translate-y-3">
              <FileText className="mx-auto mb-4 h-10 w-10 text-indigo-600" />
              <h3 className="mb-2 text-2xl font-semibold">
                Tạo Sơ yếu lý lịch dễ dàng
              </h3>
              <p className="text-lg text-gray-600">
                Cho dù bạn mới bắt đầu hay đã có kinh nghiệm, hãy xây dựng một
                bản sơ yếu lý lịch hoàn hảo chỉ trong vài phút.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="w-full flex-1 transform rounded-xl border border-[#a5a8e6] px-8 py-12 text-center shadow-xl transition duration-300 hover:-translate-y-3">
              <Share2 className="mx-auto mb-4 h-10 w-10 text-green-600" />
              <h3 className="mb-2 text-2xl font-semibold">
                Tự động lưu và chia sẻ dễ dàng
              </h3>
              <p className="text-lg text-gray-600">
                Sơ yếu lý lịch của bạn được lưu tự động. Tải xuống dưới dạng PDF
                hoặc chia sẻ chỉ bằng một cú nhấp chuột.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="w-full flex-1 transform rounded-xl border border-[#a5a8e6] px-8 py-12 text-center shadow-xl transition duration-300 hover:-translate-y-3">
              <Bot className="mx-auto mb-4 h-10 w-10 text-red-500" />
              <h3 className="mb-2 text-2xl font-semibold">
                Gợi ý nội dung AI thông minh
              </h3>
              <p className="text-lg text-gray-600">
                Không biết nên viết gì? Hãy để AI của chúng tôi tạo ra nội dung
                hoàn hảo cho bạn.
              </p>
            </div>
          </div>
        </section>
        {/* news */}
        <section className="my-32 space-y-10">
          <h2 className="text-center text-3xl font-bold text-prim">
            Tin tức mới nhất
          </h2>
          <div className="grid grid-cols-3 gap-6 lg:flex-row">
            {newsData.map((data) => (
              <div
                key={data.id}
                className="relative flex-1 rounded-xl shadow-xl duration-200 hover:shadow-2xl"
              >
                <Image
                  src={data.thumbnail}
                  alt={data.title}
                  width={400}
                  height={250}
                  className="w-full rounded-t-xl object-cover"
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-center gap-2 text-lg">
                    <p>
                      by <span className="text-prim">{data.author}</span>
                    </p>
                    |<p>{data.date}</p>
                  </div>
                  <p className="text-xl font-semibold !leading-7 text-prim">
                    {data.title}
                  </p>
                  <p className="line-clamp-2 text-gray-600">{data.content}</p>
                  <button className="text-prim underline underline-offset-4">
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
