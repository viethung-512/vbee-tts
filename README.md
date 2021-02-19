# Vbee TTS

Công cụ hô trợ quản lý tiến trình tạo ra mô hình tổng hợp tiếng nói

## Cài đặt

Phần này sử dụng các biến môi trường trong file `.env`, nếu dùng trong production thì cần ignore file này trong commit.

```bash
git clone https://github.com/viethung-512/vbee-tts.git vbee-tts
cd vbee-tts
docker-compose up -d
```

## Sử dụng

Do hệ thống sử dụng nhiều dịch vụ, mỗi dịch vụ em đã đóng gói trong dockerfile nên có thể build bằng tay hoặc sử dụng docker-compose.

Ngoài ra trong từng service có các biến môi trường tuỳ thuộc vào nơi deploy:

```bash
MONGO_HOST
MONGO_PORT
REDIS_HOST
REDIS_PORT

HOST_URL
STATIC_HOST
STATIC_URL
NATS_URL
```

Những biến môi trường config các giá trị mặc định

```bash
MONGO_DATABASE=dev_tts_auth

JWT_SECRET=my-secret
ROOT_USER_USERNAME=admin
ROOT_USER_EMAIL=admin@test.com
ROOT_USER_PHONE_NUMBER=0987654321
ROOT_USER_PASSWORD=admin123
```

Em cũng đã không sử dụng `k8s` nữa nên không cần chú ý thư mục `infra` làm gì.

## License

[MIT](https://choosealicense.com/licenses/mit/)
