
DROP TABLE IF EXISTS lowongan;

-- TABLE DEFINITION
CREATE TABLE lowongan (
    id_lowongan TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    posisi TEXT NOT NULL,
    id_perusahaan TEXT NOT NULL,
    banner TEXT,
    
    -- Detailed Location Fields (Replacing single lokasi string)
    provinsi TEXT,
    kota TEXT,
    kecamatan TEXT,
    kelurahan TEXT,
    jalan TEXT,
    kode_pos TEXT,
    
    maps TEXT, 
    tipe_pekerjaan TEXT, -- 'Karyawan Tetap', 'Kontrak', 'Magang', etc.
    sistem_kerja TEXT, -- 'WFH', 'WFO', 'Hybrid', 'Shift', 'On-site', etc.
    sistem_gaji TEXT, -- 'Bulanan', 'Harian', 'Proyek', etc.
    pendidikan_minimal TEXT,
    rentang_gaji TEXT,
    deskripsi_pekerjaan TEXT,
    
    -- JSON Columns
    kualifikasi TEXT,
    fasilitas TEXT,
    
    -- Submission Type
    jenis_submit TEXT DEFAULT 'karirkita', -- 'walk_interview', 'karirkita', 'custom'
    kontak TEXT, -- JSON array of contact objects: [{atas_nama, tipe, nilai}]
    
    -- Tracking
    lamaran TEXT DEFAULT '[]',
    interview TEXT DEFAULT '[]',
    
    promosi TEXT DEFAULT 'Inactive', 
    status TEXT DEFAULT 'Active',
    dilihat INTEGER DEFAULT 0,
    
    created_at INTEGER,
    updated_at INTEGER
);

-- SEED DATA
INSERT OR IGNORE INTO lowongan (
    id_lowongan, slug, posisi, id_perusahaan, banner, 
    provinsi, kota, kecamatan, kelurahan, jalan, kode_pos,
    maps, tipe_pekerjaan, sistem_kerja, sistem_gaji, pendidikan_minimal, rentang_gaji, 
    deskripsi_pekerjaan, kualifikasi, fasilitas, 
    jenis_submit, kontak,
    lamaran, interview,
    promosi, status, dilihat,
    created_at, updated_at
) VALUES
(
    'j1', 'operator-produksi-otomotif', 'Operator Produksi', 'c1', 
    'https://placehold.co/800x400/1e40af/ffffff?text=Production+Line', 
    'Jawa Barat', 'Purwakarta', 'Bungursari', 'Cibungur', 'Kawasan BIC', '41181',
    'https://maps.google.com/?q=BIC+Purwakarta',
    'Kontrak', 'Shift', 'Bulanan', 'SMA/SMK', '5750000', 
    'Mencari operator produksi untuk line assembling komponen otomotif. Kandidat akan bekerja dalam sistem shift.', 
    '["Pendidikan min. SMA/SMK Sederajat", "Usia maksimal 24 tahun", "Bersedia bekerja shift"]', 
    '["Jemputan Karyawan", "Makan Siang / Catering", "BPJS Kesehatan & Ketenagakerjaan"]', 
    'karirkita', NULL,
    '[{"user_id": "t1", "timestamp": 1716182400000}]',
    '[]',
    'Active', 'Active', 1250,
    1716182400000, 1716182400000
),
(
    'j2', 'staff-administrasi-gudang', 'Staff Administrasi Gudang', 'c2', 
    'https://placehold.co/800x400/be123c/ffffff?text=Admin+Office', 
    'Jawa Barat', 'Purwakarta', 'Babakancikao', 'Ciwareng', 'Jl. Raya Sadang', '41151',
    'https://maps.google.com/?q=Sadang+Purwakarta',
    'Karyawan Tetap', 'WFO', 'Bulanan', 'D3', '5500000', 
    'Bertanggung jawab atas pencatatan keluar masuk barang dan stok opname.', 
    '["Menguasai Microsoft Excel (VLOOKUP, Pivot)", "Teliti dan rapi", "Pengalaman admin gudang min 1 tahun"]', 
    '["Tunjangan Transport", "Bonus Tahunan", "Asuransi Kesehatan Swasta"]', 
    'karirkita', NULL,
    '[{"user_id": "t1", "timestamp": 1716268800000}]',
    '[{"user_id": "t1", "timestamp": 1716268800000, "pesan": "Selamat, Anda diundang interview tahap 1", "jadwal": 1716355200000}]',
    'Active', 'Active', 890,
    1716268800000, 1716268800000
);
