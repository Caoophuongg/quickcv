import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 shadow-lg rounded-xl bg-blue-50 mb-10 mt-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-prim">
        Điều khoản dịch vụ
      </h1>
      <p className="text-base text-gray-700 mb-6">
        Chào mừng bạn đến với Quick CV! Các Điều khoản dịch vụ này (“Điều khoản”) điều chỉnh việc bạn sử dụng trang web và dịch vụ của chúng tôi. Bằng cách truy cập hoặc sử dụng trang web và dịch vụ, bạn đồng ý bị ràng buộc bởi các Điều khoản này.
      </p>

      <ol className="list-decimal pl-5 space-y-6 text-gray-800">
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Định nghĩa</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li><b>Dịch vụ:</b> Nền tảng web Quick CV và các dịch vụ liên quan.</li>
            <li><b>Người dùng:</b> Bất kỳ cá nhân nào truy cập hoặc sử dụng Dịch vụ.</li>
            <li><b>Nội dung:</b> Bất kỳ thông tin, dữ liệu, văn bản hoặc tài liệu khác nào được tải lên, tạo ra hoặc truyền đi theo cách khác thông qua Dịch vụ.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Đăng ký tài khoản</h2>
          <p>
            Để sử dụng một số tính năng nhất định của Dịch vụ, bạn có thể cần đăng ký một tài khoản. Bạn đồng ý cung cấp thông tin chính xác và đầy đủ trong quá trình đăng ký và giữ thông tin đăng nhập tài khoản của bạn an toàn.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Hành vi của người dùng</h2>
          <p>
            Bạn đồng ý không sử dụng Dịch vụ cho bất kỳ mục đích bất hợp pháp nào hoặc theo bất kỳ cách nào có thể gây hại, vô hiệu hóa hoặc làm suy yếu Dịch vụ. Bạn hoàn toàn chịu trách nhiệm về mọi Nội dung mà bạn tải lên hoặc tạo ra thông qua Dịch vụ.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Tính năng dịch vụ</h2>
          <p>
            Quick CV cung cấp các công cụ tạo CV tối ưu, hỗ trợ chuyên nghiệp và tích hợp AI. Tất cả các tính năng đều khả dụng cho tất cả người dùng nhưng có thể không khả dụng ở một số khu vực.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Quyền riêng tư</h2>
          <p>
            Chúng tôi thu thập và xử lý thông tin cá nhân theo Chính sách quyền riêng tư của chúng tôi. Bằng cách sử dụng Dịch vụ, bạn đồng ý với việc chúng tôi thu thập và xử lý thông tin cá nhân của bạn như đã mô tả.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Sở hữu trí tuệ</h2>
          <p>
            Dịch vụ và nội dung, tính năng và chức năng của nó thuộc sở hữu của Quick CV hoặc các bên cấp phép. Bạn không được sao chép, sửa đổi, phân phối hoặc tạo ra các sản phẩm phái sinh từ Dịch vụ nếu không có sự cho phép bằng văn bản.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Tuyên bố từ chối bảo hành</h2>
          <p>
            Dịch vụ được cung cấp “nguyên trạng” và “theo sẵn có” không có bất kỳ bảo hành nào, dù rõ ràng hay ngụ ý.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Giới hạn trách nhiệm pháp lý</h2>
          <p>
            Trong mọi trường hợp, Quick CV sẽ không chịu trách nhiệm pháp lý đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt nào.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Thay đổi Điều khoản</h2>
          <p>
            Chúng tôi có quyền sửa đổi các Điều khoản này bất kỳ lúc nào. Việc bạn tiếp tục sử dụng Dịch vụ sau bất kỳ thay đổi nào đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg mb-1 text-prim">Thông tin liên hệ</h2>
          <p>
            Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@quickcv.tk" className="text-prim underline">support@quickcv.tk</a>
          </p>
        </li>
      </ol>

      <p className="text-sm text-gray-500 mt-8 text-right">
        Cập nhật lần cuối: 14 tháng 01 năm 2025
      </p>
    </div>
  );
}
