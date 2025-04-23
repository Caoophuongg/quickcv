import { useCallback, useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  avatarUrl?: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthError {
  error: string;
  details?: Record<string, unknown>;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  avatar?: File | null;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({ error: result.error, details: result.details });
        return;
      }

      // Sau khi đăng ký thành công, tiến hành đăng nhập
      await login({ email: data.email, password: data.password });
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      setError({ error: "Có lỗi xảy ra khi đăng ký" });
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({ error: result.error, details: result.details });
        return;
      }

      setUser(result.user);

      // Tải lại trang để middleware kiểm tra cookies
      router.refresh();
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      setError({ error: "Có lỗi xảy ra khi đăng nhập" });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);

      // Chuyển hướng về trang chủ
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Lỗi khi đăng xuất:", err);
      setError({ error: "Có lỗi xảy ra khi đăng xuất" });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);

      // Xử lý upload avatar nếu có
      let avatarUrl;
      if (data.avatar instanceof File) {
        const formData = new FormData();
        formData.append("avatar", data.avatar);

        const uploadResponse = await fetch("/api/auth/upload-avatar", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          setError({ error: uploadError.error || "Lỗi khi tải lên avatar" });
          throw new Error("Lỗi khi tải lên avatar");
        }

        const uploadResult = await uploadResponse.json();
        avatarUrl = uploadResult.avatarUrl;
      }

      // Tạo body cập nhật profile
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        ...(avatarUrl && { avatarUrl }),
        ...(data.avatar === null && { avatarUrl: null }),
      };

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({ error: result.error, details: result.details });
        return;
      }

      // Cập nhật thông tin người dùng trong state
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...result.user } : null,
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật hồ sơ:", err);
      setError({ error: "Có lỗi xảy ra khi cập nhật hồ sơ" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError({ error: result.error, details: result.details });
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Lỗi khi đổi mật khẩu:", err);
      setError({ error: "Có lỗi xảy ra khi đổi mật khẩu" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUserProfile,
    changePassword,
    isAdmin,
    isAuthenticated,
  };
}
