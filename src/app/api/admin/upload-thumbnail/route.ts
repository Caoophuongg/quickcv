import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { uploadFile } from "@/lib/file-upload";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Xử lý form data để lấy file thumbnail
    const formData = await req.formData();
    const thumbnailFile = formData.get("thumbnail") as File;

    if (!thumbnailFile) {
      return NextResponse.json(
        { error: "Không tìm thấy file hình ảnh" },
        { status: 400 },
      );
    }

    // Kiểm tra loại file
    if (!thumbnailFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File phải là hình ảnh" },
        { status: 400 },
      );
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (thumbnailFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Kích thước file không được vượt quá 5MB" },
        { status: 400 },
      );
    }

    // Upload thumbnail vào thư mục public
    const uploadResult = await uploadFile(
      "images/blog-thumbnails",
      thumbnailFile,
    );

    return NextResponse.json({
      thumbnailUrl: uploadResult.url,
      message: "Upload hình ảnh thành công",
    });
  } catch (error) {
    console.error("Lỗi khi upload hình ảnh:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi upload hình ảnh" },
      { status: 500 },
    );
  }
}
