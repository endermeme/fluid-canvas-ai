# Vulnerability Exploitation Scripts

Scripts để phát hiện và khai thác lỗ hổng bảo mật trên hệ thống.

## Nội dung

1. `pentest_script.py` - Script Python để quét lỗ hổng
2. `exploit_vulnerabilities.sh` - Script Bash để thử khai thác các lỗ hổng đã phát hiện

## Cách sử dụng

### Bước 1: Quét lỗ hổng với pentest_script.py

```bash
python pentest_script.py <target> -o scan_results.json
```

Cài đặt các gói phụ thuộc trước khi chạy:
```bash
pip install -r requirements.txt
```

### Bước 2: Khai thác lỗ hổng với exploit_vulnerabilities.sh

```bash
chmod +x exploit_vulnerabilities.sh
./exploit_vulnerabilities.sh <target> exploit_results.json
```

### Yêu cầu

- Python 3.6+
- Các công cụ Linux/Unix: curl, grep, sed
- Tùy chọn (để có kết quả tốt hơn): mysql-client, openssl, nc/ncat

## Lỗ hổng được kiểm tra

1. **Setup Directory Exposure** (Port 80, 443)
   - Truy cập vào thư mục /setup/ và tìm thông tin nhạy cảm

2. **MailEnable POP3 Vulnerabilities** (Port 110, 995)
   - Dò tìm tài khoản hợp lệ
   - Kiểm tra xác thực yếu

3. **CSRF Vulnerability** (Port 8443)
   - Tạo PoC form HTML để thử nghiệm tấn công CSRF
   - Phân tích main.js để tìm targets

4. **MariaDB Exploitation** (Port 3306)
   - Thử mật khẩu mặc định/yếu
   - Lấy thông tin banner
   - Kiểm tra cơ chế kiểm soát truy cập

## Lưu ý bảo mật

⚠️ **CẢNH BÁO**: Chỉ sử dụng các scripts này trên hệ thống mà bạn có quyền kiểm thử. Việc thực hiện quét/khai thác trái phép có thể vi phạm luật bảo mật máy tính.

## Kết quả

Kết quả khai thác sẽ được lưu vào file JSON với cấu trúc:

```json
{
  "target": "example.com",
  "scan_date": "2025-04-13 10:00:00",
  "exploitation_results": [
    {
      "vulnerability": "Setup Directory Exposure",
      "port": 80,
      "success": true,
      "details": "Setup directory contains sensitive files...",
      "exploit_commands": "curl -k http://example.com/setup/ -o setup_port80.html"
    },
    ...
  ]
}
```
