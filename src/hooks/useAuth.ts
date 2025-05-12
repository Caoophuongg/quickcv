import { useCallback, useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  STORAGE_KEYS,
  getStoredData,
  storeData,
  safeLocalStorage,
  isDataStale,
} from "@/lib/localStorage";

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
  message?: string;
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
  deleteAvatar: () => Promise<void>;
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

      // Check localStorage for cached user data first
      const cachedUser = getStoredData<User>(STORAGE_KEYS.USER_PROFILE);

      // Use cached data if it exists and is not stale (30 minutes)
      if (cachedUser && !isDataStale(cachedUser.timestamp)) {
        setUser(cachedUser.data);
        
        // Preload avatar if available from cache for faster rendering
        if (cachedUser.data?.avatarUrl) {
          const cachedAvatarKey = `avatar_cache_${cachedUser.data.id}`;
          try {
            // Save avatar URL in dedicated avatar cache
            safeLocalStorage.setItem(cachedAvatarKey, cachedUser.data.avatarUrl);
            
            // Preload avatar image to browser cache
            const img = new window.Image();
            img.src = cachedUser.data.avatarUrl;
          } catch (err) {
            console.error("Error preloading cached avatar:", err);
          }
        }
        
        setLoading(false);
        return;
      }

      // Thêm Cache-Control vào header để cải thiện hiệu suất
      const response = await fetch("/api/auth/me", {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
        cache: "force-cache", // Sử dụng cơ chế cache của Next.js 
        headers: {
          "Cache-Control": "max-age=300", // Cache trong 5 phút
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);

        // Store user data in localStorage with timestamp
        storeData(STORAGE_KEYS.USER_PROFILE, data.user);
        
        // Preload and cache avatar if available
        if (data.user?.avatarUrl) {
          const cachedAvatarKey = `avatar_cache_${data.user.id}`;
          try {
            safeLocalStorage.setItem(cachedAvatarKey, data.user.avatarUrl);
            
            // Preload avatar image to browser cache
            const img = new window.Image();
            img.src = data.user.avatarUrl;
          } catch (err) {
            console.error("Error preloading avatar:", err);
          }
        }
      } else {
        setUser(null);
        // Clear stored data if no user is authenticated
        safeLocalStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
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
        setError({ 
          error: result.error, 
          message: result.message,
          details: result.details 
        });
        setLoading(false);
        return;
      }

      setUser(result.user);

      // Store user data in localStorage after successful login
      storeData(STORAGE_KEYS.USER_PROFILE, result.user);

      // Preload avatar image if available to ensure it's cached for all pages
      if (result.user?.avatarUrl) {
        try {
          // Cache the avatar URL for immediate access
          const cachedAvatarKey = `avatar_cache_${result.user.id}`;
          safeLocalStorage.setItem(cachedAvatarKey, result.user.avatarUrl);
          
          // Preload the avatar image to browser cache
          const img = new window.Image();
          img.src = result.user.avatarUrl;
        } catch (err) {
          console.error("Error preloading avatar:", err);
        }
      }

      // Kiểm tra nếu user là admin thì chuyển hướng đến trang dashboard admin
      if (result.user.role === UserRole.ADMIN) {
        router.push("/admin/dashboard");
      } else {
        router.push("/resumes");
      }

      // Tải lại trang để middleware kiểm tra cookies
      router.refresh();
    } catch (err) {
      console.error("Lỗi khi đăng nhập:", err);
      setError({ error: "Có lỗi xảy ra khi đăng nhập" });
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

      // Remove user data from localStorage on logout
      safeLocalStorage.removeItem(STORAGE_KEYS.USER_PROFILE);

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
      const updateData: {
        firstName?: string;
        lastName?: string;
        avatarUrl?: string | null;
      } = {
        firstName: data.firstName,
        lastName: data.lastName,
      };
      
      // Chỉ thêm avatarUrl vào updateData khi:
      // 1. Đã upload ảnh mới (avatar là File)
      // 2. Hoặc muốn xóa ảnh (avatar là null)
      if (data.avatar instanceof File && avatarUrl) {
        updateData.avatarUrl = avatarUrl;
      } else if (data.avatar === null) {
        updateData.avatarUrl = null;
      }
      // Nếu không chỉnh sửa avatar (data.avatar là undefined), không gửi trường avatarUrl

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

      // Cập nhật thông tin người dùng trong state và localStorage
      setUser((prevUser) => {
        const updatedUser = prevUser ? { ...prevUser, ...result.user } : null;

        // Update localStorage if user data was successfully updated
        if (updatedUser) {
          storeData(STORAGE_KEYS.USER_PROFILE, updatedUser);
        }

        return updatedUser;
      });
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

  const deleteAvatar = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/delete-avatar", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setError({ error: result.error, details: result.details });
        return;
      }

      // Cập nhật thông tin người dùng trong state
      if (user) {
        const updatedUser = {
          ...user,
          avatarUrl: undefined
        };
        setUser(updatedUser);

        // Cập nhật localStorage
        storeData(STORAGE_KEYS.USER_PROFILE, updatedUser);
      }
    } catch (err) {
      console.error("Lỗi khi xóa avatar:", err);
      setError({ error: "Có lỗi xảy ra khi xóa avatar" });
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
    deleteAvatar,
    isAdmin,
    isAuthenticated,
  };
}
