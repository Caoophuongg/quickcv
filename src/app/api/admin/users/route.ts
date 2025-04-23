import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 },
      );
    }

    // Lấy query params
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // Tính toán offset cho phân trang
    const skip = (page - 1) * limit;

    // Lấy danh sách người dùng với filter
    const whereClause = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            resumes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    // Lấy tổng số người dùng để tính phân trang
    const totalUsers = await prisma.user.count({
      where: whereClause,
    });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
        totalItems: totalUsers,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy danh sách người dùng" },
      { status: 500 },
    );
  }
}
