
DROP TABLE IF EXISTS notifikasi;

-- TABLE DEFINITION
CREATE TABLE notifikasi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kepada TEXT, -- user_id penerima
    dari TEXT, -- user_id pengirim / company_id / "Admin"
    type TEXT NOT NULL, 
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Action Button
    tombol_ajakan TEXT, -- Renamed from ajakan. If filled, implies Active.
    deskripsi_ajakan TEXT,
    hyperlink TEXT, -- Target URL
    
    created_at INTEGER 
);

-- SEED DATA
INSERT INTO notifikasi (kepada, dari, type, title, message, tombol_ajakan, deskripsi_ajakan, hyperlink, created_at) VALUES 
('t1', 'Admin', 'success', 'Lamaran Terkirim', 'Lamaran Anda untuk posisi Senior Frontend Engineer di TechNova telah berhasil dikirim.', NULL, NULL, NULL, 1716355200000),
('t1', 'System', 'info', 'Rekomendasi Lowongan Baru', 'Ada 5 lowongan React Developer baru di area Jakarta Selatan yang sesuai dengan preferensi Anda.', 'Lihat Lowongan', 'Cek sekarang sebelum ditutup', '/pekerjaan?q=react', 1716348000000),
('t1', 'c1', 'warning', 'Panggilan Interview', 'TechNova mengundang Anda untuk interview tahap 1. Silakan cek detail jadwal dan konfirmasi kehadiran.', 'Lihat Jadwal', 'Konfirmasi kehadiran Anda', '/user/applications', 1716268800000),
('t1', 'Admin', 'system', 'Selamat Datang di KarirKita', 'Akun Anda berhasil dibuat. Mulai eksplorasi karir impian Anda.', NULL, NULL, NULL, 1716096000000);
