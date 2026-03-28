# Hướng dẫn UI: module quản lý đủ List → Add → Detail → Edit

Tài liệu này chỉ ở mức **UI** (bố cục, component Medusa, pattern layout). Phần API, Redux, validation gắn sau vào `onSubmit` / `useEffect` theo từng module.

## Ánh xạ repo **base-dashboard** (StudyHub-style)

| Trong hướng dẫn gốc | Trong repo này |
|---------------------|----------------|
| `src/util/routeMap.ts` | `src/routes/routeMap.tsx` — khai báo `RouteItem` + `element` cho từng route |
| Menu sidebar | `src/components/navigation/Menu.tsx` — `NAVIGATION_MENU` (mục list trỏ về path list, ví dụ `/categories`) |
| Breadcrumb | `src/hooks/useBreadcrumb.ts` — map từ `pathname` + `NAVIGATION_MENU`; với `detail/:id` thường cần bổ sung segment (tên bản ghi) ở layer page |
| Empty / không có dữ liệu | `src/components/Empty.tsx` — component `NoResults` (và các biến thể khác trong file) |
| Upload ảnh (UI) | `src/components/FileUpLoad.tsx` |
| Ví dụ bảng Medusa | `src/components/DataTable/TableDemo.tsx` — dùng `Table` từ `@medusajs/ui`; có thể tách thành wrapper kiểu `DataTable<T>` + phân trang |
| `ListPageLoading`, `DropdownMenuDemo`, `DocumentTable` | **Chưa có sẵn** — đặt tên và tạo trong `src/components/` theo đúng pattern dưới đây |

Các export Medusa thường dùng: `Container`, `Heading`, `Button`, `Input`, `Label`, `Text`, `Textarea`, `Select`, `StatusBadge`, `FocusModal`, `DropdownMenu`, `Table`, `toast`, `usePrompt` (kiểm tra phiên bản `@medusajs/ui` trong project).

---

## 1. Chuẩn route & tên file (UI navigation)

- **List:** `/ten-module` — ví dụ `/categories`
- **Detail:** `/ten-module/detail/:id`
- **Add:** `/ten-module/add`
- **Edit:** `/ten-module/edit/:id`

Đăng ký trong **`src/routes/routeMap.tsx`** (và `Routes` trong `App.tsx` nếu cần route lồng), cùng thứ tự cha con như các module hiện có.

**Luồng điều hướng UI thường dùng**

- Từ **list:** nút “Thêm…” → `/.../add`; click hàng hoặc “Xem chi tiết” → `/.../detail/:id`; “Chỉnh sửa” → `/.../edit/:id`
- Từ **detail:** menu “Chỉnh sửa” → `/.../edit/:id`
- **Add/Edit** dạng full route: đóng modal → `navigate` về list (pattern **FocusModal** + `isAddPage` / `isEditPage` như CategoryAdd / CategoryEdit trong app StudyHub đầy đủ)

---

## 2. Trang List — khung UI

### Vỏ ngoài

- **Container** Medusa, `className='p-0!'` để viền/padding thống nhất với các trang admin khác.

### Khối tiêu đề (Heading level h2)

- Một dòng: **tên module** (trái) + **nút hành động chính** (phải), ví dụ `Button variant='secondary' size='small'` “Thêm …”
- Class gợi ý: `flex items-center justify-between border-b border-ui-border-base p-5`
- Chữ tiêu đề: `font-medium text-ui-fg-base text-sm`

### Thanh công cụ (Heading thứ hai hoặc cùng khối)

- **Trái:** placeholder “Thêm bộ lọc” / filter (sau này có)
- **Phải:** `Input type='search'` + `DropdownMenu` (icon `BarsArrowDown`) cho sắp xếp — mỗi `DropdownMenu.Item` là một tiêu chí; item đang chọn có bullet `•` và class nổi bật hơn (`text-ui-fg-base` vs `text-ui-fg-subtle`)

### Vùng nội dung bảng

- **Đang load:** `ListPageLoading` (spinner + text)
- **Không có dữ liệu:** `NoResults` với `title` + `message` (trong repo: `src/components/Empty.tsx`)
- **Có dữ liệu:** `DataTable<T>` với:
  - `columns`: header, `render`, `className`, `align`
  - `getRowKey`
  - `pageSize` (phân trang)
  - `size='base'` hoặc `'small'`
  - `onRowClick`: điều hướng sang detail (UX: cả hàng bấm được)
- **Cột trạng thái:** `StatusBadge` (`color`: green/grey/…)
- **Cột thao tác:** bọc `div` `onClick={(e) => e.stopPropagation()}` rồi `DropdownMenuDemo` (Xem / Sửa / Xóa) để không kích hoạt `onRowClick` khi mở menu

### Typography trong bảng

- Nội dung phụ: `text-ui-fg-muted`, `truncate`, `title={...}` khi cần tooltip
- Slug/code: `font-mono text-sm`

---

## 3. Trang Add — khung UI (FocusModal)

### Hai chế độ cùng một component (pattern project)

- **Modal từ list:** có `FocusModal.Trigger` + `Button` “Thêm…”
- **Full page** `/.../add`: **không** render Trigger; `open={true}` cố định; đóng modal = `navigate` về list

### Cấu trúc form trong modal

```
FocusModal → FocusModal.Content → <form className='flex min-h-0 flex-1 flex-col' onSubmit={...}>
```

