"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    email: "user@example.com",
    phone: "0987654321",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Giả lập gọi API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Thành công
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      // Thất bại
      toast.error("Cập nhật thông tin thất bại");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    // Giả lập thành công
    toast.success("Đã gửi email đặt lại mật khẩu");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Hồ sơ cá nhân</h1>
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 pt-4 sm:flex-row">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Đang cập nhật..." : "Lưu thông tin"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResetPassword}
                className="flex-1"
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
