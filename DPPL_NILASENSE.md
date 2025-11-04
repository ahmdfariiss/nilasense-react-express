# Deskripsi Perancangan Perangkat Lunak (DPPL)

**NilaSense: Web-Based Aquaculture Management untuk Monitoring Air, Pakan, dan Perdagangan Ikan Nila**

---

**Dipersiapkan Oleh:**
Team 7

1. Ahmad Faris Al Aziz - J0404231081
2. [Nama Anggota 2] - [NIM]
3. [Nama Anggota 3] - [NIM]

**Program Studi Teknologi Rekayasa Komputer**  
**Sekolah Vokasi Institut Pertanian Bogor**

---

| Program studi Teknologi Rekayasa Komputer<br>Institut Pertanian Bogor | Nomor Dokumen | Halaman |
| --------------------------------------------------------------------- | ------------- | ------- |
|                                                                       | DPPL          | 1/50    |

---

## Daftar Perubahan

| Revisi | Tanggal | Deskripsi |
| ------ | ------- | --------- |
| A      |         |           |
| B      |         |           |
| C      |         |           |
| D      |         |           |

### INDEX

| TGL            | A   | B   | C   | D   |
| -------------- | --- | --- | --- | --- |
| Ditulis oleh   |     |     |     |     |
| Diperiksa oleh |     |     |     |     |
| Disetujui Oleh |     |     |     |     |

---

## Daftar Isi

