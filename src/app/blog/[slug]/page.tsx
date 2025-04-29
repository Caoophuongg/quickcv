"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Calendar, User, Loader2 } from "lucide-react";

// Định nghĩa interface cho blog
interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  author: {
    firstName: string | null;
    lastName: string | null;
  };
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy chi tiết blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${params.slug}`);
        setBlog(response.data);
      } catch (error: any) {
        console.error("Error fetching blog:", error);
        setError(
          error.response?.status === 404
            ? "Bài viết không tồn tại hoặc đã bị xóa"
            : "Đã có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  // Format tên tác giả
  const formatAuthorName = (author?: { firstName: string | null; lastName: string | null }) => {
    if (!author) return "Admin";
    if (author.firstName || author.lastName) {
      return `${author.firstName || ''} ${author.lastName || ''}`.trim();
    }
    return "Admin";
  };

  // Format ngày
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Hiển thị loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-4xl px-3 md:px-4 lg:px-6">
          <main className="py-10">
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-[300px] w-full" />
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-4xl px-3 md:px-4 lg:px-6">
          <main className="py-10">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại trang blog
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Hiển thị blog không tồn tại
  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto w-full max-w-4xl px-3 md:px-4 lg:px-6">
          <main className="py-10">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="text-2xl font-bold mb-4">
                Bài viết không tồn tại hoặc đã bị xóa
              </h1>
              <Button asChild variant="outline">
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại trang blog
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <article className="mx-auto w-full max-w-4xl px-3 md:px-4 lg:px-6">
        <main className="py-10">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div>
              <Button variant="link" asChild className="p-0">
                <Link href="/blog" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft className="h-4 w-4 mr-2 inline" />
                  Quay lại trang blog
                </Link>
              </Button>
            </div>

            {/* Tiêu đề và thông tin */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-prim">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{formatAuthorName(blog.author)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
              </div>
            </div>

            {/* Ảnh đại diện */}
            {blog.thumbnail && (
              <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Nội dung bài viết */}
            <div 
              className="prose prose-lg max-w-none mt-6 blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </main>
      </article>
    </div>
  );
} 