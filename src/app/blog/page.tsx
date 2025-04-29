"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { Search, Loader2 } from "lucide-react";

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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách blog đã xuất bản
  useEffect(() => {
    fetchBlogs();
  }, [pagination.page, searchTerm]);

  // Hàm lấy danh sách blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/blogs", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
        },
      });
      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 }); // Reset về trang 1 khi tìm kiếm
  };

  // Xử lý phân trang
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

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
        <main className="py-10">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-prim">
                Tin tức & Hướng dẫn
              </h1>
              
              {/* Thanh tìm kiếm */}
              <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                <Input
                  type="search"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm
                </Button>
              </form>
            </div>

            {/* Danh sách bài viết */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
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
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy bài viết nào{searchTerm ? ` phù hợp với "${searchTerm}"` : ""}.
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchTerm("")}
                  >
                    Xem tất cả bài viết
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="relative flex-1 rounded-xl shadow-xl duration-200 hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                      <Image
                        src={blog.thumbnail || "/placeholder-blog.jpg"}
                        alt={blog.title}
                        width={400}
                        height={250}
                        className="w-full rounded-t-xl object-cover h-[200px]"
                      />
                      <div className="space-y-3 p-5">
                        <div className="flex items-center gap-2 text-base">
                          <p>
                            by <span className="text-prim">{formatAuthorName(blog.author)}</span>
                          </p>
                          |<p>{formatDate(blog.publishedAt)}</p>
                        </div>
                        <p className="text-xl font-semibold !leading-7 text-prim">
                          {blog.title}
                        </p>
                        <p className="line-clamp-2 text-gray-600">{blog.excerpt}</p>
                        <div className="text-prim underline underline-offset-4">
                          Đọc thêm
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Phân trang */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                      >
                        Trước
                      </Button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={page === pagination.page ? "default" : "outline"}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      )}
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 