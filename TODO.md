# TODO - WasteBank (Supabase SQL + Pemisahan Form)

## Step 1 — SQL Supabase (CREATE TABLE)
- [ ] Buat tabel `ulasan` (pengganti `guestbook`), termasuk kolom: name, initials, email, category, message, date, image, status opsional
- [ ] Buat tabel `aduan` (laporan tumpukan sampah liar), termasuk kolom minimal: reporter, category, description, date, status, koordinat, image
- [ ] Buat tabel `permohonan` (edukasi & sosialisasi)
- [ ] Buat tabel relasi jenis sampah BSU: `bank_sampah_jenis` untuk menggantikan localStorage
- [ ] Pastikan koordinat tersimpan sebagai `text` format `lat,lon`
- [ ] Tambahkan index + basic constraint (NOT NULL, CHECK status)

## Step 2 — Frontend Route & Pages
- [ ] Tambah route `/aduan-liar` di `src/App.jsx`
- [ ] Buat halaman `src/pages/AduanLiarPage.jsx` (form + tombol kembali ke list layanan)
- [ ] Ubah `GuestBookPage.jsx` agar hanya mengarah ke tabel `ulasan`
- [ ] Ubah `LayananPublikPage.jsx` agar menulis `permohonan` ke Supabase (bukan local dummy)

## Step 3 — Admin Console
- [ ] Ubah tabs di `AdminDashboardPage.jsx` jadi: Ulasan, Permohonan, Aduan
- [ ] Pastikan admin list menampilkan dari tabel yang benar (`ulasan`, `permohonan`, `aduan`)
- [ ] Status update & delete untuk `aduan`
- [ ] Buat tombol hapus untuk `ulasan` dan `permohonan`

## Step 4 — Admin Bank Sampah
- [ ] Tambahkan field `coordinates` pada modal edit BSU dan ikut update ke DB
- [ ] Tambahkan tampilan “jenis sampah” dari tabel `bank_sampah_jenis` (bukan localStorage)
- [ ] Pastikan saat add/update BSU, jenis sampah juga tersimpan ke `bank_sampah_jenis`

## Step 5 — Testing
- [ ] Cek submit Buku Tamu menambah data di `ulasan` dan tampil di admin tab Ulasan
- [ ] Cek submit Aduan Liar menambah data di `aduan` dan status update terlihat di admin
- [ ] Cek submit Permohonan Edukasi menambah data di `permohonan` dan tampil di admin tab Permohonan
- [ ] Cek admin BSU: edit koordinat tersimpan dan jenis sampah tampil benar

