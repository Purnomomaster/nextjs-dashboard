export type Pegawai = {
    id: number;
    nip: string;
    nama: string;
    tempat_lahir?: string;
    tanggal_lahir?: string; // Format ISO (YYYY-MM-DD)
    jenis_kelamin: 'Laki-laki' | 'Perempuan';
    alamat?: string;
    no_telp?: string;
    email?: string;
    status_pernikahan?: 'Lajang' | 'Menikah' | 'Duda' | 'Janda';
    foto_profil?: string;
    id_jabatan?: number;
    tanggal_bergabung: string; // Format ISO
    status_karyawan: 'Tetap' | 'Kontrak' | 'Magang' | 'Freelance';
    lokasi_kerja?: string;
    shift_kerja?: string;
    rekening_bank?: string;
    npwp?: string;
    kontak_darurat?: string;
    hubungan_darurat?: string;
    no_darurat?: string;
    created_at: string; // Format ISO
    updated_at: string; // Format ISO
  };
  export type Jabatan = {
    id: number;
    nama_jabatan: string;
    departemen: string;
    gaji_pokok: number;
    tunjangan: number;
  };
  export type Absensi = {
    id: number;
    id_pegawai: number;
    tanggal: string; // Format ISO (YYYY-MM-DD)
    waktu_masuk?: string; // Format (HH:MM:SS)
    waktu_pulang?: string; // Format (HH:MM:SS)
    status_kehadiran: 'Hadir' | 'Izin' | 'Sakit' | 'Cuti' | 'Alfa';
    lokasi_absensi?: string;
    foto_absensi?: string;
    created_at: string; // Format ISO
  };
  export type Penggajian = {
    id: number;
    id_pegawai: number;
    bulan_gaji: string; // Format ISO (YYYY-MM-DD)
    gaji_pokok: number;
    tunjangan: number;
    bonus: number;
    potongan: number;
    total_gaji: number;
    tanggal_pembayaran?: string; // Format ISO
    status_pembayaran: 'Dibayar' | 'Belum Dibayar' | 'Pending';
    metode_pembayaran: 'Transfer Bank' | 'Tunai' | 'E-Wallet';
    created_at: string; // Format ISO
  };
  export type User = {
    id: number;
    id_pegawai?: number;
    username: string;
    password: string;
    role: 'Admin' | 'HRD' | 'Pegawai';
    last_login?: string; // Format ISO
    token_auth?: string;
    created_at: string; // Format ISO
    updated_at: string; // Format ISO
  };
  export type PegawaiWithJabatan = Pegawai & {
    jabatan?: Jabatan;
  };
  
  export type AbsensiWithPegawai = Absensi & {
    pegawai?: Pegawai;
  };
  
  export type PenggajianWithPegawai = Penggajian & {
    pegawai?: Pegawai;
  };
            