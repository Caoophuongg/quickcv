"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/AuthProvider";
import { Bot, FileText, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

// Định nghĩa interface cho blog
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  publishedAt: string;
  author: {
    firstName: string | null;
    lastName: string | null;
  };
}

export default function Home() {
  const { isAuthenticated, user, loading } = useAuthContext();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Lấy danh sách blog đã xuất bản
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const response = await axios.get('/api/blogs', {
          params: {
            limit: 3 // Chỉ lấy 3 bài blog mới nhất
          }
        });
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format tên tác giả
  const formatAuthorName = (author: { firstName: string | null; lastName: string | null }) => {
    if (author.firstName || author.lastName) {
      return `${author.firstName || ''} ${author.lastName || ''}`.trim();
    }
    return 'Admin';
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl px-3 md:px-4 lg:px-6">
        <main>
          {/* banner */}
          <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-20 py-16 md:py-32">
            <div className="flex flex-1 flex-col items-start gap-5">
              <p className="text-xl font-semibold uppercase text-prim">
                Welcome to QuickCV
              </p>
              <h1 className="scroll-m-20 text-3xl md:text-4xl font-semibold !leading-tight tracking-tight lg:text-6xl">
                <span className="inline-block text-prim">Tạo một CV hấp dẫn</span>{" "}
                với sự hỗ trợ của AI trong vài phút.
              </h1>
              <div className="text-lg md:text-xl text-[#212529]">
                <p>Tạo CV trực tuyến với sự hỗ trợ của AI</p>
                <p>
                  <span className="text-prim">Tạo một hồ sơ chuyên nghiệp</span> -
                  dễ dàng với trình xây dựng hỗ trợ AI của chúng tôi.
                </p>
              </div>
              <Button asChild className="bg-prim hover:bg-[#3d4080] w-full md:w-auto">
                <Link href="/resumes" className="px-6 md:px-8 py-5 md:py-6 text-lg md:text-xl">
                  Bắt đầu ngay
                </Link>
              </Button>
            </div>
            <div className="flex-1 w-full">
              <Image
                src="/resume-preview.jpg"
                alt="Resume preview"
                width={900}
                height={0}
                className="w-full h-auto"
              />
            </div>
          </section>
          {/* feat */}
          <section className="space-y-10 text-2xl md:text-3xl text-prim py-10">
            <h2 className="text-center font-bold">Tính năng của chúng tôi</h2>
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Feature 1 */}
              <div className="w-full flex-1 transform rounded-xl border border-[#a5a8e6] px-4 md:px-8 py-8 md:py-12 text-center shadow-xl transition duration-300 hover:-translate-y-3">
                <FileText className="mx-auto mb-4 h-8 w-8 md:h-10 md:w-10 text-indigo-600" />
                <h3 className="mb-2 text-xl md:text-2xl font-semibold">
                  Tạo sơ yếu lý lịch dễ dàng
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  Cho dù bạn mới bắt đầu hay đã có kinh nghiệm, hãy xây dựng một
                  bản sơ yếu lý lịch hoàn hảo chỉ trong vài phút.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="w-full flex-1 transform rounded-xl border border-[#a5a8e6] px-4 md:px-8 py-8 md:py-12 text-center shadow-xl transition duration-300 hover:-translate-y-3">
                <Share2 className="mx-auto mb-4 h-8 w-8 md:h-10 md:w-10 text-green-600" />
                <h3 className="mb-2 text-xl md:text-2xl font-semibold">
                  Tự động lưu và chia sẻ dễ dàng
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  Sơ yếu lý lịch của bạn được lưu tự động. Tải xuống dưới dạng PDF
                  hoặc chia sẻ chỉ bằng một cú nhấp chuột.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="w-full flex-1 transform rounded-xl border border-[#a5a8e6] px-4 md:px-8 py-8 md:py-12 text-center shadow-xl transition duration-300 hover:-translate-y-3">
                <Bot className="mx-auto mb-4 h-8 w-8 md:h-10 md:w-10 text-red-500" />
                <h3 className="mb-2 text-xl md:text-2xl font-semibold">
                  Gợi ý nội dung AI thông minh
                </h3>
                <p className="text-base md:text-lg text-gray-600">
                  Không biết nên viết gì? Hãy để AI của chúng tôi tạo ra nội dung
                  hoàn hảo cho bạn.
                </p>
              </div>
            </div>
          </section>
          {/* news */}
          <section className="my-16 md:my-32 space-y-10">
            <h2 className="text-center text-2xl md:text-3xl font-bold text-prim">
              Tin tức mới nhất
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingBlogs ? (
                // Hiển thị skeleton khi đang tải
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="relative flex-1 rounded-xl shadow-xl overflow-hidden">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="space-y-3 p-5">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))
              ) : blogs.length > 0 ? (
                // Hiển thị danh sách blog
                blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="relative flex-1 rounded-xl shadow-xl duration-200 hover:shadow-2xl"
                  >
                    <Image
                      src={blog.thumbnail || "/placeholder-blog.jpg"}
                      alt={blog.title}
                      width={400}
                      height={250}
                      className="w-full rounded-t-xl object-cover h-[200px]"
                    />
                    <div className="space-y-3 p-5">
                      <div className="flex items-center gap-2 text-base md:text-lg">
                        <p>
                          by <span className="text-prim">{formatAuthorName(blog.author)}</span>
                        </p>
                        |<p>{formatDate(blog.publishedAt)}</p>
                      </div>
                      <p className="text-lg md:text-xl font-semibold !leading-7 text-prim">
                        {blog.title}
                      </p>
                      <p className="line-clamp-2 text-gray-600">{blog.excerpt}</p>
                      <Link 
                        href={`/blog/${blog.slug}`} 
                        className="text-prim underline underline-offset-4 inline-block"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                // Hiển thị khi không có blog
                <div className="col-span-1 md:col-span-3 text-center py-10">
                  <p className="text-muted-foreground">
                    Chưa có bài viết nào. Hãy quay lại sau nhé!
                  </p>
                </div>
              )}
            </div>

            {blogs.length > 0 && (
              <div className="text-center mt-10">
                <Button asChild variant="outline">
                  <Link href="/blog">
                    Xem tất cả bài viết
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
