# 🎬 Cine-ku — Modern Movie Streaming Hub

Website film modern bertema dark mode ala Netflix / Disney+, dibangun dengan **HTML, CSS, JavaScript murni**, **TMDb API**, **Firebase Authentication (Google)**, dan **Local Storage** untuk wishlist.

---

## 📁 Struktur Folder

```
Cine-ku/
├── index.html         → Home (banner carousel + 3 section film)
├── search.html        → Pencarian realtime
├── wishlist.html      → Daftar film favorit (perlu login)
├── about.html         → Halaman tentang
├── css/
│   ├── style.css      → Tema global, navbar, button, footer
│   ├── home.css       → Hero carousel, slider, movie card, search hero, about
│   ├── detail.css     → Halaman detail film + trailer modal
│   └── responsive.css → Breakpoint mobile / tablet
├── js/
│   ├── api.js         → Wrapper TMDb (popular, top_rated, upcoming, search, details, credits, videos)
│   ├── firebase.js    → Inisialisasi Firebase + Google Provider
│   ├── auth.js        → Login / Logout Google + render navbar user
│   ├── wishlist.js    → CRUD wishlist via Local Storage
│   ├── app.js         → Helper card, navbar mobile, init Home & Wishlist page
│   ├── search.js      → Logika realtime search
│   └── detail.js      → Halaman detail + trailer YouTube
├── assets/
│   ├── logo/          → logo.svg
│   ├── icons/
│   └── banner/
└── pages/
    └── detail.html    → Halaman detail film (?id=123)
```

---

## 🚀 Langkah Menjalankan (Untuk Pemula)

### 1. Dapatkan API Key TMDb (gratis)
1. Buka **https://www.themoviedb.org/** → daftar akun.
2. Buka **Settings → API → Create → Developer**.
3. Isi formulir (boleh untuk personal/learning).
4. Salin **API Key (v3 auth)**.
5. Buka file `js/api.js` → ganti `GANTI_DENGAN_API_KEY_TMDB_KAMU` dengan API Key kamu.

### 2. Buat Project Firebase
1. Buka **https://console.firebase.google.com/** → **Add project**.
2. Beri nama project (mis. *cineku*) → Continue → Create.
3. Di Project Overview klik ikon **Web ( </> )** → daftarkan app dengan nickname `cineku-web`.
4. Salin objek `firebaseConfig` yang muncul.
5. Buka file `js/firebase.js` → tempel ke variabel `firebaseConfig` (ganti semua `GANTI_...`).

### 3. Aktifkan Google Sign-In
1. Di Firebase Console → **Build → Authentication → Get started**.
2. Tab **Sign-in method** → klik **Google** → toggle **Enable** → pilih support email → Save.
3. Tab **Settings → Authorized domains** → pastikan `localhost` ada (default sudah ada). Jika nanti deploy, tambahkan domain hosting kamu.

### 4. Jalankan Website (HARUS pakai server lokal, bukan double-click!)
Firebase Auth & module ES tidak jalan dari `file://`. Pilih salah satu cara:

**Cara A — VSCode (paling mudah):**
- Install ekstensi **Live Server** → klik kanan `index.html` → *Open with Live Server*.

**Cara B — Python:**
```bash
cd Cine-ku
python -m http.server 5173
```
buka `http://localhost:5173`

**Cara C — Node:**
```bash
npx serve Cine-ku
```

### 5. Test Login Google
1. Klik tombol **Login with Google** di pojok kanan navbar.
2. Pilih akun Google → otomatis kembali, navbar berubah jadi avatar + nama.
3. Klik **Logout** untuk keluar.

### 6. Test Wishlist
- Tanpa login: tombol ❤ akan minta login.
- Setelah login: klik ❤ pada card → film masuk wishlist (Local Storage).
- Buka `wishlist.html` untuk melihat / menghapus.

### 7. Deploy (opsional — gratis dengan Firebase Hosting)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # pilih project Firebase kamu, public folder: . (titik), single-page: No
firebase deploy
```
Atau tarik folder `Cine-ku/` ke **Netlify Drop** (https://app.netlify.com/drop) — selesai dalam 10 detik.

---

## 🔌 Endpoint TMDb yang Dipakai

| Fungsi              | Endpoint                          |
|---------------------|-----------------------------------|
| Popular             | `/movie/popular`                  |
| Top Rated           | `/movie/top_rated`                |
| Upcoming            | `/movie/upcoming`                 |
| Search              | `/search/movie?query=...`         |
| Detail film         | `/movie/{id}`                     |
| Cast                | `/movie/{id}/credits`             |
| Trailer YouTube     | `/movie/{id}/videos`              |

Gambar pakai `https://image.tmdb.org/t/p/{size}{path}`.

---

## ✨ Fitur

- 🎨 Dark mode modern, hover & smooth transition
- 📱 Responsive mobile + desktop, hamburger menu
- 🎞️ Banner carousel auto-slide 6 detik
- ↔️ Slider horizontal per kategori (Popular, Top Rated, Upcoming)
- 🔍 Realtime search dengan debounce
- ❤️ Wishlist Local Storage (perlu login)
- 🔐 Google Sign-In asli via Firebase
- 🎬 Halaman detail lengkap + trailer YouTube modal

---

Dibuat oleh **nfbs** · Data oleh [TMDb](https://www.themoviedb.org/).
