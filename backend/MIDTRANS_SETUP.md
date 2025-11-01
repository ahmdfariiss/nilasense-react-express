# 🏦 Setup Midtrans Payment Gateway

Panduan ini menjelaskan cara mengintegrasikan Midtrans payment gateway ke dalam aplikasi NilaSense.

## 📋 Prerequisites

1. Akun Midtrans (daftar di https://dashboard.midtrans.com)
2. Server key dan Client key dari dashboard Midtrans
3. Aplikasi sudah memiliki sistem order dan cart

## 🔧 Konfigurasi Environment Variables

Tambahkan variabel berikut ke file `.env` di folder `backend`:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key_here
MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_IS_PRODUCTION=false
```

### Mendapatkan Server Key dan Client Key

1. Login ke https://dashboard.midtrans.com
2. Pilih **Settings** > **Access Keys**
3. Copy **Server Key** dan **Client Key**
   - Untuk development/testing: gunakan **Sandbox** keys
   - Untuk production: gunakan **Production** keys

### Environment Variables

- `MIDTRANS_SERVER_KEY`: Server key dari Midtrans (untuk backend)
- `MIDTRANS_CLIENT_KEY`: Client key dari Midtrans (untuk frontend)
- `MIDTRANS_IS_PRODUCTION`: Set `true` untuk production, `false` untuk sandbox

## 🔨 Setup Database

Jalankan migration untuk menambahkan field yang diperlukan:

```bash
# Jalankan migration untuk menambahkan field transaction_id dan payment_gateway
psql -U postgres -d nilasense_db -f database/migrations/007_add_midtrans_fields.sql
```

Atau gunakan pgAdmin dan jalankan query dari file `007_add_midtrans_fields.sql`.

## 🚀 Setup Frontend

Update file `frontend/index.html` untuk menambahkan Midtrans Snap.js script dan ganti `YOUR_CLIENT_KEY` dengan Client Key yang sebenarnya.

**Untuk Sandbox:**

```html
<script
  type="text/javascript"
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="YOUR_CLIENT_KEY"
></script>
```

**Untuk Production:**

```html
<script
  type="text/javascript"
  src="https://app.midtrans.com/snap/snap.js"
  data-client-key="YOUR_CLIENT_KEY"
></script>
```

## 🔄 Alur Pembayaran

1. User memilih produk dan menambahkannya ke cart
2. User checkout dan mengisi informasi pengiriman
3. User memilih metode pembayaran "Midtrans"
4. Sistem membuat order dengan status "pending"
5. Sistem memanggil API `/api/payments/create` untuk membuat payment token
6. Frontend mengarahkan user ke halaman pembayaran Midtrans
7. User menyelesaikan pembayaran di Midtrans
8. Midtrans mengirim webhook ke `/api/payments/webhook` untuk update status
9. Sistem update order status berdasarkan hasil pembayaran

## 📡 API Endpoints

### 1. Create Payment Token

```
POST /api/payments/create
Authorization: Bearer <token>
Body: { "order_id": 123 }
```

### 2. Webhook Handler (dipanggil oleh Midtrans)

```
POST /api/payments/webhook
Body: <Midtrans notification payload>
```

### 3. Check Payment Status

```
GET /api/payments/status/:orderId
Authorization: Bearer <token>
```

## 🔗 Konfigurasi Webhook di Midtrans Dashboard

1. Login ke Midtrans Dashboard
2. Pilih **Settings** > **Configuration**
3. Isi **Payment Notification URL** dengan:
   ```
   https://your-domain.com/api/payments/webhook
   ```
4. Save configuration

**Untuk testing local**, gunakan ngrok atau layanan tunnel lainnya:

```bash
ngrok http 5001
```

## 🧪 Testing

### Test dengan Kartu Kredit Sandbox

- Card Number: `4811 1111 1111 1114`
- CVV: `123`
- Expiry: Bulan/tahun apapun di masa depan
- 3D Secure: Gunakan OTP `112233`

## ⚠️ Important Notes

1. Jangan commit `.env` file ke repository
2. Pastikan webhook URL dapat diakses dari internet
3. Test thoroughly sebelum deploy ke production
4. Monitor logs untuk troubleshooting

## 📚 Referensi

- [Midtrans Documentation](https://docs.midtrans.com/)
- [Midtrans Snap Integration](https://docs.midtrans.com/docs/snap-integration-guide)
