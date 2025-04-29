"use client";

import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return <BlogForm blogId={params.id} />;
} 