- **FocusModal.Header** — `shrink-0`
- **FocusModal.Body** — `flex min-h-0 flex-1 flex-col overflow-y-auto py-16` (cuộn nội dung form, header/footer cố định)
- Trong body: các khối field dọc, mỗi field:
  - `div` bọc: `flex flex-col space-y-2`
  - `Label` + `Input` / `Textarea` / `Select` (`Select` dùng `Controller` của react-hook-form để khớp Medusa)
  - `Text size='small' className='text-ui-fg-muted'` cho gợi ý dưới field (định dạng file, giới hạn kích thước, …)
- **Upload ảnh:** `FileUpload` + state riêng (UI tách khỏi field text) — trong repo: `FileUpLoad`
- **FocusModal.Footer** — nút Hủy (đóng modal / navigate) + nút submit `type='submit'` (thường primary)

### Lỗi validation (UI)

- Hiển thị dưới input: `formState.errors` + `Text className='text-ui-fg-error'` (hoặc class token lỗi Medusa tương đương trong project)

---

## 4. Trang Edit — khung UI

- Giống **Add**: cùng `FocusModal`, cùng layout form Header / Body / Footer
- Full route `/.../edit/:id`: đóng = về list; khi mở cần **trạng thái đang tải** trong body (skeleton hoặc dòng “Đang tải…”) trước khi form có dữ liệu — chỉ lớp UI, không bàn API
- Phần file/icon: thường có **preview ảnh cũ** + nút xóa thay icon + `FileUpload` cho file mới (pattern state `iconExistingUrl`, `iconCleared`)

---

## 5. Trang Detail — khung UI

### Layout

- Lưới responsive: `grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6` + `animate-in fade-in duration-200` (hoặc transition tương đương trong project)
- **Cột chính** (`lg:col-span-3`): card thông tin + (tuỳ module) card bảng con phía dưới
- **Cột phụ** (`lg:col-span-1`): ảnh đại diện / icon / thông tin ngắn

### Card thông tin

- Container `className='p-0!'`
- `Heading level='h2'` làm header card: `border-b border-ui-border-base p-4 sm:p-5`
  - Trái: tên entity (`truncate`, `text-sm`)
  - Phải: `StatusBadge` + `DropdownMenuDemo` (mục “Chỉnh sửa” → navigate edit)

### Các dòng field (key – value)

- Class hàng lặp (ví dụ `rowCls`): `flex`, padding, `border-b border-ui-border-base`, hover nhẹ `hover:bg-ui-bg-base-subtle/50`, responsive `sm:flex-row sm:items-center sm:justify-between`
- Nhãn: `text-ui-fg-muted text-sm`
- Giá trị: `Text` với `text-ui-fg-base text-sm`, căn phải desktop `sm:text-right sm:w-1/2`, `min-w-0` để không tràn
- Hàng cuối: `border-b-0`
- Giá trị rỗng hiển thị `—` (helper `displayValue`)

### Loading / empty

- Loading: `Container` + `p-8 text-center text-ui-fg-muted` “Đang tải…”

### Breadcrumb

- Nếu dùng `useBreadcrumb`: set segment “Module” + tên bản ghi — thuần UI, copy pattern từ CategoryDetail (StudyHub); trong base-dashboard có thể mở rộng hook hoặc truyền segment từ page detail

### Bảng con trong detail (nếu có)

- Container riêng, `Heading` giống trên, bên trong `DocumentTable` hoặc `DataTable` nhỏ (`size='small'`, `pageSize` nhỏ), `emptyTitle` / `emptyMessage` rõ ràng

---

## 6. Thành phần dùng lại (UI)

| Mục đích | Gợi ý trong project |
|----------|---------------------|
| Bảng có phân trang | Bọc `Table` Medusa → `DataTable<T>`; tham khảo `src/components/DataTable/TableDemo.tsx` |
| Menu 3 chấm hàng | `DropdownMenu` + icon `@medusajs/icons` (wrapper đặt tên `DropdownMenuDemo` nếu cần) |
| Xác nhận xóa (UI dialog) | `usePrompt()` — tiêu đề / mô tả / nút Xóa danger |
| Thông báo | `toast` từ `@medusajs/ui` |
| Vỏ trang | `Container`, `Heading`, `Button`, `Input`, `Label`, `Text`, `Textarea`, `Select`, `StatusBadge`, `FocusModal` |

---

## 7. Token màu & dark mode (UI)

- Ưu tiên: `text-ui-fg-base`, `text-ui-fg-subtle`, `text-ui-fg-muted`, `border-ui-border-base`, `bg-ui-bg-component`, `hover:bg-ui-bg-base-hover`
- Khi cần khác biệt rõ giữa sáng/tối: thêm `dark:` (shadow/border) theo quy ước theme trong `tailwind.config.cjs` + `src/index.css`

---

## 8. Checklist nhanh “một module UI trọn bộ”

- [ ] **List:** `Container` + 2 khối heading (tiêu đề + toolbar) + bảng / loading / empty + `onRowClick` → detail
- [ ] **Add:** `FocusModal` + form dọc + footer actions; route `/add` không Trigger
- [ ] **Detail:** grid 3+1, card metadata dạng hàng key–value, menu sửa, optional bảng con
- [ ] **Edit:** cùng modal form như Add + loading/chờ data + preview field file nếu có
- [ ] **Menu & route:** đăng ký 4 route; mục sidebar trong `Menu.tsx` trỏ về list

---

Nếu cần checklist ngắn theo **một module cụ thể** (ví dụ “phiếu giảm giá”), nêu tên module và path file page tương ứng để soi đúng từng màn trong repo.
