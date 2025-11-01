# 📚 Penjelasan Integrasi Midtrans Payment Gateway

Dokumen ini menjelaskan perubahan file yang dilakukan dan cara kerja integrasi Midtrans di aplikasi NilaSense.

## 📋 Daftar File yang Diubah/Dibuat

### Backend

1. **`backend/package.json`**

   - **Perubahan**: Menambahkan dependency `midtrans-client`
   - **Alasan**: Library untuk berkomunikasi dengan Midtrans API

2. **`backend/database/migrations/007_add_midtrans_fields.sql`** (BARU)

   - **Perubahan**: Migration untuk menambahkan field ke tabel `orders`
   - **Field baru**:
     - `transaction_id VARCHAR(255)` - Menyimpan ID transaksi dari Midtrans
     - `payment_gateway VARCHAR(50)` - Menyimpan jenis payment gateway yang digunakan
   - **Index**: Ditambahkan index untuk mempercepat query berdasarkan transaction_id dan payment_gateway

3. **`backend/controllers/paymentController.js`** (BARU)

   - **Perubahan**: Controller baru untuk menangani payment Midtrans
   - **Fungsi utama**:
     - `createPayment()` - Membuat payment token/snap URL dari Midtrans
     - `handleWebhook()` - Menerima notifikasi dari Midtrans saat status payment berubah
     - `checkPaymentStatus()` - Mengecek status payment secara manual dari Midtrans API

4. **`backend/controllers/orderController.js`**

   - **Perubahan**: Update fungsi `createOrder()`
   - **Yang diubah**:
     - Menambahkan logic untuk menentukan status order berdasarkan payment method
     - Jika `payment_method === "midtrans"` → status = "pending", payment_status = "unpaid"
     - Menambahkan field `payment_gateway` saat insert order

5. **`backend/routes/paymentRoutes.js`** (BARU)

   - **Perubahan**: Route baru untuk payment endpoints
   - **Endpoints**:
     - `POST /api/payments/create` - Membuat payment token (protected)
     - `POST /api/payments/webhook` - Webhook handler (tidak protected, dipanggil Midtrans)
     - `GET /api/payments/status/:orderId` - Cek status payment (protected)

6. **`backend/server.js`**

   - **Perubahan**: Menambahkan import dan register payment routes
   - **Tambahan**: `app.use("/api/payments", paymentRoutes);`

7. **`backend/MIDTRANS_SETUP.md`** (BARU)
   - **Perubahan**: Dokumentasi setup Midtrans

### Frontend

1. **`frontend/index.html`**

   - **Perubahan**: Menambahkan script tag Midtrans Snap.js
   - **Script**: `<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="YOUR_CLIENT_KEY"></script>`

2. **`frontend/src/services/orderService.js`**

   - **Perubahan**: Menambahkan fungsi baru untuk payment
   - **Fungsi baru**:
     - `createPayment(orderId)` - Membuat payment token
     - `checkPaymentStatus(orderId)` - Mengecek status payment

3. **`frontend/src/pages/buyer/CheckoutPage.jsx`**

   - **Perubahan**: Update alur checkout untuk Midtrans
   - **Yang diubah**:
     - Menambahkan opsi "Midtrans" di dropdown payment method
     - Update `handleSubmit()` untuk handle Midtrans payment flow
     - Setelah order dibuat, jika payment method Midtrans:
       - Panggil API untuk membuat payment token
       - Redirect user ke Midtrans payment page menggunakan `window.snap.pay()`
       - Handle callback dari Midtrans (onSuccess, onPending, onError, onClose)
     - Setelah payment success, otomatis check status payment

4. **`frontend/src/pages/buyer/OrderDetailPage.jsx`**
   - **Perubahan**: Menambahkan auto-refresh status payment
   - **Yang diubah**:
     - Menambahkan `useEffect` untuk polling status payment setiap 5 detik
     - Hanya untuk order dengan `payment_method === "midtrans"` dan `payment_status !== "paid"`
     - Otomatis update UI saat status berubah menjadi "paid"
     - Berhenti polling setelah 5 menit atau status sudah "paid"

## 🔄 Cara Kerja Integrasi Midtrans

### Flow Pembayaran Lengkap

```
1. USER CHECKOUT
   └─> User mengisi form checkout
   └─> User memilih payment method "Midtrans"
   └─> User klik "Buat Pesanan"

2. CREATE ORDER
   └─> Frontend: POST /api/orders
   └─> Backend: Membuat order dengan status "pending", payment_status "unpaid"
   └─> Backend: Set payment_gateway = "midtrans"
   └─> Response: Order ID dikembalikan ke frontend

3. CREATE PAYMENT TOKEN
   └─> Frontend: POST /api/payments/create dengan order_id
   └─> Backend:
       ├─> Ambil detail order dari database
       ├─> Siapkan parameter untuk Midtrans (customer, items, amount)
       ├─> Panggil Midtrans API: snap.createTransaction()
       ├─> Simpan transaction token ke database
       └─> Response: token dan redirect_url

4. REDIRECT TO MIDTRANS
   └─> Frontend: window.snap.pay(token)
   └─> User diarahkan ke halaman payment Midtrans
   └─> User memilih metode pembayaran (kartu kredit, VA, e-wallet, dll)
   └─> User menyelesaikan pembayaran

5. PAYMENT CALLBACK
   └─> Midtrans mengirim callback ke frontend (onSuccess, onPending, onError)
   └─> Frontend: Check payment status via API
   └─> Frontend: Redirect ke order history

6. WEBHOOK NOTIFICATION
   └─> Midtrans mengirim webhook ke: POST /api/payments/webhook
   └─> Backend:
       rainfall ├─> Parse notification dari Midtrans
       ├─> Cari order berdasarkan order_number
       ├─> Update status berdasarkan transaction_status:
       │ √ settlement/capture → payment_status = "paid", status = "paid"
       │ √ pending → payment_status = "unpaid", status = "pending"
       │ √ cancel/deny/expire → payment_status = "unpaid", status = "pending"
       └─> Simpan transaction_id ke database

7. AUTO-REFRESH STATUS (Frontend)
   └─> Di OrderDetailPage, jika order Midtrans dan belum paid
   └─> Polling setiap 5 detik: GET /api/payments/status/:orderId
   └─> Backend: Cek status langsung ke Midtrans API
   └─> Update database jika ada perubahan status
   └─> Frontend: Update UI otomatis
```

