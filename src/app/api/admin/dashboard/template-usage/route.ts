import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Đếm số lượng resume theo từng templateType
  const data = await prisma.resume.groupBy({
    by: ["templateType"],
    _count: { templateType: true },
  });

  // Trả về dạng: [{ templateType: "BLANK", _count: { templateType: 10 } }, ...]
  return NextResponse.json(data);
} 