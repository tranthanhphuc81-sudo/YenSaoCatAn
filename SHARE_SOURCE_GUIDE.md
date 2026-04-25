# Hướng dẫn chia sẻ source code cho công ty khác

## 1. Mục đích
File này hướng dẫn bạn cách chuẩn bị repo để chia sẻ source code với công ty khác, đồng thời giữ an toàn cho thông tin nhạy cảm và cấu hình riêng.

## 2. Những gì cần xác định trước khi chia sẻ
- Công ty nhận code có dùng dự án Firebase hiện tại của bạn hay không?
- Nếu dùng Firebase hiện tại thì họ sẽ có quyền truy cập vào dữ liệu / auth của bạn.
- Tốt nhất là họ nên tạo một dự án Firebase mới và dùng config riêng.

## 3. Những file cần giữ riêng / không chia sẻ
- `service-account.json`
- `.env`
- Các file chứa khóa bí mật, credential, token

Repo này đã có `.gitignore` bao gồm:
- `node_modules/`
- `service-account.json`
- `*.log`
- `.env`
- `.DS_Store`

Nếu bạn đã lỡ commit `service-account.json` hoặc file nhạy cảm khác, cần xoá file đó khỏi git history và/hoặc tạo lại credential mới.

## 4. Đổi tên dự án và cấu hình Firebase
### 4.1. Tạo dự án Firebase mới cho công ty khác
- Trong Firebase Console, tạo project mới.
- Kích hoạt Firestore, Authentication, Storage nếu cần.
- Thiết lập Firestore rules phù hợp như trong `firestore.rules`.

### 4.2. Cập nhật `firebaseConfig`
Tìm trong các file static có cấu hình Firebase và đổi sang config mới của dự án:
- `admin.html`
- `inventory.html`
- `index.html`

`firebaseConfig` trong mỗi file sẽ có các trường:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

### 4.3. Cập nhật Firestore rule / project id
- `firebase.json` hiện trỏ tới `projectId` trong `.firebaserc`.
- Nếu deploy từ repo của công ty khác, họ nên thay `.firebaserc` thành project của họ.

## 5. Xử lý bảo mật khi chia sẻ
### 5.1. Không chia sẻ khóa admin/service account
- `service-account.json` chỉ dùng trên máy của bạn để chạy script `set-admin-claim.js` hoặc xóa dữ liệu.
- Không commit file này vào repo.

### 5.2. Firebase client config có thể công khai
- `firebaseConfig` trong HTML là thông tin client-side, có thể công khai.
- Tuy nhiên, an toàn phụ thuộc vào `firestore.rules` và `auth` chứ không phải apiKey.

### 5.3. Giữ các quyền admin đúng cách
- `admin.html` và `inventory.html` kiểm tra claim `admin:true`.
- Đảm bảo bạn không dùng `service-account.json` hay credential admin trong mã client.
- Chỉ dùng Firebase Admin SDK trong các script server-side hoặc trên máy local của người quản trị.

### 5.4. Bảo vệ Firestore bằng rule
- `firestore.rules` cần chắc chắn rằng chỉ admin mới sửa/xóa dữ liệu nhạy cảm.
- Với dự án mới, hãy kiểm tra kỹ rule trước khi share.

## 6. Đổi tên source code / cài đặt mới
### 6.1. Đổi tên project
- Nếu bạn muốn đổi tên repo, có thể đổi tên repo trên GitHub hoặc tạo repo mới.
- Cập nhật tên hiển thị trong README nếu cần.

### 6.2. Đổi tên ứng dụng trong code
- Tìm và đổi các label, tên trang, tiêu đề, logo, text hiển thị nếu bạn muốn công ty mới thấy giao diện phù hợp.
- Nếu cần, đổi tên các file như `admin.html`, `inventory.html`, `index.html` thành tên khác nhưng nhớ cập nhật đường dẫn nếu có liên kết nội bộ.

## 7. Quy trình chia sẻ gợi ý
1. Tạo một branch hoặc repo mới để chuẩn bị bản share.
2. Loại bỏ mọi file nhạy cảm (`service-account.json`, `.env`, logs, backups).
3. Cập nhật `firebaseConfig` hoặc để trống và thay thế bằng hướng dẫn cho người nhận.
4. Kiểm tra `firestore.rules` và `firebase.json`.
5. Chạy `git status` để đảm bảo không còn file nhạy cảm trong commit.
6. Push lên git mới hoặc nén source code thành zip.

## 7. Checklist trước khi share
- [ ] Đã loại bỏ `service-account.json` khỏi repo chưa?
- [ ] Đã tạo `.env.example` và không commit `.env` chưa?
- [ ] Đã kiểm tra `.gitignore` để bỏ qua file nhạy cảm chưa?
- [ ] Đã cập nhật `firebaseConfig` hoặc thêm hướng dẫn để người nhận thay thế chưa?
- [ ] Đã kiểm tra `firestore.rules` và `firebase.json` chưa?
- [ ] Đã kiểm tra nhãn, tên app và tất cả text hiển thị chưa?
- [ ] Đã tạo file hướng dẫn riêng cho người nhận (`README_SHARE.md`) chưa?
- [ ] Repo có chứa chỉ code cần share, không có dữ liệu test/backup nhạy cảm chưa?