1. [PENDAHULUAN](#1-pendahuluan)

   - 1.1 [Tujuan](#11-tujuan)
   - 1.2 [Ruang Lingkup Masalah](#12-ruang-lingkup-masalah)
   - 1.3 [Definisi, Akronim dan Singkatan](#13-definisi-akronim-dan-singkatan)
   - 1.4 [Referensi](#14-referensi)
   - 1.5 [Deskripsi Umum Dokumen](#15-deskripsi-umum-dokumen)

2. [DESKRIPSI PERANCANGAN](#2-deskripsi-perancangan)

   - 2.1 [Perancangan Sistem](#21-perancangan-sistem)
     - 2.1.1 [Perancangan Arsitektur](#211-perancangan-arsitektur)
     - 2.1.2 [Perancangan Rinci](#212-perancangan-rinci)
   - 2.2 [Perancangan Data](#22-perancangan-data)
     - 2.2.1 [Dekomposisi Data](#221-dekomposisi-data)
     - 2.2.2 [Dekomposisi Fungsional](#222-dekomposisi-fungsional)
     - 2.2.3 [Entity Relationship Diagram](#223-entity-relationship-diagram)
   - 2.3 [Perancangan Antarmuka](#23-perancangan-antarmuka)

3. [MATRIKS KETERURUTAN](#3-matrik-keterurutan)

---

## 1. PENDAHULUAN

### 1.1 Tujuan

Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini bertujuan untuk mendefinisikan perancangan perangkat lunak **NilaSense** yang dikembangkan. Dokumen DPPL ini digunakan oleh pengembang perangkat lunak sebagai acuan untuk implementasi pada tahap selanjutnya dan sebagai dokumentasi teknis sistem.

NilaSense adalah aplikasi berbasis web yang dirancang untuk membantu manajemen budidaya ikan nila secara terintegrasi, meliputi monitoring kualitas air menggunakan Machine Learning, manajemen jadwal pakan, dan platform e-commerce untuk perdagangan ikan nila.

### 1.2 Ruang Lingkup Masalah

Perangkat Lunak NilaSense dikembangkan dengan ruang lingkup sebagai berikut:

1. **Manajemen Autentikasi dan Pengguna**

   - Menangani fungsi login dan registrasi pengguna
   - Manajemen role pengguna (Admin, Petambak, Buyer)
   - Sistem otentikasi menggunakan JWT (JSON Web Token)
   - Manajemen sesi pengguna

2. **Manajemen Kolam Ikan**

   - CRUD (Create, Read, Update, Delete) data kolam
   - Assignment kolam ke petambak
   - Tracking informasi kolam (nama, lokasi)

3. **Monitoring Kualitas Air**

   - Input data kualitas air secara manual
   - Integrasi dengan Machine Learning untuk prediksi kualitas air
   - Visualisasi data monitoring (grafik dan dashboard)
   - Alert sistem untuk kondisi air yang tidak optimal
   - Klasifikasi kualitas air: Baik, Normal, Perlu Perhatian
   - Parameter yang dimonitor: pH, Suhu, Oksigen Terlarut, Kekeruhan

4. **Manajemen Jadwal Pakan**

   - CRUD jadwal pemberian pakan
   - Penjadwalan otomatis berdasarkan kolam
   - Tracking status pemberian pakan (pending, completed, cancelled)
   - Manajemen jenis pakan dan jumlah pakan

5. **Manajemen Produk E-Commerce**

   - CRUD produk ikan nila (konsumsi dan bibit)
   - Manajemen stok produk
   - Kategorisasi produk
   - Upload gambar produk

6. **Sistem Pemesanan dan Checkout**

   - Manajemen keranjang belanja (cart)
   - Proses checkout dengan validasi
   - Manajemen pesanan (orders)
   - Tracking status pesanan

7. **Integrasi Payment Gateway**

   - Integrasi dengan Midtrans untuk pembayaran
   - Support multiple payment method
   - Tracking status pembayaran

8. **Dashboard dan Reporting**
   - Dashboard admin untuk overview sistem
   - Dashboard petambak untuk monitoring kolam
   - Statistik dan laporan

### 1.3 Definisi, Akronim dan Singkatan

| Frasa / Akronim | Definisi                                                                                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DPPL**        | Deskripsi Perancangan Perangkat Lunak disebut juga Software Design Description (SDD) merupakan deskripsi dari perancangan perangkat lunak yang akan dikembangkan. Dokumen ini merupakan lanjutan dari SKPL. |
| **SKPL**        | Spesifikasi Kebutuhan Perangkat Lunak (Software Requirements Specification)                                                                                                                                 |
| **JWT**         | JSON Web Token, metode autentikasi berbasis token untuk keamanan API                                                                                                                                        |
| **CRUD**        | Create, Read, Update, Delete - operasi dasar database                                                                                                                                                       |
| **API**         | Application Programming Interface - antarmuka komunikasi antar aplikasi                                                                                                                                     |
| **ML**          | Machine Learning - pembelajaran mesin untuk prediksi dan klasifikasi                                                                                                                                        |
| **RF**          | Random Forest - algoritma machine learning ensemble                                                                                                                                                         |
| **IoT**         | Internet of Things - perangkat sensor yang terhubung internet                                                                                                                                               |
| **DO**          | Dissolved Oxygen - Oksigen Terlarut dalam air                                                                                                                                                               |
| **NTU**         | Nephelometric Turbidity Unit - satuan kekeruhan air                                                                                                                                                         |
| **pH**          | Potensial Hidrogen - tingkat keasaman/basa air                                                                                                                                                              |
| **REST**        | Representational State Transfer - arsitektur web service                                                                                                                                                    |
| **MVC**         | Model-View-Controller - pola arsitektur aplikasi                                                                                                                                                            |

### 1.4 Referensi

**Dokumen Standar:**

1. IEEE Std 1016-2009 - IEEE Recommended Practice for Software Design Descriptions
2. ISO/IEC 25010:2011 - Systems and Software Quality Requirements and Evaluation (SQuaRE)

**Dokumen Proyek:**

1. Spesifikasi Kebutuhan Perangkat Lunak (SKPL) NilaSense
2. Dokumen Analisis Sistem NilaSense

**Referensi Teknis:**

1. React Documentation - https://react.dev/
2. Express.js Documentation - https://expressjs.com/
3. PostgreSQL Documentation - https://www.postgresql.org/docs/
4. Flask Documentation - https://flask.palletsprojects.com/
5. Midtrans Documentation - https://docs.midtrans.com/
6. Radix UI Documentation - https://www.radix-ui.com/
7. Tailwind CSS Documentation - https://tailwindcss.com/

**Referensi Machine Learning:**

1. Scikit-learn Documentation - https://scikit-learn.org/stable/
2. Random Forest Classifier - https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html

### 1.5 Deskripsi Umum Dokumen

Dokumen ini menjelaskan perancangan perangkat lunak NilaSense secara detail, mencakup:

- Arsitektur sistem secara keseluruhan
- Perancangan modul dan komponen
- Perancangan database
- Perancangan antarmuka pengguna
- Integrasi antar komponen sistem

Dokumen ini ditujukan untuk:

- Tim pengembang perangkat lunak
- Tim quality assurance
- Stakeholder proyek
- Dokumentasi proyek

---

## 2. DESKRIPSI PERANCANGAN

### 2.1 Perancangan Sistem

NilaSense adalah sistem berbasis web yang dirancang dengan arsitektur **3-tier architecture** (Presentation Layer, Application Layer, Data Layer) dengan tambahan **Microservice Architecture** untuk komponen Machine Learning. Sistem terdiri dari:

1. **Frontend Layer** - React.js dengan Vite
2. **Backend Layer** - Express.js (Node.js)
3. **Database Layer** - PostgreSQL
4. **ML Service Layer** - Flask (Python)

Sistem ini dirancang untuk mendukung:

- **Scalability** - Arsitektur modular memungkinkan pengembangan komponen secara independen
- **Maintainability** - Pemisahan concern yang jelas antar layer
- **Security** - Autentikasi JWT dan enkripsi password
- **Performance** - Optimasi query database dan caching
- **Real-time Monitoring** - Dashboard dengan update data real-time

#### 2.1.1 Perancangan Arsitektur

Sistem menggunakan arsitektur **Client-Server** dengan **Microservices** untuk ML service:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (Vite + React 18)             │   │
│  │  - Pages: Auth, Dashboard, Monitoring, E-commerce    │   │
│  │  - Components: UI Components (Radix UI)              │   │
│  │  - State Management: Context API                     │   │
│  │  - Styling: Tailwind CSS                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST API
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                  APPLICATION LAYER                           │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │  Express.js Backend  │    │  Flask ML Service    │      │
│  │  (Node.js)           │◄──►│  (Python)            │      │
│  │                      │    │                      │      │
│  │  - REST API          │    │  - Prediction API    │      │
│  │  - Controllers       │    │  - Model Inference   │      │
│  │  - Middleware        │    │  - Data Validation   │      │
│  │  - Services          │    │                      │      │
│  └──────────────────────┘    └──────────────────────┘      │
└─────────────────────┬───────────────────────────────────────┘
                      │ SQL Queries
                      │
┌─────────────────────┴───────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           PostgreSQL Database                        │   │
│  │  - users, ponds, water_quality_logs                  │   │
│  │  - feed_schedules, products, orders                  │   │
│  │  - order_items, cart                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Karakteristik Arsitektur:**

- **Separation of Concerns** - Setiap layer memiliki tanggung jawab yang jelas
- **Loose Coupling** - Komponen dapat dikembangkan dan di-deploy secara independen
- **High Cohesion** - Fungsi-fungsi terkait dikelompokkan dalam modul yang sama

**Komunikasi Antar Layer:**

1. **Frontend ↔ Backend**: RESTful API menggunakan HTTP/HTTPS
2. **Backend ↔ ML Service**: HTTP API untuk prediksi kualitas air
3. **Backend ↔ Database**: SQL queries menggunakan pg (PostgreSQL client)
4. **Backend ↔ Payment Gateway**: HTTPS API ke Midtrans

#### 2.1.2 Perancangan Rinci

##### 2.1.2.1 Hardware Constraint

Batasan perangkat keras yang harus diperhatikan:

1. **Server Requirements:**

   - CPU: Minimum 2 core, Recommended 4 core
   - RAM: Minimum 4GB, Recommended 8GB
   - Storage: Minimum 20GB untuk aplikasi dan database
   - Network: Koneksi internet stabil untuk API external (Midtrans)

2. **Client Requirements:**

   - Browser modern (Chrome, Firefox, Edge, Safari versi terbaru)
   - JavaScript enabled
   - Minimum screen resolution: 1024x768
   - Koneksi internet untuk akses web application

3. **Database Server:**
   - PostgreSQL 12 atau lebih baru
   - Disk space untuk data growth
   - Backup storage untuk data recovery

##### 2.1.2.2 Software Constraint

Batasan perangkat lunak yang harus diperhatikan:

1. **Development Environment:**

   - Node.js 18.x atau lebih baru
   - Python 3.8 atau lebih baru
   - npm atau yarn untuk package management
   - Git untuk version control

2. **Runtime Environment:**

   - Node.js runtime untuk backend
   - Python runtime untuk ML service
   - PostgreSQL database server
   - Web server (Nginx/Apache) untuk production

3. **Dependencies:**

   - React 18.x
   - Express.js 5.x
   - PostgreSQL driver (pg)
   - Flask 2.x untuk ML service
   - scikit-learn untuk machine learning

4. **External Services:**

   - Midtrans API untuk payment gateway
   - JWT untuk token management
   - bcrypt untuk password hashing

5. **Browser Compatibility:**
   - Modern browsers dengan ES6+ support
   - CSS Grid dan Flexbox support
   - Fetch API support

##### 2.1.2.3 Activity Diagram

**Activity Diagram: Login User**

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────────────────┐
│ User Input Email &  │
│ Password            │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Frontend Validasi   │
│ Format Input        │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Kirim Request ke    │
│ Backend API         │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Backend Validasi    │
│ Credentials         │
└────┬────────────────┘
     │
     ▼
     ├─ Valid? ────No───► ┌──────────────┐
     │                    │ Return Error │
     │                    └──────┬───────┘
     │                           │
     │                    ┌──────▼───────┐
     │                    │ Tampilkan    │
     │                    │ Error Message│
     │                    └──────────────┘
     │
    Yes
     │
     ▼
┌─────────────────────┐
│ Generate JWT Token  │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Simpan Token ke     │
│ LocalStorage        │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Redirect ke Dashboard│
│ berdasarkan Role    │
└────┬────────────────┘
     │
     ▼
┌─────────┐
│  End    │
└─────────┘
```

**Activity Diagram: Monitoring Kualitas Air dengan ML**

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────────────────┐
│ Input Data Sensor   │
│ (pH, Temp, DO, Turb)│
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Simpan ke Database  │
│ (water_quality_logs)│
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Kirim Data ke       │
│ ML Service API      │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ ML Service:         │
│ - Load Model        │
│ - Preprocess Data   │
│ - Predict Class     │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Return Prediction:  │
│ Baik/Normal/Perlu   │
│ Perhatian           │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Update Database     │
│ dengan Prediction   │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Tampilkan di        │
│ Dashboard dengan    │
│ Alert jika Perlu    │
│ Perhatian           │
└────┬────────────────┘
     │
     ▼
┌─────────┐
│  End    │
└─────────┘
```

##### 2.1.2.4 Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   AuthContext    │      │   App Component  │            │
│  ├──────────────────┤      ├──────────────────┤            │
│  │ +user            │◄────►│ +currentPage     │            │
│  │ +token           │      │ +handleNavigate()│            │
│  │ +login()         │      │ +renderPage()    │            │
│  │ +logout()        │      └──────────────────┘            │
│  │ +register()      │                                       │
│  └──────────────────┘      ┌──────────────────┐            │
│                             │  Service Layer   │            │
│                             ├──────────────────┤            │
│                             │ +api.get()       │            │
│                             │ +api.post()      │            │
│                             │ +api.put()       │            │
│                             │ +api.delete()    │            │
│                             └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  AuthController  │      │  UserController  │            │
│  ├──────────────────┤      ├──────────────────┤            │
│  │ +login()         │      │ +getUsers()      │            │
│  │ +register()      │      │ +createUser()    │            │
│  │ +me()            │      │ +updateUser()    │            │
│  └──────────────────┘      │ +deleteUser()    │            │
│                             └──────────────────┘            │
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │MonitoringController│    │ OrderController  │            │
│  ├──────────────────┤      ├──────────────────┤            │
│  │ +getLogs()       │      │ +getOrders()     │            │
│  │ +createLog()     │      │ +createOrder()   │            │
│  │ +getPrediction() │      │ +updateStatus()  │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   ML Service     │      │   Database       │            │
│  ├──────────────────┤      ├──────────────────┤            │
│  │ +predict()       │◄────►│ +query()         │            │
│  │ +loadModel()     │      │ +pool            │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        ML SERVICE LAYER                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  Predict Module  │      │  Model Utils     │            │
│  ├──────────────────┤      ├──────────────────┤            │
│  │ +predict()       │      │ +loadModel()     │            │
│  │ +validateInput() │      │ +preprocess()    │            │
│  └──────────────────┘      │ +getDescription()│            │
│                             └──────────────────┘            │
│                                                               │
│  ┌──────────────────┐                                       │
│  │ Random Forest    │                                       │
│  │ Classifier       │                                       │
│  ├──────────────────┤                                       │
│  │ -model.pkl       │                                       │
│  │ -scaler.pkl      │                                       │
│  │ +predict()       │                                       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Perancangan Data

#### 2.2.1 Dekomposisi Data

**Deskripsi Entitas Data: users**

| Nama          | Tipe        | Panjang | Keterangan                                   |
| ------------- | ----------- | ------- | -------------------------------------------- |
| id            | SERIAL      | -       | Primary Key, Auto Increment                  |
| name          | VARCHAR     | 100     | Nama lengkap user, NOT NULL                  |
| email         | VARCHAR     | 100     | Email user, UNIQUE, NOT NULL                 |
| password_hash | VARCHAR     | 255     | Hash password (bcrypt), NOT NULL             |
| role          | user_role   | ENUM    | Role: 'admin', 'petambak', 'buyer', NOT NULL |
| created_at    | TIMESTAMPTZ | -       | Timestamp pembuatan, DEFAULT NOW()           |

**Deskripsi Entitas Data: ponds**

| Nama        | Tipe        | Panjang | Keterangan                                  |
| ----------- | ----------- | ------- | ------------------------------------------- |
| id          | SERIAL      | -       | Primary Key, Auto Increment                 |
| user_id     | INTEGER     | -       | Foreign Key ke users(id), ON DELETE CASCADE |
| name        | VARCHAR     | 100     | Nama kolam, NOT NULL                        |
| location    | VARCHAR     | 255     | Lokasi kolam, nullable                      |
| description | TEXT        | -       | Deskripsi kolam, nullable                   |
| created_at  | TIMESTAMPTZ | -       | Timestamp pembuatan, DEFAULT NOW()          |

**Deskripsi Entitas Data: water_quality_logs**

| Nama             | Tipe        | Panjang | Keterangan                                             |
| ---------------- | ----------- | ------- | ------------------------------------------------------ |
| id               | SERIAL      | -       | Primary Key, Auto Increment                            |
| pond_id          | INTEGER     | -       | Foreign Key ke ponds(id), ON DELETE CASCADE            |
| temperature      | DECIMAL     | 5,2     | Suhu air dalam °C                                      |
| ph_level         | DECIMAL     | 4,2     | Tingkat pH (0-14)                                      |
| dissolved_oxygen | DECIMAL     | 5,2     | Oksigen terlarut dalam mg/L                            |
| turbidity        | DECIMAL     | 5,2     | Kekeruhan dalam NTU                                    |
| prediction       | VARCHAR     | 50      | Hasil prediksi ML: 'Baik', 'Normal', 'Perlu Perhatian' |
| logged_at        | TIMESTAMPTZ | -       | Waktu pencatatan, DEFAULT NOW()                        |

**Deskripsi Entitas Data: feed_schedules**

| Nama       | Tipe        | Panjang | Keterangan                                    |
| ---------- | ----------- | ------- | --------------------------------------------- |
| id         | SERIAL      | -       | Primary Key, Auto Increment                   |
| pond_id    | INTEGER     | -       | Foreign Key ke ponds(id), ON DELETE CASCADE   |
| feed_time  | TIME        | -       | Waktu pemberian pakan, NOT NULL               |
| feed_date  | DATE        | -       | Tanggal pemberian pakan, DEFAULT CURRENT_DATE |
| amount_kg  | DECIMAL     | 5,2     | Jumlah pakan dalam kg, NOT NULL               |
| feed_type  | VARCHAR     | 100     | Jenis pakan, DEFAULT 'Pelet Standar'          |
| status     | VARCHAR     | 20      | Status: 'pending', 'completed', 'cancelled'   |
| is_done    | BOOLEAN     | -       | Flag completed, DEFAULT FALSE                 |
| created_at | TIMESTAMPTZ | -       | Timestamp pembuatan, DEFAULT NOW()            |

**Deskripsi Entitas Data: products**

| Nama        | Tipe        | Panjang | Keterangan                                  |
| ----------- | ----------- | ------- | ------------------------------------------- |
| id          | SERIAL      | -       | Primary Key, Auto Increment                 |
| user_id     | INTEGER     | -       | Foreign Key ke users(id), ON DELETE CASCADE |
| pond_id     | INTEGER     | -       | Foreign Key ke ponds(id), nullable          |
| name        | VARCHAR     | 100     | Nama produk, NOT NULL                       |
| description | TEXT        | -       | Deskripsi produk                            |
| price       | INTEGER     | -       | Harga per kg/ekor, NOT NULL                 |
| stock_kg    | DECIMAL     | 7,2     | Stok dalam kg                               |
| category    | VARCHAR     | 50      | Kategori: "Ikan Konsumsi", "Bibit Ikan"     |
| image_url   | VARCHAR     | 255     | URL gambar produk                           |
| created_at  | TIMESTAMPTZ | -       | Timestamp pembuatan, DEFAULT NOW()          |

**Deskripsi Entitas Data: orders**

| Nama                 | Tipe        | Panjang | Keterangan                                                                   |
| -------------------- | ----------- | ------- | ---------------------------------------------------------------------------- |
| id                   | SERIAL      | -       | Primary Key, Auto Increment                                                  |
| buyer_id             | INTEGER     | -       | Foreign Key ke users(id)                                                     |
| order_number         | VARCHAR     | 50      | Nomor order unik, UNIQUE                                                     |
| order_date           | TIMESTAMPTZ | -       | Tanggal pemesanan, DEFAULT NOW()                                             |
| status               | VARCHAR     | 50      | Status: 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled' |
| payment_status       | VARCHAR     | 50      | Status pembayaran                                                            |
| payment_method       | VARCHAR     | 50      | Metode pembayaran                                                            |
| transaction_id       | VARCHAR     | 255     | ID transaksi dari payment gateway                                            |
| shipping_name        | VARCHAR     | 100     | Nama penerima                                                                |
| shipping_phone       | VARCHAR     | 20      | No telepon penerima                                                          |
| shipping_address     | TEXT        | -       | Alamat pengiriman                                                            |
| shipping_city        | VARCHAR     | 100     | Kota pengiriman                                                              |
| shipping_postal_code | VARCHAR     | 10      | Kode pos                                                                     |
| total_amount         | INTEGER     | -       | Total harga pesanan                                                          |
| notes                | TEXT        | -       | Catatan tambahan                                                             |

**Deskripsi Entitas Data: order_items**

| Nama         | Tipe    | Panjang | Keterangan                                   |
| ------------ | ------- | ------- | -------------------------------------------- |
| id           | SERIAL  | -       | Primary Key, Auto Increment                  |
| order_id     | INTEGER | -       | Foreign Key ke orders(id), ON DELETE CASCADE |
| product_id   | INTEGER | -       | Foreign Key ke products(id)                  |
| product_name | VARCHAR | 100     | Nama produk (snapshot)                       |
| quantity_kg  | DECIMAL | 7,2     | Jumlah dalam kg, NOT NULL                    |
| price_per_kg | INTEGER | -       | Harga per kg saat order, NOT NULL            |
| subtotal     | INTEGER | -       | Total harga item                             |

**Deskripsi Entitas Data: cart**

| Nama        | Tipe        | Panjang | Keterangan                                     |
| ----------- | ----------- | ------- | ---------------------------------------------- |
| id          | SERIAL      | -       | Primary Key, Auto Increment                    |
| user_id     | INTEGER     | -       | Foreign Key ke users(id), ON DELETE CASCADE    |
| product_id  | INTEGER     | -       | Foreign Key ke products(id), ON DELETE CASCADE |
| quantity_kg | DECIMAL     | 7,2     | Jumlah dalam kg, NOT NULL                      |
| created_at  | TIMESTAMPTZ | -       | Timestamp pembuatan, DEFAULT NOW()             |

#### 2.2.2 Dekomposisi Fungsional

| No. Fungsi      | Fungsi / Proses                              | Tabel/Data Input                                                | Tabel/Data Output                                                                                                         | Keterangan                                                    |
| --------------- | -------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **SKPL F-01.0** | Sistem dapat melakukan login                 | username (email), password                                      | Validasi benar: JWT token, user data<br>Validasi salah: Error message                                                     | Menggunakan bcrypt untuk validasi password, JWT untuk session |
| **SKPL F-02.0** | Sistem dapat melakukan registrasi            | name, email, password, role                                     | User baru dalam tabel users<br>Auto login setelah registrasi                                                              | Password di-hash menggunakan bcrypt                           |
| **SKPL F-03.0** | Admin dapat mengelola user                   | user data (name, email, role, pond_id)                          | CRUD operasi pada tabel users                                                                                             | Validasi role petambak harus assign ke kolam                  |
| **SKPL F-04.0** | Sistem dapat mengelola kolam                 | pond data (name, location, description, user_id)                | CRUD operasi pada tabel ponds                                                                                             | Assignment kolam ke petambak                                  |
| **SKPL F-05.0** | Sistem dapat input data monitoring air       | pond_id, temperature, ph_level, dissolved_oxygen, turbidity     | Data tersimpan di water_quality_logs                                                                                      | Input manual oleh admin/petambak                              |
| **SKPL F-06.0** | Sistem dapat prediksi kualitas air dengan ML | temperature, ph_level, dissolved_oxygen, turbidity              | Prediction: 'Baik', 'Normal', 'Perlu Perhatian'<br>Description dan rekomendasi                                            | Menggunakan Random Forest Classifier via ML Service API       |
| **SKPL F-07.0** | Sistem dapat mengelola jadwal pakan          | pond_id, feed_time, feed_date, amount_kg, feed_type             | CRUD operasi pada tabel feed_schedules                                                                                    | Status tracking: pending, completed, cancelled                |
| **SKPL F-08.0** | Sistem dapat mengelola produk                | product data (name, description, price, stock, category, image) | CRUD operasi pada tabel products                                                                                          | Kategori: Ikan Konsumsi, Bibit Ikan                           |
| **SKPL F-09.0** | Buyer dapat menambahkan produk ke cart       | user_id, product_id, quantity_kg                                | Data tersimpan di tabel cart                                                                                              | Validasi stok tersedia                                        |
| **SKPL F-10.0** | Sistem dapat proses checkout                 | cart items, shipping data                                       | Order baru di tabel orders<br>Order items di tabel order_items<br>Kosongkan cart                                          | Validasi stok, generate order_number                          |
| **SKPL F-11.0** | Sistem dapat integrasi payment gateway       | order data, payment method                                      | Transaction ID dari Midtrans<br>Update payment_status di orders                                                           | Integrasi dengan Midtrans API                                 |
| **SKPL F-12.0** | Admin dapat update status pesanan            | order_id, new_status, admin_notes                               | Update status di tabel orders                                                                                             | Tracking lifecycle order                                      |
| **SKPL F-13.0** | Sistem dapat menampilkan dashboard           | user role                                                       | Dashboard sesuai role:<br>- Admin: overview semua data<br>- Petambak: monitoring kolam assigned<br>- Buyer: order history | Role-based dashboard                                          |
| **SKPL F-14.0** | Sistem dapat menampilkan grafik monitoring   | pond_id, date range                                             | Data dari water_quality_logs dengan visualisasi                                                                           | Grafik line chart untuk parameter air                         |

#### 2.2.3 Entity Relationship Diagram

```
┌──────────────────┐
│     users        │
├──────────────────┤
│ id (PK)          │
│ name             │
│ email (UNIQUE)   │◄──────┐
│ password_hash    │       │
│ role             │       │
│ created_at       │       │
└──────────────────┘       │
                           │
┌──────────────────┐       │
│     ponds        │       │
├──────────────────┤       │
│ id (PK)          │       │
│ user_id (FK) ────┼───────┼──┐
│ name             │       │  │
│ location         │       │  │
│ description      │       │  │
│ created_at       │       │  │
└────────┬─────────┘       │  │
         │                 │  │
         │                 │  │
         │ 1               │  │
         │                 │  │
         │ N               │  │
         │                 │  │
┌────────▼─────────────────▼──▼──────┐
│     water_quality_logs             │
├────────────────────────────────────┤
│ id (PK)                            │
│ pond_id (FK) ──────────────────────┘
│ temperature                        │
│ ph_level                           │
│ dissolved_oxygen                   │
│ turbidity                          │
│ prediction                         │
│ logged_at                          │
└────────────────────────────────────┘

┌──────────────────┐        ┌──────────────────┐
│  feed_schedules  │        │    products      │
├──────────────────┤        ├──────────────────┤
│ id (PK)          │        │ id (PK)          │
│ pond_id (FK) ────┼────────┤ user_id (FK) ────┼───┐
│ feed_time        │        │ pond_id (FK)     │   │
│ feed_date        │        │ name             │   │
│ amount_kg        │        │ description      │   │
│ feed_type        │        │ price            │   │
│ status           │        │ stock_kg         │   │
│ is_done          │        │ category         │   │
│ created_at       │        │ image_url        │   │
└──────────────────┘        │ created_at       │   │
                            └────────┬─────────┘   │
                                     │             │
                                     │ 1           │
                                     │             │
                                     │ N           │
                            ┌────────▼───────────┐ │
                            │      cart          │ │
                            ├────────────────────┤ │
                            │ id (PK)            │ │
                            │ user_id (FK) ──────┼─┘
                            │ product_id (FK) ───┘
                            │ quantity_kg        │
                            │ created_at         │
                            └────────────────────┘

┌──────────────────┐        ┌──────────────────┐
│     orders       │        │   order_items    │
├──────────────────┤        ├──────────────────┤
│ id (PK)          │        │ id (PK)          │
│ buyer_id (FK) ───┼───────►│ order_id (FK) ───┼──┐
│ order_number     │   1    │ product_id (FK)  │  │
│ order_date       │        │ product_name     │  │
│ status           │        │ quantity_kg      │  │
│ payment_status   │        │ price_per_kg     │  │
│ payment_method   │        │ subtotal         │  │
│ transaction_id   │        └──────────────────┘  │
│ shipping_name    │                              │
│ shipping_phone   │                              │
│ shipping_address │                              │
│ shipping_city    │                              │
│ shipping_postal  │                              │
│ total_amount     │                              │
│ notes            │                              │
│ created_at       │                              │
└──────────────────┘                              │
                                                  │
                                                  │
                            ┌─────────────────────┘
                            │ N
                            │
                            │
```

**Keterangan Relasi:**

- users (1) ──< (N) ponds: Satu user dapat memiliki banyak kolam
- ponds (1) ──< (N) water_quality_logs: Satu kolam memiliki banyak log kualitas air
- ponds (1) ──< (N) feed_schedules: Satu kolam memiliki banyak jadwal pakan
- users (1) ──< (N) products: Satu user dapat memiliki banyak produk
- users (1) ──< (N) cart: Satu user dapat memiliki banyak item di cart
- users (1) ──< (N) orders: Satu buyer dapat memiliki banyak pesanan
- orders (1) ──< (N) order_items: Satu pesanan memiliki banyak item
- products (1) ──< (N) cart: Satu produk dapat ada di banyak cart
- products (1) ──< (N) order_items: Satu produk dapat ada di banyak order items

### 2.3 Perancangan Antarmuka

#### 2.3.1 Antarmuka Pengguna (User Interface)

**A. Halaman Autentikasi**

1. **Login Page**

   - Form input: Email, Password
   - Button: Login, Link ke Register
   - Validasi: Format email, password tidak kosong
   - Error handling: Tampilkan pesan error jika login gagal

2. **Register Page**
   - Form input: Nama, Email, Password, Konfirmasi Password, Role
   - Button: Register, Link ke Login
   - Validasi: Semua field required, email format, password match

**B. Dashboard Admin**

1. **Admin Dashboard**

   - Statistik: Total users, Total kolam, Total produk, Total pesanan
   - Quick access: User Management, Pond Management, Product Management, Order Management
   - Recent activities: Log aktivitas terbaru
   - Grafik: Trend monitoring kualitas air

2. **User Management Page**

   - Tabel: Daftar semua users dengan filter dan search
   - Actions: Tambah User, Edit User, Delete User
   - Modal: Form tambah/edit user
   - Validasi: Email unik, role valid

3. **Pond Management Page**

   - Tabel: Daftar semua kolam dengan filter
   - Actions: Tambah Kolam, Edit Kolam, Delete Kolam, Assign to Petambak
   - Modal: Form tambah/edit kolam

4. **Water Monitoring Page**

   - Grafik: Visualisasi parameter air (pH, Temperature, DO, Turbidity)
   - Tabel: Log data monitoring dengan filter kolam dan tanggal
   - Button: Tambah Data Monitoring Manual
   - Alert: Indikator visual untuk kondisi "Perlu Perhatian"
   - Modal: Form input data monitoring

5. **Feed Management Page**

   - Tabel: Jadwal pakan dengan filter kolam dan status
   - Actions: Tambah Jadwal, Edit Jadwal, Delete Jadwal, Mark Complete
   - Modal: Form tambah/edit jadwal pakan

6. **Product Management Page**

   - Grid/Tabel: Daftar produk dengan gambar, nama, harga, stok
   - Actions: Tambah Produk, Edit Produk, Delete Produk
   - Modal: Form tambah/edit produk dengan upload gambar

7. **Order Management Page**
   - Tabel: Daftar pesanan dengan filter status
   - Actions: View Detail, Update Status
   - Modal: Detail pesanan dengan form update status

**C. Dashboard Petambak**

1. **Petambak Dashboard**

   - Kolam assigned: List kolam yang ditugaskan
   - Monitoring: Grafik kualitas air untuk kolam assigned
   - Feed Schedule: Jadwal pakan hari ini dan besok
   - Quick stats: Total kolam, kondisi air, jadwal pakan

2. **Monitoring Page**

   - Grafik: Parameter air untuk kolam assigned
   - Input: Tambah data monitoring manual
   - Alert: Notifikasi kondisi air tidak optimal

3. **Feed Schedule Page**
   - Kalender/List: Jadwal pakan per kolam
   - Actions: Mark as completed

**D. Dashboard Buyer (E-commerce)**

1. **Welcome Page (Home)**

   - Hero section: Promosi produk
   - Product grid: Produk populer/rekomendasi
   - Categories: Filter berdasarkan kategori

2. **Products Page**

   - Product grid: Semua produk dengan filter dan search
   - Product card: Gambar, nama, harga, button "Beli Sekarang"

3. **Product Detail Page**

   - Gambar produk
   - Nama, harga, deskripsi, stok
   - Input quantity
   - Button: Tambah ke Cart, Beli Sekarang

4. **Cart Page**

   - List item di cart dengan quantity
   - Total harga
   - Button: Update Quantity, Remove Item, Checkout

5. **Checkout Page**

   - Form shipping: Nama, telepon, alamat lengkap
   - Order summary: List item, subtotal, total
   - Payment method selection
   - Button: Place Order

6. **Order History Page**

   - List pesanan dengan status
   - Actions: View Detail, Cancel (jika pending)

7. **Order Detail Page**
   - Informasi pesanan lengkap
   - Status tracking
   - Button: Cancel order (jika pending)

**E. Komponen UI Umum**

- **Navbar**: Logo, Menu sesuai role, User profile dropdown, Logout
- **Sidebar**: Navigation menu untuk dashboard (Admin/Petambak)
- **Modal/Dialog**: Untuk form dan konfirmasi
- **Toast Notification**: Untuk feedback action (success, error, info)
- **Loading Spinner**: Untuk indikator loading
- **Badge**: Untuk status dan label
- **Card**: Untuk container konten

#### 2.3.2 Antarmuka Sistem (System Interface)

**A. Frontend ↔ Backend API**

**Base URL**: `http://localhost:5001/api`

**Endpoints:**

1. **Authentication**

   - `POST /auth/login` - Login user
   - `POST /auth/register` - Registrasi user baru
   - `GET /auth/me` - Get current user info

2. **Users**

   - `GET /users` - Get all users (admin only)
   - `GET /users/:id` - Get user by ID
   - `POST /users` - Create user (admin only)
   - `PUT /users/:id` - Update user (admin only)
   - `DELETE /users/:id` - Delete user (admin only)

3. **Ponds**

   - `GET /ponds` - Get all ponds
   - `GET /ponds/:id` - Get pond by ID
   - `POST /ponds` - Create pond
   - `PUT /ponds/:id` - Update pond
   - `DELETE /ponds/:id` - Delete pond

4. **Monitoring**

   - `GET /monitoring` - Get water quality logs
   - `GET /monitoring/:pondId` - Get logs by pond
   - `POST /monitoring` - Create new log
   - `GET /monitoring/predict` - Get prediction from ML service

5. **Feeds**

   - `GET /feeds` - Get feed schedules
   - `POST /feeds` - Create feed schedule
   - `PUT /feeds/:id` - Update feed schedule
   - `DELETE /feeds/:id` - Delete feed schedule

6. **Products**

   - `GET /products` - Get all products
   - `GET /products/:id` - Get product by ID
   - `POST /products` - Create product
   - `PUT /products/:id` - Update product
   - `DELETE /products/:id` - Delete product

7. **Cart**

   - `GET /cart` - Get user's cart
   - `POST /cart` - Add item to cart
   - `PUT /cart/:id` - Update cart item
   - `DELETE /cart/:id` - Remove cart item

8. **Orders**

   - `GET /orders` - Get orders
   - `GET /orders/:id` - Get order by ID
   - `POST /orders` - Create order
   - `PUT /orders/:id` - Update order status

9. **Payments**
   - `POST /payments/create` - Create payment transaction
   - `POST /payments/notification` - Handle payment notification from Midtrans

**Response Format:**

```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

**Error Format:**

```json
{
  "success": false,
  "message": "Error message",
  "errors": {...}
}
```

**B. Backend ↔ ML Service API**

**Base URL**: `http://localhost:5002`

**Endpoints:**

1. **Prediction**
   - `POST /predict` - Predict water quality
     - Request Body:
       ```json
       {
         "temperature": 28.5,
         "ph_level": 7.2,
         "dissolved_oxygen": 6.5,
         "turbidity": 15.0
       }
       ```
     - Response:
       ```json
       {
         "success": true,
         "prediction": "Baik",
         "confidence": 0.95,
         "description": "...",
         "recommendations": [...]
       }
       ```

**C. Backend ↔ Payment Gateway (Midtrans)**

**Base URL**: `https://api.sandbox.midtrans.com` (sandbox) / `https://api.midtrans.com` (production)

**Endpoints:**

1. **Create Transaction**

   - `POST /v2/charge` - Create payment transaction
   - Request menggunakan `midtrans-client` library

2. **Notification Handler**
   - `POST /v2/transaction/notification` - Receive payment status update

**D. Backend ↔ Database (PostgreSQL)**

**Connection:**

- Driver: `pg` (node-postgres)
- Connection Pool: Menggunakan connection pooling untuk optimasi
- Query: Menggunakan parameterized queries untuk keamanan

**Transaction:**

- Menggunakan database transaction untuk operasi multi-step (contoh: checkout)

---

## 3. MATRIKS KETERURUTAN

Matriks Keterurutan (Traceability Matrix) menunjukkan keterkaitan antara kebutuhan (requirements) dengan elemen desain, implementasi, dan pengujian.

| ID Requirement  | Deskripsi Requirement                        | Modul/Desain              | Komponen Implementasi                                                         | Test Case   |
| --------------- | -------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- | ----------- |
| **SKPL F-01.0** | Sistem dapat melakukan login                 | Auth Module               | AuthController.login()<br>authRoutes.js<br>LoginPage.jsx                      | TC-AUTH-01  |
| **SKPL F-02.0** | Sistem dapat melakukan registrasi            | Auth Module               | AuthController.register()<br>RegisterPage.jsx                                 | TC-AUTH-02  |
| **SKPL F-03.0** | Admin dapat mengelola user                   | User Management Module    | UserController<br>UserManagementPage.jsx                                      | TC-USER-01  |
| **SKPL F-04.0** | Sistem dapat mengelola kolam                 | Pond Management Module    | PondController<br>PondManagementPage.jsx                                      | TC-POND-01  |
| **SKPL F-05.0** | Sistem dapat input data monitoring air       | Monitoring Module         | MonitoringController.createLog()<br>WaterMonitoringPage.jsx                   | TC-MON-01   |
| **SKPL F-06.0** | Sistem dapat prediksi kualitas air dengan ML | ML Integration Module     | ML Service API<br>MonitoringController.getPrediction()<br>Random Forest Model | TC-ML-01    |
| **SKPL F-07.0** | Sistem dapat mengelola jadwal pakan          | Feed Management Module    | FeedController<br>FeedManagementPage.jsx                                      | TC-FEED-01  |
| **SKPL F-08.0** | Sistem dapat mengelola produk                | Product Management Module | ProductController<br>ProductManagementPage.jsx                                | TC-PROD-01  |
| **SKPL F-09.0** | Buyer dapat menambahkan produk ke cart       | Cart Module               | CartController<br>CartPage.jsx<br>ProductDetailPage.jsx                       | TC-CART-01  |
| **SKPL F-10.0** | Sistem dapat proses checkout                 | Order Module              | OrderController.createOrder()<br>CheckoutPage.jsx                             | TC-ORDER-01 |
| **SKPL F-11.0** | Sistem dapat integrasi payment gateway       | Payment Module            | PaymentController<br>Midtrans Integration                                     | TC-PAY-01   |
| **SKPL F-12.0** | Admin dapat update status pesanan            | Order Management Module   | OrderController.updateStatus()<br>OrderManagementPage.jsx                     | TC-ORDER-02 |
| **SKPL F-13.0** | Sistem dapat menampilkan dashboard           | Dashboard Module          | AdminDashboard.jsx<br>UserMonitoringPage.jsx                                  | TC-DASH-01  |
| **SKPL F-14.0** | Sistem dapat menampilkan grafik monitoring   | Monitoring Visualization  | WaterMonitoringPage.jsx<br>Charts (Recharts)                                  | TC-MON-02   |

**Keterangan:**

- **Modul/Desain**: Komponen desain yang mengimplementasikan requirement
- **Komponen Implementasi**: File/class/function yang mengimplementasikan requirement
- **Test Case**: ID test case untuk pengujian requirement tersebut

---

**Dokumen ini dibuat untuk keperluan dokumentasi proyek NilaSense**  
**Program Studi Teknologi Rekayasa Komputer**  
**Sekolah Vokasi Institut Pertanian Bogor**

---

_Terakhir diperbarui: [Tanggal]_
