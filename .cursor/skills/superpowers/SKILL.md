---
name: superpowers
description: Tăng tốc workflow phát triển React + Vite + TypeScript trong dự án này. Dùng khi người dùng yêu cầu setup, sửa lỗi build/dev, tổ chức docs, chuẩn hóa cấu trúc component, hoặc cần hướng dẫn thao tác nhanh trong dashboard app.
---

# Superpowers

## Mục tiêu

Skill này giúp agent xử lý nhanh các tác vụ thường gặp trong app dashboard:
- setup local dev;
- xử lý lỗi môi trường (Yarn, Vite, Windows path, plugin issues);
- tạo docs nhất quán;
- chuẩn hóa component patterns.

## Quy trình mặc định

1. Xác nhận mục tiêu người dùng và phạm vi thay đổi.
2. Đọc các file cấu hình liên quan trước khi sửa (`package.json`, `vite.config.ts`, `tsconfig*.json`, eslint/prettier config).
3. Ưu tiên thay đổi nhỏ, an toàn, dễ rollback.
4. Sau khi sửa, chạy kiểm tra tối thiểu:
   - `yarn install` nếu có thay đổi dependency;
   - `yarn dev` hoặc `yarn build` nếu có thay đổi build/runtime;
   - `yarn lint` nếu có thay đổi code chính.
5. Trả kết quả ngắn gọn: đã đổi gì, vì sao, cách verify.
6. Khi viết code mới, thêm comment ngắn cho các khối logic quan trọng để giải thích chức năng khối lệnh.

## Quy ước comment code

- Comment theo mục đích khối lệnh, không mô tả điều hiển nhiên.
- Chỉ thêm comment ở đoạn có nghiệp vụ, điều kiện rẽ nhánh phức tạp, hoặc xử lý side effect.
- Comment ngắn 1-2 câu, ưu tiên giải thích "vì sao" thay vì "đang làm gì".

## Chuẩn docs

Khi user yêu cầu tài liệu:
- Tạo hoặc cập nhật `README.md` cho onboarding và lệnh chạy app.
- Dùng `AGENT.md` để mô tả quy ước làm việc cho agent trong repo.
- Giữ nội dung ngắn, thực dụng, ưu tiên checklist.

## Mẫu phản hồi

- Vấn đề: mô tả 1-2 câu.
- Nguyên nhân: nêu điểm chính.
- Cách xử lý: liệt kê theo bước.
- Kiểm tra lại: lệnh cần chạy.

## Khi nào nên hỏi lại user

Chỉ hỏi khi thiếu thông tin quan trọng:
- môi trường mục tiêu (dev/prod);
- muốn sửa nhanh hay sửa triệt để;
- phạm vi file được phép thay đổi.
