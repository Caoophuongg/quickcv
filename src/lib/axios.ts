import axios, { AxiosResponse } from "axios";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  // Khi không có baseURL, axios sẽ tự động sử dụng URL hiện tại của ứng dụng
  // Điều này làm cho nó hoạt động chính xác trên cả môi trường dev và production
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 giây
});

// Thêm interceptor xử lý request
api.interceptors.request.use(
  (config) => {
    // Có thể thêm logic xử lý token ở đây nếu cần
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Thêm interceptor xử lý response
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về data trực tiếp từ response
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response) {
      // Lỗi từ server với status code
      console.error(
        "Response error:",
        error.response.status,
        error.response.data,
      );

      // Xử lý lỗi 401 Unauthorized
      if (error.response.status === 401) {
        // Có thể thêm logic đăng xuất hoặc refresh token ở đây
      }
    } else if (error.request) {
      // Không nhận được response
      console.error("Request error:", error.request);
    } else {
      // Lỗi trong quá trình thiết lập request
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Định nghĩa các kiểu trả về của hàm api.get(), api.post(), ...
interface ApiRequestMethods {
  get<T = any>(url: string, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
}

// Cast api instance để TypeScript hiểu được kiểu trả về
const typedApi = api as ApiRequestMethods;

export default typedApi;
