# WEB STYLE GUIDE
 
## CONTENTS
1. [Pendahuluan](#1-pendahuluan)
   - 1.1 [Tujuan](#11-tujuan)
   - 1.2 [Ruang Lingkup](#12-ruang-lingkup)
2. [Identitas Visual](#2-identitas-visual)
   - 2.1 [Logo](#21-logo)
3. [Warna (Color Palette)](#3-warna-color-palette)
4. [Tipografi](#4-tipografi)
5. [Layout dan Struktur Halaman](#5-layout-dan-struktur-halaman)
   - 5.1 [Layout Umum](#51-layout-umum)
6. [Komponen Utama (Main Components)](#6-komponen-utama-main-components)
   - 6.1 [Navbar](#61-navbar)
   - 6.2 [Hero Section](#62-hero-section)
   - 6.3 [Card Informasi](#63-card-informasi)
   - 6.4 [Footer](#64-footer)
   - 6.5 [Artikel Edukasi](#65-artikel-edukasi)
7. [Komponen Interaktif (Interactive Components)](#7-komponen-interaktif-interactive-components)
   - 7.1 [Button](#71-button)
   - 7.2 [Dropdown Menu](#72-dropdown-menu)
   - 7.3 [Search Bar](#73-search-bar)
   - 7.4 [Form Input](#74-form-input)
   - 7.5 [Modal](#75-modal)
   - 7.6 [Pagination](#76-pagination)
8. [Ikonografi](#8-ikonografi)
9. [Penggunaan Gambar](#9-penggunaan-gambar)
10. [Responsive Design](#10-responsive-design)

---
 
## 1. Pendahuluan

### 1.1 Tujuan
Dokumen ini bertujuan menjadi pedoman desain antarmuka pengguna (UI) pada Sistem Informasi Bank Sampah DLH Kota Batu agar tampilan website konsisten, mudah digunakan, dan mudah dikembangkan di masa mendatang.

### 1.2 Ruang Lingkup
Style guide ini mencakup:
a. Identitas visual 
b. Warna (Color Palette)
c. Tipografi 
d. Layout halaman 
e. Komponen utama 
f. Komponen interaktif 
g. Ikon dan gambar 
h. Aturan responsive

---
 
## 2. Identitas Visual

### 2.1 Logo
`[FOTO SCREENSHOT: LOGO WEBSITE]`

**Keterangan:**
a. Logo ditempatkan pada navbar bagian kiri. 
b. Digunakan sebagai identitas utama sistem. 
c. Tidak diperbolehkan mengubah proporsi logo. 
 
---

## 3. Warna (Color Palette)

Palet warna utama diambil dari konfigurasi asli Tailwind CSS (`tailwind.config.js`) bertema gelap (*Dark Mode*):

| Nama Warna | Hex | Kegunaan & Penjelasan |
| :--- | :--- | :--- |
| **Primary Emerald** | `#10B981` | Digunakan untuk tombol utama (CTA), link aktif, badge status aktif, dan ikon utama. |
| **Dark Emerald** | `#059669` | Digunakan untuk state hover tombol utama. |
| **Forest Emerald** | `#047857` | Digunakan sebagai aksen gradasi teks dan border terpenting. |
| **Deep Navy (Background)** | `#0a0f1c` | Warna latar belakang utama halaman (`body background`). |
| **Card Navy** | `#0f1729` | Warna latar belakang kartu (`card`), dropdown, dan panel kontainer. |
| **Border Navy** | `#1a2744` | Warna pembatas (`border`) input field, card, dan pemisah konten. |
| **Text Primary** | `#f8fafc` | Warna teks utama, judul (`heading`), dan label penting. |
| **Text Secondary** | `#cbd5e1` | Warna teks deskripsi sekunder dan paragraf tubuh halaman. |
| **Text Muted** | `#94a3b8` | Warna teks placeholder, metrik kecil, dan teks non-aktif. |

**Penjelasan Penerapan:**
* **Primary Color**: `#10B981` (Emerald-500) sebagai aksen hijau cerah yang memberikan nuansa ekologis dan lingkungan hidup.
* **Secondary Color**: `#0a0f1c` (Navy-900) & `#0f1729` (Navy-800) sebagai latar belakang mode gelap yang memberikan estetika premium, modern, dan mengurangi ketegangan mata.
* **Neutral Color**: `#cbd5e1` (Slate-300) dan `#1a2744` (Navy-600) untuk batas-batas fungsional elemen masukan dan teks kontras.

`[FOTO SCREENSHOT: PALETTE WARNA DARI DEVTOOLS / FIGMA]`

---

## 4. Tipografi

### Font Utama
Website menggunakan **Inter** (`font-family: 'Inter', sans-serif`) sebagai font sans-serif default yang modern, bersih, dan memiliki keterbacaan tinggi di layar digital.

Terdapat variasi font khusus untuk mode aksesibilitas/target audiens:
1. **Kids Mode (Mode Anak-anak)**: Menggunakan font **Fredoka** (`font-family: 'Fredoka', sans-serif`) yang memiliki bentuk bulat (*rounded*) dan terkesan ceria/playful.
2. **Government Mode (Mode Dinas)**: Menggunakan font **Lora** (`font-family: 'Lora', sans-serif`) yang formal, elegan, dan profesional khas instansi pemerintah.

### Hierarki Tipografi
| Elemen | Kelas Tailwind | Ukuran Pixel (Equivalent) | Kegunaan |
| :--- | :--- | :--- | :--- |
| **H1** | `text-4xl md:text-5xl lg:text-6xl font-bold` | 36px – 60px | Judul utama halaman (Hero Title) |
| **H2** | `text-2xl md:text-3xl font-bold` | 24px – 30px | Judul seksi halaman (Section Title) |
| **H3** | `text-lg font-semibold` | 18px | Judul kartu informasi (Card Title) |
| **H4** | `text-sm font-semibold uppercase` | 14px | Sub-header kelompok menu/kategori |
| **Body** | `text-sm md:text-base` | 14px – 16px | Konten teks deskripsi dan isi artikel |
| **Caption** | `text-xs / text-[10px]` | 12px – 10px | Keterangan gambar, metadata tanggal, dan badge status |

`[FOTO SCREENSHOT: CONTOH JUDUL HALAMAN, ISI ARTIKEL, & CAPTION]`

---

## 5. Layout dan Struktur Halaman

### 5.1 Layout Umum
Seluruh halaman SPA dirancang menggunakan struktur tata letak linier vertikal:
```
Navbar (Fixed di atas)
   ↓
Hero Section / Page Header Banner
   ↓
Content Section (Katalog Layanan, Grafik, atau Forum Input)
   ↓
Footer (Informasi Tambahan & Tautan Cepat)
```

Struktur ini diimplementasikan di halaman-halaman berikut:
* **Beranda (Landing Page)**: Akses visual cepat, ringkasan metrik kota, dan daftar kegiatan terbaru.
* **Profil DLH**: Penjelasan visi, misi, dan pilar dinas lingkungan hidup.
* **Edukasi**: Wadah panduan pilah sampah beserta pusat FAQ interaktif.
* **Layanan Publik**: Portal formulir pendaftaran bank sampah inline bagi pengguna terdaftar.
* **Direktori**: Peta interaktif Leaflet JS beserta daftar unit bank sampah terdekat.

`[FOTO SCREENSHOT: TAMPILAN HALAMAN BERANDA / PROFIL DLH / EDUKASI / KONTAK]`

---

## 6. Komponen Utama (Main Components)

### 6.1 Navbar
* **Fungsi**: Kontrol navigasi utama dan akses pergantian audiens (Audience Mode).
* **Elemen**: Logo brand (`DLHBatu`), menu dropdown tautan (Profil, Layanan, Data & Edukasi), tombol Dynamic CTA (Login / Register / Logout).
* **Aturan**: Menempel di bagian atas layar (`fixed top-0 left-0 right-0`), background semi-transparan (`bg-navy-900/95`) dengan efek blur (`backdrop-blur-md`), serta pembatas tipis bawah (`border-b border-navy-600/30`).

`[FOTO SCREENSHOT: NAVBAR UTAMA]`

### 6.2 Hero Section
* **Fungsi**: Bagian atas halaman yang berfungsi sebagai impresi visual utama.
* **Elemen**: Judul besar bertingkat (menggunakan utility `.text-gradient`), badge nama instansi DLH, deskripsi ringkas, tombol CTA ganda, dan ilustrasi visual di sisi kanan.

`[FOTO SCREENSHOT: HERO SECTION]`

### 6.3 Card Informasi
* **Fungsi**: Menampilkan poin-poin layanan secara ringkas dan teratur.
* **Isi**: Ikon representatif dari Lucide, Judul layanan/kegiatan, paragraf deskripsi singkat, dan penunjuk arah interaktif.
* **Aturan Visual**: Menggunakan kelas `.glass-card` (background `#0f1729` dengan transparansi 60% dan blur) dan `.glass-card-hover` untuk memberikan micro-animation transisi hover yang halus.

`[FOTO SCREENSHOT: CARD INFORMASI]`

### 6.4 Footer
* **Fungsi**: Penutup halaman dan penyedia pranala navigasi sekunder.
* **Isi**: Penjelasan singkat instansi, link media sosial (Instagram, Facebook, Youtube), menu navigasi cepat, kontak detail (alamat Balaikota, telepon, email), serta hak cipta copyright.

`[FOTO SCREENSHOT: FOOTER]`

### 6.5 Artikel Edukasi
* **Fungsi**: Memuat rincian informasi dan berita kegiatan.
* **Komponen**: Gambar thumbnail rasio aspek konsisten, badge tag kategori edukasi, metadata waktu pengerjaan/baca, judul artikel tebal, serta tombol baca selengkapnya.

`[FOTO SCREENSHOT: ARTIKEL EDUKASI]`

---

## 7. Komponen Interaktif (Interactive Components)

### 7.1 Button
Tombol utama dan sekunder memiliki karakteristik khusus saat disentuh atau diarahkan kursor:

* **Primary Button (`.btn-primary`)**:
  * Warna Dasar: Hijau Emerald (`#10B981`) dengan teks putih tebal.
  * Hover State: Berubah menjadi Hijau Emerald yang lebih gelap (`#059669`).
  * Active State: Ditekan (efek menyusut/skala transisi kecil).
  * Disabled State: Warna abu-abu redup dengan ikon kunci.

* **Outline Button (`.btn-outline`)**:
  * Warna Dasar: Border tipis biru/navy (`#1e293b`), teks slate-200.
  * Hover State: Border berubah menjadi Hijau Emerald terang, teks berubah menjadi hijau terang (`#10B981`), background transparan.

`[FOTO SCREENSHOT: TOMBOL DEFAULT, HOVER, ACTIVE, & DISABLED]`

### 7.2 Dropdown Menu
* **Penggunaan**: Menu navigasi dan menu aksi admin.
* **State**:
  * **Closed**: Menu tersembunyi.
  * **Open**: Terbuka secara transisi ke bawah (`animate-slide-down`) saat mouse masuk (hover) dengan jeda waktu penutupan 300ms agar kursor tidak sengaja menutup menu.
  * **Admin Action Menu**: Click-based (klik untuk membuka/menutup) dilengkapi dengan event handler klik di luar area (*outside-click close*) untuk merapatkan menu kembali secara otomatis.

`[FOTO SCREENSHOT: DROPDOWN KONDISI CLOSED & OPEN]`

### 7.3 Search Bar
* **Komponen**: Input pencarian horizontal beserta ikon kaca pembesar.
* **State**:
  * **Empty (Default)**: Background gelap solid, border redup.
  * **Focus**: Pinggiran border berubah menjadi hijau emerald terang, memicu bayangan ring lembut di sekeliling bar.
  * **Filled**: Menampilkan teks pencarian aktif.

`[FOTO SCREENSHOT: SEARCH BAR DEFAULT, FOCUS, & FILLED]`

### 7.4 Form Input
* **Penggunaan**: Buku tamu digital, registrasi unit baru, dan pengaduan.
* **State**:
  * **Default**: Field kosong dengan placeholder berwarna slate abu-abu.
  * **Focus**: Border bertransisi menjadi hijau emerald terang.
  * **Error**: Border berubah menjadi merah muda (`#ef4444/50`) disertai teks peringatan kesalahan pengisian.
  * **Success**: Notifikasi toast hijau muncul di pojok kanan bawah setelah tombol kirim ditekan.

`[FOTO SCREENSHOT: FORM INPUT DEFAULT, FOCUS, ERROR, & SUCCESS]`

### 7.5 Modal
* **Komponen**: Lapisan penutup layar penuh (Backdrop gelap transparan), kotak pesan utama di tengah, tombol silang (Close) di sudut kanan atas.
* **Animasi**: Transisi memudar masuk (`fadeIn`) dan bergeser ke bawah (`slideDown`).

`[FOTO SCREENSHOT: MODAL POP-UP DI ATAS LAYAR]`

### 7.6 Pagination
* **Penggunaan**: Navigasi halaman pada list artikel dan log data.
* **State**:
  * **Current page**: Angka halaman aktif berwarna hijau emerald (`#10B981`) dengan teks putih tebal.
  * **Previous / Next**: Tombol navigasi aktif atau berubah menjadi redup abu-abu jika halaman sudah mentok.

`[FOTO SCREENSHOT: PAGINATION ACTIVE, PREVIOUS, & NEXT]`

---

## 8. Ikonografi

Website menggunakan pustaka ikon **Lucide React** (`lucide-react`) untuk menjaga kekonsistenan garis vektor visual ikon di seluruh halaman.

**Ikon Kunci yang Digunakan:**
* `Leaf` / `Recycle`: Mewakili simbol kelestarian, logo brand, dan aktivitas daur ulang.
* `MapPin`: Mewakili lokasi koordinat Bank Sampah pada direktori peta interaktif.
* `CalendarDays` / `Clock`: Menyatakan jadwal waktu pickup logistik dan estimasi waktu baca artikel.
* `BarChart3`: Menyatakan visualisasi metrik statistik volume sampah.
* `User` / `Users`: Mewakili profil anggota terdaftar dan forum interaksi warga.
* `BookOpen`: Mewakili artikel panduan edukasi.

`[FOTO SCREENSHOT: DAFTAR IKON LUCIDE YANG DIGUNAKAN]`

---

## 9. Penggunaan Gambar

**Aturan & Standar Visual:**
a. Gambar harus disimpan dalam format **JPG** or **PNG** (diutamakan menggunakan format WebP untuk efisiensi transfer data web).
b. Resolusi minimum gambar banner utama adalah **1280×720 piksel** (HD) untuk mencegah visual pecah di monitor desktop.
c. Tema visual wajib relevan dengan lingkungan hidup, kegiatan sosial, penghijauan kota, pemilahan sampah, dan kebersihan.
d. Konten visual tidak diperbolehkan mengandung unsur SARA atau gambar yang mengganggu kenyamanan mata pengunjung umum.

`[FOTO SCREENSHOT: CONTOH GAMBAR AKTIVITAS / BANNER YAYASAN]`

---

## 10. Responsive Design

Layout website diimplementasikan menggunakan flexbox dan grid responsif Tailwind CSS yang menyesuaikan 3 batas layar (*breakpoints*):

1. **Desktop (≥ 1024 px)**:
   * Grid layout penuh (3 sampai 4 kolom).
   * Tampilan menu utama navbar terbuka horizontal secara utuh.
   * Ilustrasi banner berukuran besar terlihat jelas di sisi kanan hero.

2. **Tablet (768 px – 1023 px)**:
   * Grid layout menyusut (2 kolom).
   * Menu navbar disembunyikan di dalam hamburger drawer menu samping.
   * Ukuran padding halaman disesuaikan agar tetap proporsional.

3. **Mobile (≤ 767 px)**:
   * Tata letak diatur satu kolom bertumpuk ke bawah (*single column stack*).
   * Ukuran font utama dikecilkan, area tombol sentuh diperbesar agar ramah jari pengguna ponsel.

`[FOTO SCREENSHOT: RESPONSIVE DESKTOP, TABLET, & MOBILE]`
