import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";

// Validate dữ liệu cập nhật blog
const updateBlogSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Tiêu đề phải có ít nhất 3 ký tự" })
    .optional(),
  content: z
    .string()
    .min(10, { message: "Nội dung phải có ít nhất 10 ký tự" })
    .optional(),
  excerpt: z.string().optional().nullish(),
  thumbnail: z.string().optional().nullish(),
  slug: z
    .string()
    .min(3, { message: "Slug phải có ít nhất 3 ký tự" })
    .optional(),
  published: z.boolean().optional(),
});

// GET: Lấy chi tiết một blog
export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { params } = await context;
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Lấy thông tin blog
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// PATCH: Cập nhật blog
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { params } = await context;
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Kiểm tra blog tồn tại
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Lấy dữ liệu từ request
    const body = await req.json();

    // Validate dữ liệu đầu vào
    const validationResult = updateBlogSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 },
      );
    }

    const updateData = validationResult.data;

    // Kiểm tra xem slug đã tồn tại chưa (nếu có slug mới)
    if (updateData.slug && updateData.slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug: updateData.slug },
      });

      if (slugExists) {
        return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });
      }
    }

    // Cập nhật thời gian xuất bản nếu trạng thái published thay đổi
    if (
      updateData.published !== undefined &&
      !existingBlog.published &&
      updateData.published
    ) {
      (updateData as any).publishedAt = new Date();
    }

    // Cập nhật blog
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE: Xóa blog
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { params } = await context;
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Kiểm tra blog tồn tại
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Xóa blog
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
