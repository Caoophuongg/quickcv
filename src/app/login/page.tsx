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
import { Mail, Key, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, error, loading, isAuthenticated, isAdmin } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/resumes";

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push(redirect);
      }
    }
  }, [isAuthenticated, isAdmin, router, redirect]);

  useEffect(() => {
    if (error) {
      toast.error(error.error);
    }
  }, [error]);

  const onSubmit = async (values: LoginValues) => {
    await login(values);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập thông tin đăng nhập của bạn để truy cập tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Đăng ký
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
