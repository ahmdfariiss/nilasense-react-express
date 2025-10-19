# 🧪 TEST: Apakah Button & Dialog Bekerja

## 📋 **Langkah Testing:**

Saya sudah menambahkan console.log untuk debug. Ikuti langkah ini **TEPAT**:

---

### **STEP 1: Restart Dev Server**

```bash
# Terminal frontend
cd frontend

# Stop server (Ctrl+C jika masih running)

# Clear cache Vite
rm -rf node_modules/.vite

# Start ulang
npm run dev
```

**Wait until:** `VITE v... ready in ...ms`

---

### **STEP 2: Hard Refresh Browser**

1. Buka: `http://localhost:3000/product-management`
2. **Hard reload:** `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
3. Login jika diminta

---

### **STEP 3: Open Console & Filter**

1. Press `F12` (open DevTools)
2. Go to **Console** tab
3. Click filter icon (funnel)
4. Type: `-url:chrome-extension`
5. Press **Clear console** (trash icon atau Ctrl+L)

---

### **STEP 4: Click Button & Check Console**

1. Klik button **"Tambah Produk"** (yang ada icon Plus)
2. **IMMEDIATELY** check console

---

## ✅ **Expected Console Output:**

Seharusnya muncul:
```
Button Tambah Produk clicked!
ProductForm render - isOpen: false
ProductForm render - isOpen: true
```

---

## 🎯 **Results Analysis:**

### **Result A: Console Shows Messages BUT Dialog NOT Visible**

```javascript
Button Tambah Produk clicked!  ✅
ProductForm render - isOpen: true  ✅
```

**Diagnosis:** Dialog ter-render tapi tidak terlihat (CSS/z-index issue)

**Fix:**
1. Right-click halaman → **Inspect** (F12)
2. Go to **Elements** tab
3. Press `Ctrl+F` (search)
4. Type: `data-slot="dialog"`
5. If found → Check CSS styles
6. Look for `display: none` or `z-index: -1`

**Manual Fix:**
In browser console, run:
```javascript
document.querySelector('[data-slot="dialog-content"]').style.zIndex = '9999';
```

---

### **Result B: Only Button Message, No ProductForm**

```javascript
Button Tambah Produk clicked!  ✅
(no ProductForm message)  ❌
```

**Diagnosis:** State update tidak trigger re-render

**Fix:**
Check React DevTools:
1. Install **React Developer Tools** extension
2. Open DevTools → **Components** tab
3. Find `ProductManagementPage`
4. Check state: `showForm` → should change from `false` to `true`

If not changing → React state issue

---

### **Result C: No Console Output at All**

```javascript
(empty console)  ❌
```

**Diagnosis:** JavaScript error atau button tidak attached

**Fix:**

**Check 1:** Any errors in console?
```
Look for red error messages
```

**Check 2:** Is button actually rendered?
In console, run:
```javascript
document.querySelector('button:has(> svg + [class*="Tambah"])');
// Should return button element
```

**Check 3:** Click handler attached?
```javascript
const btn = document.querySelectorAll('button');
console.log('Total buttons:', btn.length);
btn.forEach((b, i) => console.log(i, b.textContent.trim()));
```

---

### **Result D: Error Message**

```javascript
Uncaught Error: Cannot read property...
Uncaught TypeError: ...
```

**Action:** Copy the FULL error message and share it!

---

## 🔧 **Emergency Debug:**

If nothing works, test with simple alert:

1. Add this to browser console:
```javascript
document.querySelector('button').addEventListener('click', () => {
  alert('Button clicked!');
});
```

2. Click any button
3. If alert shows → JavaScript works
4. If no alert → JavaScript not executing

---

## 📸 **What to Share:**

Take screenshot of:

1. **Console output** (after clicking button)
2. **Network tab** (no requests should appear for button click)
3. **Elements tab** (search for `data-slot="dialog"`)
4. **React DevTools** (if installed) - ProductManagementPage state

Or simply paste:
```
Console output:
[paste here]

Dialog found in DOM: Yes/No

showForm state: true/false

Any errors: Yes (paste) / No
```

---

## ⚡ **Quick Test Alternative:**

If you want to skip debugging and just make it work:

Replace the Button onClick with inline test:
```jsx
<Button onClick={() => alert('Test')}>
  Test
</Button>
```

If alert works → Button event works, problem is in state
If alert doesn't work → JavaScript not executing

---

**Test sekarang dan share console output!** 🔍

Format response:
```
✅ Button clicked message: Yes/No
✅ ProductForm render message: Yes/No  
✅ Dialog visible on screen: Yes/No
✅ Any errors: (paste if any)
```
