# AGENT Guide

Tài liệu này định nghĩa cách AI agent nên làm việc trong repository `base-dashboard`.

## Mục tiêu

- Giữ thay đổi nhỏ, dễ review, dễ rollback.
- Ưu tiên fix gốc nguyên nhân thay vì workaround tạm thời.
- Luôn bảo toàn trải nghiệm dev trên Windows.

## Quy ước làm việc

- Đọc cấu hình trước khi chỉnh code: `package.json`, `vite.config.ts`, `tsconfig*.json`.
- Không đổi phạm vi ngoài yêu cầu của user.
- Không tự ý cập nhật dependency lớn nếu chưa có yêu cầu rõ.
- Sau sửa đổi đáng kể, chạy kiểm tra tối thiểu (`yarn lint`, `yarn build` hoặc `yarn dev`).

## Quy ước code

- Dùng TypeScript rõ kiểu cho props, state, dữ liệu bảng.
- Component cần tách logic hiển thị và logic dữ liệu khi bắt đầu phình to.
- Nếu component dùng chung cho nhiều page/toàn project thì đặt trong `src/components`.
- Nếu component chỉ dùng cho một page thì tạo folder con ngay trong page đó để cô lập phạm vi.
- Tránh magic string; ưu tiên constant hoặc enum nội bộ module.
- Giữ tên file, component, và export nhất quán.
- Comment ngắn để mô tả chức năng của khối lệnh quan trọng hoặc khó đọc.
- Không comment hiển nhiên; chỉ comment khi giúp người đọc hiểu "vì sao" hoặc luồng xử lý.
- Ưu tiên comment theo khối trước đoạn logic (thay vì comment từng dòng).

## Quy ước UI/UX (Medusa Admin)

- Bám ngôn ngữ thiết kế Medusa Admin đã public: bố cục rõ ràng, spacing thoáng, màu trung tính.
- Sidebar trái cố định, vùng content tách biệt, header gọn và ưu tiên ngữ cảnh trang.
- Trạng thái active/hover của navigation cần rõ ràng, tối ưu khả năng quét nhanh.
- Ưu tiên component đơn giản, tái sử dụng, tránh hiệu ứng dư thừa làm nhiễu thao tác quản trị.
- Với mọi màn hình UI mới, bắt buộc làm đủ 3 chế độ theme: `dark`, `light`, `system`.
- Mọi màu sắc phải dùng token/class của Medusa UI để chuyển theme nhất quán.

## Quy ước routing

- Khai báo route tập trung tại `src/routes/routeMap.tsx`.
- `Public` layout dùng `Outlet` để chia sẻ sidebar + header cho toàn bộ route con.
- Route mặc định và fallback điều hướng về route đầu tiên trong `routeMap`.

## Quy ước docs

- `README.md`: onboarding, scripts, cấu trúc thư mục, quy trình đóng góp.
- Khi thêm module mới, cập nhật tối thiểu mục "Cấu trúc" và "Phát triển".

## Lưu ý môi trường

- Dự án dùng Yarn 4.
- Trên Windows, ưu tiên `nodeLinker: node-modules` để tránh lỗi Rolldown + PnP path parsing.