## 8. Ví dụ `.gitignore` khi share repo
Khi chia sẻ repo, bạn nên dùng một `.gitignore` giống như `.gitignore.share.example`:
- `node_modules/`
- `service-account.json`
- `.env`
- `*.log`
- `.DS_Store`
- `.firebase/`

Nó giúp đảm bảo bạn không gửi file môi trường local, key hoặc cache.

## 9. Hướng dẫn nhanh: tạo project Firebase mới
1. Đăng nhập vào https://console.firebase.google.com.
2. Chọn "Add project".
3. Nhập tên project, bật Analytics nếu cần hoặc tắt để đơn giản.
4. Sau khi tạo xong, vào Dashboard và bật:
   - Firestore Database
   - Authentication → Sign-in method (Email/Password)
   - Storage (nếu dùng)
5. Trong phần Project settings → Your apps, tạo Web app mới.
6. Copy `firebaseConfig` từ phần cài đặt web app.
7. Dán cấu hình này vào `admin.html`, `inventory.html`, `index.html`.
8. Cập nhật `.firebaserc` với `projectId` mới của bạn.

## 10. Ví dụ cấu hình khi chia sẻ
Trong mã static, bạn có thể để comment như:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

Và ghi chú rằng người nhận phải thay bằng config của dự án riêng.

## 9. .env.example và hướng dẫn môi trường local
- File `.env.example` đã được thêm vào repo để người nhận biết các biến môi trường cần thiết.
- Người nhận nên sao chép `.env.example` thành `.env` và điền giá trị thực tế.
- Không bao giờ commit `.env` hoặc `service-account.json` vào git.

### 9.1. Dùng `GOOGLE_APPLICATION_CREDENTIALS`
Repo hiện có các script server-side như:
- `set-admin-claim.js`
- `delete-firestore-collections.js`

Các script này sử dụng biến môi trường:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```
Bạn nên lưu `service-account.json` ngoài git và chỉ dùng trên máy local của người quản trị.

### 9.2. Mình đã tạo các file hữu ích
- `.env.example` chứa các biến môi trường mẫu.
- `SHARE_SOURCE_GUIDE.md` chứa hướng dẫn chi tiết cho người nhận source code.

## 10. Hướng dẫn deploy chi tiết cho bên nhận source code
1. Clone repo hoặc giải nén source code.
2. Cài đặt Node nếu cần:
   ```bash
   npm install
   ```
3. Tạo dự án Firebase mới cho công ty nhận và cấu hình:
   - Firestore
   - Authentication
   - Storage (nếu dùng)
4. Cập nhật cấu hình Firebase trong file HTML:
   - `admin.html`
   - `inventory.html`
   - `index.html`

   Thay phần `firebaseConfig` bằng config mới của dự án.
5. Cập nhật `.firebaserc` nếu muốn dùng cấu hình Firebase CLI riêng:
   ```json
   {
     "projects": {
       "default": "your-new-project-id"
     }
   }
   ```
6. Nếu người nhận cần chạy các script admin local, họ phải đặt `service-account.json` và `.env` trên máy của mình.
   - Copy `.env.example` thành `.env`
   - Điền `GOOGLE_APPLICATION_CREDENTIALS` phù hợp
7. Deploy Firestore rules từ repo:
   ```bash
   firebase login
   firebase deploy --only firestore:rules --project your-new-project-id
   ```
8. Nếu cần deploy Hosting hoặc các dịch vụ khác, có thể thêm cấu hình `firebase.json` và chạy:
   ```bash
   firebase deploy --only hosting --project your-new-project-id
   ```
9. Kiểm tra lại `firestore.rules` để bảo đảm:
   - chỉ admin được phép sửa/xóa dữ liệu nhạy cảm
   - người dùng không admin chỉ đọc được dữ liệu công khai

## 11. Lời khuyên cuối
- Tốt nhất là để công ty khác dùng một Firebase project riêng.
- Giữ các secret server-side riêng và không commit chúng.
- Dùng Firestore rules để bảo vệ dữ liệu, không dựa vào client-side để kiểm soát quyền.
- Kiểm tra kỹ khi chuyển repo cho người khác: hãy xóa tất cả file chứa thông tin nhạy cảm và token.
- Nếu cần, tặng kèm `README_SHARE.md` cho bên nhận để họ nhanh chóng chạy được ứng dụng.

---

File `.env.example` đã được thêm vào repo để hỗ trợ chia sẻ an toàn và giúp bên nhận biết các biến môi trường cần cấu hình.

Ngoài ra còn có file `.gitignore.share.example` làm mẫu `.gitignore` khi chia sẻ repo.