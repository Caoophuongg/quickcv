import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";

// Validate dữ liệu đầu vào cho blog
const blogSchema = z.object({
  title: z.string().min(3, { message: "Tiêu đề phải có ít nhất 3 ký tự" }),
  content: z.string().min(10, { message: "Nội dung phải có ít nhất 10 ký tự" }),
  excerpt: z.string().optional(),
  thumbnail: z.string().optional(),
  slug: z.string().min(3, { message: "Slug phải có ít nhất 3 ký tự" }),
  published: z.boolean().default(false),
});

// GET: Lấy danh sách tất cả các blog
export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Lấy query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Tính toán phân trang
    const skip = (page - 1) * limit;

    // Xây dựng điều kiện tìm kiếm
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    // Lấy dữ liệu blog và tổng số bản ghi
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
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
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Tạo một blog mới
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Lấy dữ liệu từ request
    const body = await req.json();

    // Validate dữ liệu đầu vào
    const validationResult = blogSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { title, content, excerpt, thumbnail, slug, published } = validationResult.data;

    // Kiểm tra xem slug đã tồn tại chưa
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo blog mới
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        thumbnail: thumbnail || null,
        slug,
        published,
        publishedAt: published ? new Date() : null,
        authorId: session.id,
      },
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 