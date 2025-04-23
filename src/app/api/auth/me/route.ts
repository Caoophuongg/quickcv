import { NextResponse } from "next/server";
import { getAuthSession, getUserById } from "@/lib/auth";

export async function GET() {
  try {
    // Lấy session từ cookie
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Lấy thông tin người dùng từ database
    const user = await getUserById(session.id);

    if (!user) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy thông tin người dùng" },
      { status: 500 },
    );
  }
}
