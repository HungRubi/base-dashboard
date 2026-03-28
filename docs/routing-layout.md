# Routing Layout Guide

## Mục tiêu

Thiết lập layout dashboard theo phong cách Medusa Admin với cấu trúc rõ ràng và dễ mở rộng:
- sidebar trái 250px;
- content phải 1fr;
- header trên content cao 70px.

## Thành phần chính

- `src/routes/routeMap.tsx`:
  - nơi khai báo danh sách route;
  - chứa label, path, icon, element để tái sử dụng cho router và navigation.
- `src/page/Public.tsx`:
  - layout dùng `Outlet`;
  - render sidebar + header;
  - render nội dung route con ở khu vực `main`.
- `src/App.tsx`:
  - sinh danh sách `<Route />` từ `routeMap`;
  - có route mặc định (`index`) và route fallback (`*`).

## Nguyên tắc mở rộng

1. Thêm route mới vào `routeMap` trước.
2. Chọn icon từ `@medusajs/icons` phù hợp ngữ nghĩa.
3. Nếu page phức tạp, tách riêng component trong `src/page` hoặc `src/features`.
4. Giữ navigation ngắn gọn, ưu tiên nhóm chức năng quản trị.
