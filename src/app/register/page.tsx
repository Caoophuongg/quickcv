"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/providers/AuthProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Key, User, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

// Hàm kiểm tra yêu cầu mật khẩu mạnh
const passwordRequirements = {
  minLength: (value: string) => value.length >= 6,
  hasUpperCase: (value: string) => /[A-Z]/.test(value),
  hasLowerCase: (value: string) => /[a-z]/.test(value),
  hasNumbers: (value: string) => /[0-9]/.test(value),
  hasSpecialChar: (value: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
};

// Schema mới với yêu cầu mật khẩu mạnh hơn
const registerSchema = z
  .object({
    firstName: z.string().min(1, "Tên không được để trống"),
    lastName: z.string().min(1, "Họ không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .refine(passwordRequirements.hasUpperCase, {
        message: "Mật khẩu phải có ít nhất 1 chữ cái hoa (A-Z)",
      })
      .refine(passwordRequirements.hasLowerCase, {
        message: "Mật khẩu phải có ít nhất 1 chữ cái thường (a-z)",
      })
      .refine(passwordRequirements.hasNumbers, {
        message: "Mật khẩu phải có ít nhất 1 số (0-9)",
      })
      .refine(passwordRequirements.hasSpecialChar, {
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      }),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, error, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const [passwordInput, setPasswordInput] = useState("");

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/resumes");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error(error.error);
    }
  }, [error]);

  const onSubmit = async (values: RegisterValues) => {
    const { confirmPassword, ...registerData } = values;
    await register(registerData);
  };

  // Component hiển thị trạng thái yêu cầu mật khẩu
  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <XCircle className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Đăng ký</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để sử dụng dịch vụ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring">
                          <User className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Văn A"
                            className="border-0 focus-visible:ring-0"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ</FormLabel>
                      <FormControl>
                        <div className="flex items-center rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring">
                          <User className="ml-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Nguyễn"
                            className="border-0 focus-visible:ring-0"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring">
                        <Mail className="ml-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="email@example.com"
                          className="border-0 focus-visible:ring-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <div className="flex items-center rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring">
                        <Key className="ml-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="******"
                          className="border-0 focus-visible:ring-0"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPasswordInput(e.target.value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <div className="mt-3 space-y-2 rounded-md border p-3">
                      <p className="text-sm font-medium">Mật khẩu phải:</p>
                      <div className="space-y-1 text-xs">
                        <PasswordRequirement 
                          met={passwordRequirements.minLength(passwordInput)} 
                          text="Có ít nhất 6 ký tự" 
                        />
                        <PasswordRequirement 
                          met={passwordRequirements.hasLowerCase(passwordInput)} 
                          text="Có ít nhất 1 chữ cái thường (a-z)" 
                        />
                        <PasswordRequirement 
                          met={passwordRequirements.hasUpperCase(passwordInput)} 
                          text="Có ít nhất 1 chữ cái hoa (A-Z)" 
                        />
                        <PasswordRequirement 
                          met={passwordRequirements.hasNumbers(passwordInput)} 
                          text="Có ít nhất 1 số (0-9)" 
                        />
                        <PasswordRequirement 
                          met={passwordRequirements.hasSpecialChar(passwordInput)} 
                          text="Có ít nhất 1 ký tự đặc biệt (!@#$...)" 
                        />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="flex items-center rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring">
                        <Key className="ml-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="******"
                          className="border-0 focus-visible:ring-0"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-center text-sm">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Đăng nhập
            </Link>
          </div>
          <Link
            href="/"
            className="text-center text-sm text-muted-foreground hover:underline"
          >
            Quay lại trang chủ
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
