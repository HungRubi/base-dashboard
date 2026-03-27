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
- Tránh magic string; ưu tiên constant hoặc enum nội bộ module.
- Giữ tên file, component, và export nhất quán.
- Comment ngắn để mô tả chức năng của khối lệnh quan trọng hoặc khó đọc.
- Không comment hiển nhiên; chỉ comment khi giúp người đọc hiểu "vì sao" hoặc luồng xử lý.
- Ưu tiên comment theo khối trước đoạn logic (thay vì comment từng dòng).

## Quy ước docs

- `README.md`: onboarding, scripts, cấu trúc thư mục, quy trình đóng góp.
- Khi thêm module mới, cập nhật tối thiểu mục "Cấu trúc" và "Phát triển".

## Lưu ý môi trường

- Dự án dùng Yarn 4.
- Trên Windows, ưu tiên `nodeLinker: node-modules` để tránh lỗi Rolldown + PnP path parsing.
