"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/providers/AuthProvider";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUserProfile, deleteAvatar } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith("image/")) {
        toast.error("File phải là hình ảnh");
        return;
      }

      // Kiểm tra kích thước file (tối đa 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước file không được vượt quá 2MB");
        return;
      }

      setAvatar(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.avatarUrl) {
      // Nếu chỉ đang xóa avatar trong preview
      setAvatar(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    try {
      setIsLoading(true);
      // Gọi API để xóa avatar
      await deleteAvatar();
      
      // Xóa avatar cục bộ
      setAvatar(null);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast.success("Đã xóa ảnh đại diện");
    } catch (error) {
      toast.error("Không thể xóa ảnh đại diện");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        avatar: avatar,
      });
      toast.success("Hồ sơ đã được cập nhật thành công");
    } catch (error) {
      toast.error("Không thể cập nhật hồ sơ");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center">
      <div className="container max-w-3xl py-10">
        <h1 className="mb-6 text-center text-3xl font-bold">Hồ sơ của tôi</h1>
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-4 flex flex-col items-center gap-4">
                <div className="relative h-32 w-32">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.email}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="text-4xl">
                        {user?.firstName?.[0] || user?.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="avatar"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Chọn ảnh đại diện
                  </Button>
                  {(avatarPreview || user?.avatarUrl) && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemoveAvatar}
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Ảnh PNG, JPG hoặc GIF (tối đa 2MB)
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Tên</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Họ</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-center gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full max-w-[120px]"
                >
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full max-w-xs"
                >
                  {isLoading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
