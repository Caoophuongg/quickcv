"use client";

import { useState, useEffect, Component, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert";
import { Loader2, AlertCircle, Save, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

// Import React Quill động để tránh lỗi SSR
const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-[250px] border rounded-md flex items-center justify-center">Loading editor...</div>
});
import "react-quill/dist/quill.snow.css";

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode, fallback: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error in component:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Định nghĩa props
interface BlogFormProps {
  blogId?: string; // Nếu có ID, đây là form sửa blog
}

// Định nghĩa interface cho Blog
interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  content: string;
  excerpt: string | null;
  published: boolean;
}

// Cấu hình Quill
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

// Simple Fallback Editor
function SimpleFallbackEditor({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Viết nội dung bài viết ở đây..."
      className="h-[250px] font-mono"
    />
  );
}

export default function BlogForm({ blogId }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!blogId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State cho form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailLoading, setThumbnailLoading] = useState(false);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(false);
  
  // State cho UI
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(isEditing);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Nếu đang sửa, lấy thông tin blog
  useEffect(() => {
    if (isEditing) {
      fetchBlogData();
    }
  }, [blogId, isEditing]);

  // Hàm lấy thông tin blog
  const fetchBlogData = async () => {
    try {
      setFetchingBlog(true);
      const response = await axios.get(`/api/admin/blogs/${blogId}`);
      const blog = response.data;
      
      // Cập nhật state từ dữ liệu API
      setTitle(blog.title);
      setSlug(blog.slug);
      setThumbnail(blog.thumbnail || "");
      setContent(blog.content);
      setExcerpt(blog.excerpt || "");
      setPublished(blog.published);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Không thể tải thông tin bài viết");
    } finally {
      setFetchingBlog(false);
    }
  };

  // Hàm tạo slug tự động từ tiêu đề
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a")
      .replace(/[èéẹẻẽêềếệểễ]/g, "e")
      .replace(/[ìíịỉĩ]/g, "i")
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o")
      .replace(/[ùúụủũưừứựửữ]/g, "u")
      .replace(/[ỳýỵỷỹ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .trim();
  };

  // Xử lý khi tiêu đề thay đổi, tự động cập nhật slug nếu chưa được sửa thủ công
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Chỉ cập nhật slug nếu nó chưa được chỉnh sửa thủ công
    if (slug === "" || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Xử lý khi chọn file hình ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // Tạo URL tạm thời để hiển thị preview
      const tempUrl = URL.createObjectURL(file);
      setThumbnail(tempUrl);
    }
  };

  // Xử lý upload hình ảnh
  const handleUploadThumbnail = async () => {
    if (!thumbnailFile) return;

    try {
      setThumbnailLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

      const response = await axios.post('/api/admin/upload-thumbnail', formData);
      setThumbnail(response.data.thumbnailUrl);
      setSuccess("Tải lên hình ảnh thành công");
    } catch (error: any) {
      console.error("Error uploading thumbnail:", error);
      setError(
        error.response?.data?.error || 
        "Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại sau."
      );
    } finally {
      setThumbnailLoading(false);
      setThumbnailFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Xóa hình ảnh đã chọn
  const handleRemoveThumbnail = () => {
    setThumbnail("");
    setThumbnailFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!title || !slug || !content) {
      setError("Vui lòng điền đầy đủ thông tin cần thiết");
      return;
    }

    // Nếu có file hình ảnh nhưng chưa upload, thực hiện upload trước
    if (thumbnailFile) {
      await handleUploadThumbnail();
    }

    try {
      setLoading(true);
      const blogData = {
        title,
        slug,
        thumbnail: thumbnail || null,
        content,
        excerpt: excerpt || null,
        published,
      };

      let response: { data: Blog };
      
      if (isEditing) {
        // Cập nhật blog
        response = await axios.patch(`/api/admin/blogs/${blogId}`, blogData);
        setSuccess("Bài viết đã được cập nhật thành công");
      } else {
        // Tạo blog mới
        response = await axios.post("/api/admin/blogs", blogData);
        setSuccess("Bài viết đã được tạo thành công");
        
        // Chuyển hướng đến trang sửa nếu tạo thành công
        if (response.data.id) {
          setTimeout(() => {
            router.push(`/admin/blogs/${response.data.id}`);
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error("Error saving blog:", error);
      setError(
        error.response?.data?.error || 
        "Đã xảy ra lỗi khi lưu bài viết. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingBlog) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Đang tải thông tin bài viết...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h1>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Cập nhật" : "Lưu"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-500/15 text-green-600 border-green-500/50">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Phần bên trái: Thông tin cơ bản */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung</CardTitle>
              <CardDescription>Thông tin cơ bản của bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề bài viết"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{slug}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Ảnh đại diện</Label>
                <div className="space-y-2">
                  {thumbnail && (
                    <div className="relative w-full h-[200px] bg-muted rounded-md overflow-hidden mb-4">
                      <Image 
                        src={thumbnail} 
                        alt="Thumbnail preview" 
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveThumbnail}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {!thumbnail && (
                    <div className="w-full p-4 border border-dashed rounded-md flex flex-col items-center justify-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="thumbnail"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Kéo thả hình ảnh hoặc click để chọn
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG hoặc GIF (tối đa 5MB)
                        </p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Chọn hình ảnh
                      </Button>
                    </div>
                  )}

                  {thumbnailFile && (
                    <Button
                      type="button"
                      disabled={thumbnailLoading}
                      onClick={handleUploadThumbnail}
                      className="w-full"
                    >
                      {thumbnailLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Tải lên hình ảnh
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Mô tả ngắn</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Mô tả ngắn về bài viết (hiển thị ở trang danh sách)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung bài viết</Label>
                <div className="min-h-[300px]">
                  <ErrorBoundary fallback={<SimpleFallbackEditor value={content} onChange={setContent} />}>
                    <ReactQuill
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={quillModules}
                      placeholder="Viết nội dung bài viết ở đây..."
                      className="h-[250px] mb-12"
                    />
                  </ErrorBoundary>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phần bên phải: Cài đặt xuất bản */}
        <div className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xuất bản</CardTitle>
              <CardDescription>Cài đặt xuất bản bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="cursor-pointer">
                  Xuất bản
                </Label>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {published
                  ? "Bài viết sẽ được hiển thị công khai"
                  : "Bài viết sẽ được lưu dưới dạng nháp"}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Cập nhật" : "Lưu"}
              </Button>
            </CardFooter>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">ID: {blogId}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
} 