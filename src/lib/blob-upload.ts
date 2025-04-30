import { put, del, list } from '@vercel/blob';
import { randomUUID } from "crypto";
import path from "path";

interface BlobUploadResult {
  url: string;
  path: string;
  filename: string;
}

/**
 * Upload một file lên Vercel Blob
 * @param folderPath Đường dẫn thư mục, ví dụ: "images/avatars"
 * @param file File cần upload
 * @returns Thông tin về file đã upload
 */
export async function uploadToBlob(
  folderPath: string,
  file: File,
): Promise<BlobUploadResult> {
  try {
    const uniqueFilename = generateUniqueFilename(file.name);
    // Tạo đường dẫn đầy đủ với folder path
    const fullPath = `${folderPath}/${uniqueFilename}`;
    
    // Upload file lên Vercel Blob
    const blob = await put(fullPath, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      path: fullPath,
      filename: uniqueFilename,
    };
  } catch (error) {
    console.error("Lỗi khi upload lên Vercel Blob:", error);
    throw error;
  }
}

/**
 * Xóa một file từ Vercel Blob
 * @param url URL của file cần xóa 
 * @returns true nếu xóa thành công, ngược lại false
 */
export async function deleteFromBlob(url: string): Promise<boolean> {
  try {
    if (!url) {
      return false;
    }

    // Kiểm tra nếu URL thuộc Vercel Blob
    if (!url.includes('vercel-blob.com')) {
      return false;
    }

    // Xóa file từ Vercel Blob
    await del(url);
    return true;
  } catch (error) {
    console.error("Lỗi khi xóa file từ Vercel Blob:", error);
    return false;
  }
}

/**
 * Tạo tên file duy nhất để tránh trùng lặp
 * @param originalFilename Tên file gốc
 * @returns Tên file duy nhất
 */
function generateUniqueFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename);
  const baseName = path.basename(originalFilename, extension);
  const timestamp = Date.now();
  const uniqueId = randomUUID().substring(0, 8);

  return `${baseName}-${timestamp}-${uniqueId}${extension}`;
} 