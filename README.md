# Base Dashboard

Starter cho ứng dụng dashboard dùng React + TypeScript + Vite.

## Yêu cầu môi trường

- Node.js 20+
- Yarn 4+

## Cài đặt

```bash
yarn install
```

## Chạy ứng dụng

```bash
yarn dev
```

Mặc định app chạy tại `http://localhost:5173`.

## Scripts chính

- `yarn dev`: chạy môi trường local.
- `yarn build`: build production.
- `yarn preview`: chạy bản build local.
- `yarn lint`: kiểm tra lint.

## Cấu trúc thư mục

```text
src/
  lib/
  page/
  routes/
  store/
  components/
public/
docs/
```

## Routing và layout

- Routing được khai báo tập trung ở `src/routes/routeMap.tsx`.
- `src/page/Public.tsx` là layout public dùng `Outlet`.
- Bố cục trang chính:
  - sidebar trái: `250px`;
  - vùng phải: `1fr`;
  - header trên vùng phải: `70px`.
- Đã có 10 route mẫu kèm icon từ `@medusajs/icons`.

## Tài liệu cho Agent

- Quy ước làm việc của AI agent nằm ở `AGENT.md`.
- Skill cho dự án nằm ở `.cursor/skills/superpowers/SKILL.md`.

## Ghi chú Windows + Yarn

Repo dùng `nodeLinker: node-modules` trong `.yarnrc.yml` để tránh lỗi Rolldown panic với Yarn PnP path trên Windows.

## Environment

- API base URL đọc từ `VITE_API_BASE_URL`.
- File mẫu env: `.env.example`.
- File local: `.env`, `.env.development`.

## TODO docs app

- [ ] Mô tả domain và business flow chính.
- [ ] Mô tả kiến trúc state management.
- [ ] Mô tả API contracts và error handling.
- [ ] Mô tả guideline cho component/table/form.
