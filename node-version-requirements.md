
# Yêu cầu phiên bản Node.js cho dự án

## Vấn đề phiên bản Node.js

Dự án này sử dụng Vite làm công cụ xây dựng, yêu cầu Node.js phiên bản mới hơn để hoạt động chính xác.

### Chi tiết lỗi

Khi cố gắng chạy dự án với Node.js v10.19.0, bạn sẽ gặp lỗi:

```
SyntaxError: Unexpected token {
    at Module._compile (internal/modules/cjs/loader.js:723:23)
```

Đây là do phiên bản Node.js cũ không hỗ trợ cú pháp ES modules (import/export) được sử dụng bởi Vite.

## Yêu cầu hệ thống

| Công nghệ | Phiên bản tối thiểu |
|-----------|---------------------|
| Node.js   | 14.18+ hoặc 16+     |
| npm       | 6.14.4+             |

## Hướng dẫn nâng cấp Node.js

### Sử dụng NVM (Node Version Manager) - Khuyến nghị

```bash
# Cài đặt NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Cài đặt Node.js phiên bản LTS mới nhất
nvm install --lts

# Hoặc cài đặt phiên bản cụ thể
nvm install 18

# Sử dụng phiên bản đã cài đặt
nvm use 18

# Kiểm tra phiên bản Node
node -v
```

### Cài đặt Node.js trực tiếp (Ubuntu/Debian)

```bash
# Thêm repository NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Cài đặt Node.js và npm
sudo apt-get install -y nodejs

# Kiểm tra phiên bản
node -v
npm -v
```

### Cài đặt Node.js trực tiếp (Windows/macOS)

Tải và cài đặt từ trang chính thức: https://nodejs.org/en/download/

## Sau khi nâng cấp

Sau khi cài đặt Node.js phiên bản mới:

1. Xóa thư mục `node_modules` (nếu có)
2. Xóa file `package-lock.json` (nếu có)
3. Cài đặt lại các dependencies: `npm install`
4. Chạy lại dự án: `npm run dev`

## Lưu ý

Việc sử dụng NVM được khuyến nghị vì cho phép dễ dàng chuyển đổi giữa các phiên bản Node.js khác nhau mà không ảnh hưởng đến cài đặt hệ thống.
