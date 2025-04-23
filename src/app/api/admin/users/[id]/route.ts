import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getAuthSession();

    // Kiểm tra quyền admin
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Không có quyền truy cập" },
        { status: 403 },
      );
    }

    const userId = params.id;

    // Kiểm tra user id
    if (!userId) {
      return NextResponse.json(
        { error: "ID người dùng không hợp lệ" },
        { status: 400 },
      );
    }

    // Lấy dữ liệu từ request
    const body = await req.json();

    // Validate dữ liệu đầu vào
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: result.error.format() },
        { status: 400 },
      );
    }

    const { role } = result.data;

    // Kiểm tra người dùng tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    // Ngăn chặn việc tự hạ cấp quyền của chính mình
    if (session.id === userId && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Không thể thay đổi quyền của chính mình" },
        { status: 400 },
      );
    }

    // Cập nhật thông tin người dùng
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi cập nhật người dùng" },
      { status: 500 },
    );
  }
}
