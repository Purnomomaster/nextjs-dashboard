## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.


____________________________________________________________________________________________________
add feature
# setelah dipelajari, berikut arsitektur pada next js yang mendekati MVC
# controller pada next js adalah file yang berada pada folder pages/api(sekarang app)
# controller tersebut bekerja dengan istilah page, layout, dan folder yang memiliki nama unik. perlu dipelajari lebih lanjut. dan apakah bisa bekerja dengan model contoh /dashboard/call akan memanggil folder atau langsung file?
# controller yang saya temukan digunakan untuk menerima sebagai api dan memaggil view dan model digunakan sebagai logic untuk menerima data dari view yang dibuat oleh controller
# model pada next js bisa menyesuaikan karena logic dapat di impor dari folder manapun contoh action.ts yang terdapat pada folder lib
# view pada next js merupakan hal yang sama dengan model namun umumnya bisa berada di folder ui yang dipanggil oleh file yang berada pada controller
# arsitektur view sangat fleksibel bisa mengambil data dan langsung menampilkannya di situ juga
# jadi yang perlu dimodifikasi hanya model


# dapatkan uri dan sesuaikan semua import!!!!!!!! tidak bisa karena import di javascript harus hardcode

# input buat berbagai macam:
# 1. text, OK
# 2. angka, OK
# 3. tanggal, OK
# 4. textarea, OK
# 5. summernote
# 6. checkbox, OK
# 7. checkboxgroup
# 8. radiogroup
# 9. radiobutton
# 10. gambar, OK
# 11. file, OK
# 12. select, OK

# Buatmenu
# 1. petakan menu dengan tabel
# 2. buat bagian lain juga di copy paste seperti action dan lainnya
# 3. buat soft delete
# >> tes inputan invoices yang sudah dinamis
# >> cari cara agar bisa menerima inputan secara dinamis di model invoices.ts

# buat user

# Level

# download excel

# upload excel

# use library react table, to mimic data table

# sekalian proyek absensi
# Berikut adalah daftar menu utama untuk aplikasi absensi berbasis website menggunakan Next.js dan PostgreSQL:

# 1. Dashboard
# Ringkasan kehadiran karyawan/mahasiswa
# Statistik absensi (grafik harian, mingguan, bulanan)
# Notifikasi keterlambatan atau ketidakhadiran
# 2. Manajemen Pengguna
# Daftar pengguna (karyawan/mahasiswa)
# Tambah, edit, hapus pengguna
# Pengaturan peran (admin, karyawan, dosen, mahasiswa, dll.)
# 3. Absensi
# Check-in & Check-out (manual atau otomatis via lokasi/IP)
# Rekapitulasi absensi harian
# Fitur validasi lokasi (GPS) atau IP jaringan
# 4. Jadwal & Shift
# Pengaturan jam kerja atau jadwal kuliah
# Manajemen shift kerja (jika diperlukan)
# Notifikasi perubahan jadwal
# 5. Laporan & Rekapitulasi
# Rekap absensi per periode
# Download laporan dalam format Excel/PDF
# Filter berdasarkan pengguna, tanggal, atau departemen
# 6. Pengajuan Izin & Cuti
# Form pengajuan izin atau cuti
# Status persetujuan (disetujui, ditolak, pending)
# Manajemen data izin/cuti
# 7. Pengaturan
# Konfigurasi sistem (jam kerja, batas keterlambatan, dsb.)
# Manajemen hak akses per peran
# Integrasi dengan API pihak ketiga (jika diperlukan)




# Berikut adalah alur pengerjaan pengembangan aplikasi absensi berbasis Next.js dan PostgreSQL, disusun berdasarkan prioritas dan ketergantungan fitur:

# Tahap 1: Setup & Persiapan Awal
# Inisialisasi Project

# Setup Next.js
# Konfigurasi PostgreSQL dengan ORM (Prisma/Sequelize)
# Setup autentikasi (NextAuth atau JWT)
# Struktur folder proyek
# Desain Database

# Buat skema database (Users, Attendance, Schedules, Leaves, dll.)
# Buat tabel dan relasi dalam PostgreSQL
# Tahap 2: Manajemen Pengguna
# Membuat Fitur Manajemen Pengguna
# 0. upgrade ke next 15, "Clear"
# 1. perbaiki menu produk agar sepenuhnya dinamis, ==> form tidak perlu dinamis ambil saja dari shadcdn, selanjutnya memperbaiki /model/product agar bisa menerima data sesuai dengan inputbuilder, OK
# 2. perbaiki menu copy agar sepenuhnya memudahkan copy paste
# >>>>>>>>>>>>>>sampai sini: {2.1}
# 2.1 membuat navigasi dinamis dan level pada navigasi (serta membuat kolom inputan untuk nama controller dan level menu {membuat button untuk input level 1,2 dan 3 berupa pop up}), /proses pembuatan lv2 tapi masih bingung karena bagaimana cara menampilkannya/
# 2.2 ketika error saat membuat folder maka batalkan membuat data di database, "OK"
# 2.3 juga otomasikan pembuatan tabel, "OK"
# 2.4 tambahkan edit {name, end, idfrom, icon, lv1, lv2, lv3} dan delete{berhasil soft delete} serta delete file, "OK"
# 2.5 Menu authority {schema /id,idmenu,see/} --> sakarang sudah update bagian tampilan yang telah dicentang dan update data didb, sekarang update ke bagian detailnya!!!
# 3. bisa input secara pop up untuk menu jabatan
# CRUD user (admin, karyawan, mahasiswa, dosen, dll.)
# Pengaturan role & permission
# Autentikasi & Otorisasi

# Login/logout
# Middleware proteksi halaman berdasarkan role
# Tahap 3: Absensi & Validasi Data
# Fitur Absensi

# Check-in & check-out
# Validasi waktu & lokasi (GPS/IP)
# Catatan keterlambatan
# Jadwal & Shift

# CRUD jadwal kerja atau kuliah
# Integrasi dengan sistem absensi
# Tahap 4: Rekapitulasi & Laporan
# Laporan & Rekapitulasi
# Rekap absensi per periode
# Export laporan (Excel/PDF)
# Filter berdasarkan user, tanggal, atau departemen
# Tahap 5: Pengajuan Izin & Cuti
# Fitur Pengajuan Izin & Cuti
# Form pengajuan izin/cuti
# Workflow persetujuan oleh atasan/admin
# Tampilan status izin
# Tahap 6: Pengaturan & Finalisasi
# Pengaturan Sistem

# Konfigurasi jam kerja, keterlambatan, dsb.
# Manajemen hak akses per peran
# Testing & Deployment

# Uji coba semua fitur
# Deployment ke server (Vercel, Railway, atau VPS)