# README_SHARE

## Mục đích
File này dành cho người nhận source code. Nó giải thích cách cấu hình và chạy ứng dụng trên dự án Firebase riêng.

## 1. Chuẩn bị
1. Clone repo hoặc giải nén source code.
2. Chạy `npm install` nếu bạn muốn sử dụng script local cho Firebase Admin.
3. Tạo file `.env` từ `.env.example` nếu cần sử dụng script trên máy local.

```bash
cp .env.example .env
```

## 2. Thiết lập Firebase mới
1. Vào Firebase Console, tạo project mới.
2. Kích hoạt:
   - Firestore
   - Authentication
   - Storage (nếu cần)
3. Lấy cấu hình web app từ Firebase Console và thay vào các file:
   - `admin.html`
   - `inventory.html`
   - `index.html`

## 3. Cập nhật dự án Firebase CLI
Nếu bạn dùng Firebase CLI, sửa `.firebaserc` thành project mới của bạn:

```json
{
  "projects": {
    "default": "your-new-project-id"
  }
}
```

## 4. Deploy Firestore rules
Dùng Firebase CLI để deploy chỉ rules:

```bash
firebase login
firebase deploy --only firestore:rules --project your-new-project-id
```

## 5. Quyền admin và bảo mật
- Đừng commit `service-account.json` hoặc `.env`.
- Chỉ dùng `service-account.json` vào các script admin chạy local.
- Các file HTML client vẫn cần `firebaseConfig`, nhưng chỉ dùng cho Web SDK.

## 6. Chạy ứng dụng
- Mở `index.html`, `admin.html`, `inventory.html` trong trình duyệt.
- `admin.html` yêu cầu đăng nhập bằng email/password admin.

## 7. Ghi chú
- Nếu bạn cần cấu hình nâng cao, hãy tạo Firebase project riêng và update tất cả thông tin cấu hình.
- Luôn kiểm tra `firestore.rules` sau khi deploy.
