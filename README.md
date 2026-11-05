# Aplikasi Absensi Peserta Magang

Aplikasi web sederhana untuk mencatat absensi peserta magang.
Dibuat dengan **Laravel**, **Inertia.js**, **React**, dan **MySQL**.

## Fitur

**Peserta magang**
- Login
- Check-in dan check-out harian (1x per hari)
- Status otomatis: tepat waktu / terlambat (batas 08:00)
- Riwayat absensi pribadi

**Admin**
- Dashboard ringkasan (total peserta, hadir, terlambat, belum check-in)
- Kelola peserta magang (tambah, ubah, hapus, cari)
- Laporan absensi dengan filter peserta dan rentang tanggal
- Durasi kerja otomatis
- Export laporan ke CSV

## Teknologi

Laravel, React (Inertia.js), Tailwind CSS, Vite, MySQL

## Cara Menjalankan

Prasyarat: PHP 8.2+, Composer, Node.js, MySQL (misalnya via Laragon).

```bash
git clone https://github.com/<username>/absensi-magang.git
cd absensi-magang

composer install
npm install --legacy-peer-deps

copy .env.example .env
php artisan key:generate
```

Buat database kosong bernama `absensi_magang`, lalu sesuaikan `.env`:

```env
DB_DATABASE=absensi_magang
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan migrasi dan data contoh, lalu server:

```bash
php artisan migrate --seed
npm run dev          # terminal 1
php artisan serve    # terminal 2
```

Buka http://127.0.0.1:8000

## Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | password |
| Peserta | peserta1@example.com | password |

## Catatan

- Registrasi publik dinonaktifkan. Akun peserta dibuat oleh admin.
- Batas keterlambatan bisa diubah di `AttendanceController` (default 08:00).