`CREATE TABLE pegawai (
    id SERIAL PRIMARY KEY,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE,
    jenis_kelamin VARCHAR(10) CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    alamat TEXT,
    no_telp VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    status_pernikahan VARCHAR(20) CHECK (status_pernikahan IN ('Lajang', 'Menikah', 'Duda', 'Janda')),
    foto_profil TEXT,
    id_jabatan INT REFERENCES jabatan(id) ON DELETE SET NULL,
    tanggal_bergabung DATE NOT NULL,
    status_karyawan VARCHAR(20) CHECK (status_karyawan IN ('Tetap', 'Kontrak', 'Magang', 'Freelance')),
    lokasi_kerja VARCHAR(100),
    shift_kerja VARCHAR(50),
    rekening_bank VARCHAR(50),
    npwp VARCHAR(25),
    kontak_darurat VARCHAR(100),
    hubungan_darurat VARCHAR(50),
    no_darurat VARCHAR(15),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE absensi (
    id SERIAL PRIMARY KEY,
    id_pegawai INT REFERENCES pegawai(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    waktu_masuk TIME,
    waktu_pulang TIME,
    status_kehadiran VARCHAR(20) CHECK (status_kehadiran IN ('Hadir', 'Izin', 'Sakit', 'Cuti', 'Alfa')),
    lokasi_absensi TEXT,
    foto_absensi TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE jabatan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) UNIQUE NOT NULL,
    deskripsi TEXT,
    gaji_pokok INT NOT NULL,
    tunjangan_jabatan INT,
    tunjangan_makan INT,
    tunjangan_transport INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE penggajian (
    id SERIAL PRIMARY KEY,
    id_pegawai INT REFERENCES pegawai(id) ON DELETE CASCADE,
    bulan_gaji DATE NOT NULL,
    gaji_pokok DECIMAL(15,2) NOT NULL,
    tunjangan DECIMAL(15,2) DEFAULT 0,
    bonus DECIMAL(15,2) DEFAULT 0,
    potongan DECIMAL(15,2) DEFAULT 0,
    total_gaji DECIMAL(15,2) NOT NULL,
    tanggal_pembayaran DATE,
    status_pembayaran VARCHAR(20) CHECK (status_pembayaran IN ('Dibayar', 'Belum Dibayar', 'Pending')),
    metode_pembayaran VARCHAR(50) CHECK (metode_pembayaran IN ('Transfer Bank', 'Tunai', 'E-Wallet')),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    id_pegawai INT UNIQUE REFERENCES pegawai(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin', 'HRD', 'Pegawai')),
    last_login TIMESTAMP,
    token_auth TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;
