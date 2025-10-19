# 🧪 Test CRUD Functionality - Step by Step

## ⚠️ **PENTING: Ignore Chrome Extension Errors!**

Error seperti ini **BUKAN dari aplikasi Anda:**
```
chrome-extension://h...ilot.b68e6a51.js:15 Uncaught TypeError
```

Ini adalah internal error dari Chrome Extension (GitHub Copilot, etc.) dan **tidak mempengaruhi aplikasi**.

---

## 🔍 **Filter Console Errors:**

### **Method 1: Filter by URL**
Di Console, ketik:
```
-url:chrome-extension
```

### **Method 2: Hide Extension Errors**
1. Console Settings (gear icon)
2. Uncheck "Show extension errors"

### **Method 3: Focus on Your App**
Filter by:
```
url:localhost:3000
```

---

## ✅ **Test CRUD - Product Management:**

### **Prerequisites:**
1. Backend running: `cd backend && npm start`
2. Frontend running: `cd frontend && npm run dev`
3. Logged in as admin

### **Test Create Product:**

1. Navigate to: `http://localhost:3000/product-management`
2. Click **"Tambah Produk"**
3. Dialog opens → Fill form:
   ```
   Nama: Test Product 1
   Deskripsi: Testing create
   Harga: 50000
   Stok: 100
   Kategori: Ikan Konsumsi
   ```
4. Click **"Tambah"**

**Expected Result:**
- ✅ Toast success: "Produk berhasil ditambahkan"
- ✅ Dialog closes
- ✅ Product appears in table
- ✅ No error in console (except extension errors)

**If Error Occurs:**
- Check Network tab (F12 → Network)
- Look for POST request to `/api/products`
- Check status code (should be 201)
- Check response body

---

### **Test Edit Product:**

1. Find the product you just created
2. Click **Edit icon** (pencil)
3. Change name to: "Test Product 1 - Updated"
4. Click **"Perbarui"**

**Expected Result:**
- ✅ Toast success: "Produk berhasil diperbarui"
- ✅ Name changes in table
- ✅ No error in console

---

### **Test Delete Product:**

1. Click **Delete icon** (trash) on test product
2. Confirm deletion
3. Wait for confirmation

**Expected Result:**
- ✅ Toast success: "Produk berhasil dihapus"
- ✅ Product removed from table
- ✅ No error in console

---

## ✅ **Test CRUD - User Management:**

### **Test Create User:**

1. Navigate to: `http://localhost:3000/user-management`
2. Click **"Tambah User"**
3. Fill form:
   ```
   Nama: Test User
   Email: testuser@example.com
   Password: test123
   Role: Pembeli
   ```
4. Click **"Tambah"**

**Expected Result:**
- ✅ Toast success: "User berhasil ditambahkan"
- ✅ User appears in table
- ✅ No error in console

---

### **Test Edit User:**

1. Click **Edit** on test user
2. Change name to: "Test User - Updated"
3. Click **"Perbarui"**

**Expected Result:**
- ✅ Toast success: "User berhasil diperbarui"
- ✅ Name changes in table

---

### **Test Delete User:**

1. Click **Delete** on test user
2. Confirm deletion

**Expected Result:**
- ✅ Toast success: "User berhasil dihapus"
- ✅ User removed from table

---

## ✅ **Test CRUD - Feed Management:**

### **Prerequisites:**
Make sure you have at least one pond in database.

### **Test Create Schedule:**

1. Navigate to: `http://localhost:3000/feed-management`
2. Click **"Tambah Jadwal"**
3. Fill form:
   ```
   Kolam: (Select any pond)
   Tanggal: (Today's date)
   Waktu: 14:00
   Jumlah: 5
   Jenis Pakan: Pelet Standar
   ```
4. Click **"Tambah"**

**Expected Result:**
- ✅ Toast success: "Jadwal pakan berhasil ditambahkan"
- ✅ Schedule appears in table

---

### **Test Edit Schedule:**

1. Click **Edit** on test schedule
2. Change time to: 15:00
3. Click **"Perbarui"**

**Expected Result:**
- ✅ Toast success: "Jadwal pakan berhasil diperbarui"
- ✅ Time changes in table

---

### **Test Delete Schedule:**

1. Click **Delete** on test schedule
2. Confirm deletion

**Expected Result:**
- ✅ Toast success: "Jadwal pakan berhasil dihapus"
- ✅ Schedule removed from table

---

## 🐛 **If REAL Errors Occur:**

### **Check 1: Backend Running?**
```bash
curl http://localhost:5001/
```
Should return: `{"message":"Selamat datang di NilaSense Backend API!"}`

### **Check 2: Database Connected?**
Check backend terminal for errors like:
```
Error: connect ECONNREFUSED
Error: password authentication failed
```

### **Check 3: Token Valid?**
In console:
```javascript
localStorage.getItem('token')
```
Should return a JWT token (long string).

If null → Logout and login again.

### **Check 4: Network Requests**
F12 → Network tab → Filter: XHR

Look for failed requests (red):
- Status 401 → Token expired, login again
- Status 500 → Backend error, check backend console
- Status 400 → Validation error, check request payload

---

## 📊 **Test Results Checklist:**

### **Product Management:**
- [ ] Create product works
- [ ] Edit product works
- [ ] Delete product works
- [ ] Table updates correctly
- [ ] No console errors (except extension)

### **User Management:**
- [ ] Create user works
- [ ] Edit user works
- [ ] Delete user works
- [ ] Table updates correctly
- [ ] No console errors (except extension)

### **Feed Management:**
- [ ] Create schedule works
- [ ] Edit schedule works
- [ ] Delete schedule works
- [ ] Table updates correctly
- [ ] No console errors (except extension)

---

## ✅ **If All Tests Pass:**

**CONGRATULATIONS!** 🎉

Your CRUD system is **fully functional**. The extension error is **not a problem** for your application.

You can:
1. **Disable the problematic extension** if it bothers you
2. **Ignore extension errors** - they don't affect your app
3. **Continue development** - everything works!

---

## 🚫 **If Tests Fail:**

Please provide:

1. **Screenshot of Network tab** (failed request)
2. **Console error** (NOT extension errors)
3. **Backend terminal log**
4. **What specific action failed** (Create? Edit? Delete?)

With this information, I can help debug the real issue!

---

## 🎯 **Common Non-Issues:**

These are **NOT real errors:**
```
❌ chrome-extension://... (Extension error - IGNORE)
❌ [Violation] Added non-passive... (Performance warning - IGNORE)
❌ DevTools failed to load source map (Source map missing - IGNORE)
```

These **ARE real errors:**
```
✅ Uncaught TypeError in ProductManagementPage.jsx
✅ 401 Unauthorized from /api/products
✅ Network Error: Failed to fetch
✅ Cannot read property of undefined in UserManagementPage
```

---

**Test your CRUD now and let me know if there are REAL errors!** 🚀
