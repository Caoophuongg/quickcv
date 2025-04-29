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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Đảm bảo params được await trước khi sử dụng
    const userId = (await params).id;

    // Kiểm tra user id
    if (!userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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

    // Không cho phép admin cuối cùng bị downgrade
    if (role === "USER") {
      const adminCount = await prisma.user.count({
        where: {
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        const isLastAdmin = await prisma.user.findUnique({
          where: {
            id: userId,
            role: "ADMIN",
          },
        });

        if (isLastAdmin) {
          return NextResponse.json(
            { error: "Cannot downgrade the last admin" },
            { status: 400 }
          );
        }
      }
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

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Đảm bảo params được await trước khi sử dụng
    const userId = (await params).id;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Không cho phép xóa chính mình
    if (userId === session.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    // Không cho phép xóa admin cuối cùng
    const isAdmin = await prisma.user.findUnique({
      where: {
        id: userId,
        role: "ADMIN",
      },
    });

    if (isAdmin) {
      const adminCount = await prisma.user.count({
        where: {
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin" },
          { status: 400 }
        );
      }
    }

    // Xóa tất cả CV và dữ liệu liên quan của người dùng
    // Prisma sẽ tự động xóa các bản ghi liên quan do có onDelete: Cascade
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      email: deletedUser.email,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