### Detail Implementasi

#### 1. Backend - Create Payment Token

```javascript
// paymentController.js - createPayment()
// 1. Validasi order ada dan belum dibayar
// 2. Ambil detail order dan order items
// 3. Siapkan parameter untuk Midtrans:
//    - transaction_details: order_id (order_number), gross_amount
//    - customer_details: nama, email, phone, alamat
//    - item_details: detail produk
//    - enabled_payments: semua metode pembayaran yang diizinkan
// 4. Panggil Midtrans API
// 5. Simpan token ke database sebagai transaction_id
// 6. Return token dan redirect_url ke frontend
```

#### 2. Frontend - Payment Flow

```javascript
// CheckoutPage.jsx
// 1. User submit form checkout
// 2. Buat order via API
// 3. Jika payment_method === "midtrans":
//    a. Panggil createPayment API
//    b. Gunakan window.snap.pay(token) untuk redirect
//    c. Handle callback:
//       - onSuccess: check status, redirect ke order history
//       - onPending: inform user, redirect
//       - onError: show error
//       - onClose: inform cancelled
```

#### 3. Backend - Webhook Handler

```javascript
// paymentController.js - handleWebhook()
// 1. Terima notification JSON dari Midtrans
// 2. Extract: order_id, transaction_status, transaction_id
// 3. Cari order berdasarkan order_number
// 4. Update status berdasarkan transaction_status:
//    - "settlement" atau "capture" → PAID
//    - "pending" → PENDING
//    - "cancel"/"deny"/"expire" → PENDING (unpaid)
// 5. Simpan transaction_id ke database
// 6. Return 200 ke Midtrans (penting!)
```

#### 4. Frontend - Auto Refresh Status

```javascript
// OrderDetailPage.jsx
// 1. useEffect hook yang berjalan jika:
//    - order ada
//    - payment_method === "midtrans"
//    - payment_status !== "paid"
// 2. Set interval untuk polling setiap 5 detik
// 3. Panggil checkPaymentStatus API
// 4. Update UI jika status berubah
// 5. Berhenti polling setelah 5 menit atau status sudah "paid"
```

#### 5. Backend - Check Payment Status

```javascript
// paymentController.js - checkPaymentStatus()
// 1. Ambil order dari database
// 2. Jika payment_gateway === "midtrans":
//    a. Panggil Midtrans API: snap.transaction.status(order_number)
//    b. Dapatkan status terbaru dari Midtrans
//    c. Update database jika status berbeda
//    d. Update transaction_id jika tersedia
// 3. Return status terbaru ke frontend
```

## 🔐 Security & Best Practices

1. **Server Key**: Hanya digunakan di backend, JANGAN expose ke frontend
2. **Client Key**: Bisa digunakan di frontend untuk Snap.js
3. **Webhook**: Mesh Endpoint harus diakses dari internet (gunakan ngrok untuk development)
4. **Status Verification**: Selalu verify status payment via API, jangan hanya mengandalkan callback frontend
5. **Idempotency**: Webhook bisa dipanggil berkali-kali, pastikan handler idempotent

## 📊 Database Schema Changes

**Tabel `orders` - Field baru:**

- `transaction_id VARCHAR(255)` - ID transaksi dari Midtrans
- `payment_gateway VARCHAR(50) DEFAULT 'manual'` - Jenis payment gateway

**Flow Status:**

- Manual Transfer/COD: `status = 'paid'` langsung saat create
- Midtrans: `status = 'pending'` → di-update via webhook/check status → `status = 'paid'`

## 🔗 API Endpoints

1. **POST /api/payments/create**

   - Membuat payment token
   - Body: `{ order_id: number }`
   - Response: `{ token, redirect_url, order_id }`

2. **POST /api/payments/webhook**

   - Webhook dari Midtrans
   - Body: Midtrans notification JSON
   - Response: `{ message: "Webhook processed successfully" }`

3. **GET /api/payments/status/:orderId**
   - Cek status payment
   - Response: `{ order: {...}, midtrans_status: {...} }`

## 🧪 Testing

Untuk testing di Sandbox:

- Kartu Kredit: `4811 1111 1111 1114`, CVV: `123`, OTP: `112233`
- Virtual Account: Gunakan simulator Midtrans
- E-Wallet: Ikuti instruksi di Midtrans dashboard

## ⚠️ Important Notes

1. **Webhook URL**: Harus dikonfigurasi di Midtrans Dashboard
2. **Environment**: Pastikan `MIDTRANS_IS_PRODUCTION=false` untuk sandbox
3. **Order Number**: Digunakan sebagai `order_id` di Midtrans (harus unique)
4. **Status Update**: Bisa terjadi via webhook atau manual check
5. **Polling**: Hanya untuk UX, webhook adalah sumber kebenaran utama


