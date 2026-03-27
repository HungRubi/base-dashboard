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

## Cấu trúc thư mục (khởi đầu)

```text
src/
  components/
public/
```

## Tài liệu cho Agent

- Quy ước làm việc của AI agent nằm ở `AGENT.md`.
- Skill cho dự án nằm ở `.cursor/skills/superpower/SKILL.md`.

## Ghi chú Windows + Yarn

Repo dùng `nodeLinker: node-modules` trong `.yarnrc.yml` để tránh lỗi Rolldown panic với Yarn PnP path trên Windows.

## TODO docs app

- [ ] Mô tả domain và business flow chính.
- [ ] Mô tả kiến trúc state management.
- [ ] Mô tả API contracts và error handling.
- [ ] Mô tả guideline cho component/table/form.
