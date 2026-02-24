
DROP TABLE IF EXISTS perusahaan;

-- TABLE DEFINITION
CREATE TABLE perusahaan (
    id_perusahaan TEXT PRIMARY KEY,
    id_pengguna TEXT, -- Owner
    nama TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    video_profil TEXT, 
    deskripsi TEXT,
    
    -- Split Address
    provinsi TEXT,
    kota TEXT,
    kecamatan TEXT,
    kelurahan TEXT,
    jalan TEXT,
    kode_pos TEXT,
    
    website_url TEXT,
    industri TEXT,
    ukuran_perusahaan TEXT,
    promosi TEXT DEFAULT 'Inactive', 
    verifikasi TEXT DEFAULT 'proses', -- NEW: proses, ditolak, disetujui
    tagline TEXT,
    tahun_berdiri TEXT,
    email_kontak TEXT,
    
    -- Contact Details (Sanitized)
    nomor_telepon TEXT, -- 021xxxx (Office)
    fax TEXT, -- New
    whatsapp TEXT, -- New: 628xxxx (Sim/WA)
    
    -- Split Vision Mission
    visi TEXT,
    misi TEXT,
    
    -- New: Struktural (Array JSON: [{foto, nama, jabatan}])
    struktural TEXT DEFAULT '[]',
    
    -- New: Popup Sambutan
    popup_sambutan TEXT DEFAULT 'Inactive', -- Active/Inactive
    ukuran_banner_url TEXT,
    ukuran_banner_sambutan TEXT, -- Ratio e.g. "4:3"
    teks_sambutan TEXT,
    tombol_ajakan TEXT, -- Label button
    link_ajakan TEXT,   -- Hyperlink
    
    -- Split Social Media
    linkedin TEXT,
    instagram TEXT,
    facebook TEXT,
    
    -- JSON Columns
    teknologi TEXT,
    penghargaan TEXT,
    galeri TEXT,

    dilihat INTEGER DEFAULT 0,
    
    created_at INTEGER,
    updated_at INTEGER
);

-- SEED DATA
INSERT OR IGNORE INTO perusahaan (
    id_perusahaan, id_pengguna, nama, slug, logo_url, banner_url, video_profil, deskripsi, 
    provinsi, kota, kecamatan, kelurahan, jalan, kode_pos,
    website_url, industri, ukuran_perusahaan, promosi, verifikasi, tagline, 
    tahun_berdiri, email_kontak, nomor_telepon, fax, whatsapp,
    visi, misi, struktural,
    popup_sambutan, ukuran_banner_url, ukuran_banner_sambutan, teks_sambutan, tombol_ajakan, link_ajakan,
    linkedin, instagram, facebook,
    teknologi, penghargaan, galeri,
    dilihat, created_at, updated_at
) VALUES 
(
    'c1', 'user-001', 'TechNova Indonesia', 'technova-indonesia', 
    'https://placehold.co/200x200/2563eb/ffffff?text=TechNova', 
    'https://placehold.co/800x400/1e3a8a/ffffff?text=TechNova+Office', 
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Perusahaan teknologi terdepan yang fokus pada pengembangan solusi AI dan Cloud Computing.', 
    'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Senayan', 'Jl. Sudirman Kav 52-53, SCBD', '12190',
    'https://technova.id', 'Teknologi', '50-100 Karyawan', 'Active', 'disetujui',
    'Innovating for a Better Future', '2015', 'hr@technova.id', '0215550123', '0215550124', '6281122334455',
    'Menjadi pemimpin global dalam solusi kecerdasan buatan.',
    '1. Mengembangkan talenta digital terbaik.\n2. Menciptakan produk yang berdampak positif.',
    '[{"foto": "https://placehold.co/100x100?text=CEO", "nama": "Budi Santoso", "jabatan": "CEO"}, {"foto": "https://placehold.co/100x100?text=CTO", "nama": "Andi Wijaya", "jabatan": "CTO"}]',
    'Active', 'https://placehold.co/600x400/1e3a8a/ffffff?text=Promo+Popup', '3:2', 'Selamat datang di halaman resmi TechNova. Dapatkan penawaran karir eksklusif bulan ini.', 'Lihat Lowongan', '/perusahaan/technova-indonesia/jobs',
    'https://linkedin.com/company/technova', 'https://instagram.com/technova_id', 'https://facebook.com/technova',
    '["Artificial Intelligence", "Cloud Computing", "Big Data", "React.js", "Python"]', 
    '[{"judul": "Best Tech Startup 2023", "lembaga": "Tech Asia Awards", "tahun": "2023"}]', 
    '["https://placehold.co/600x600/1e293b/ffffff?text=Office+Environment", "https://placehold.co/600x600/3b82f6/ffffff?text=Team+Meeting"]',
    1205,
    1716182400000,
    1716182400000
),
(
    'c2', 'user-002', 'Creative Studio', 'creative-studio', 
    'https://placehold.co/200x200/e11d48/ffffff?text=Creative', 
    'https://placehold.co/800x400/881337/ffffff?text=Creative+Studio+Space', 
    NULL,
    'Agensi digital kreatif yang membantu brand bertumbuh melalui desain dan strategi konten.', 
    'Jawa Barat', 'Bandung', 'Sumur Bandung', 'Braga', 'Jl. Braga No. 99', '40111',
    'https://creativestudio.id', 'Agensi Kreatif', '10-50 Karyawan', 'Active', 'proses',
    'Art meets Data', '2018', 'hello@creativestudio.id', '0224445678', NULL, '6281299887766',
    'Menjadi kiblat kreativitas digital di Asia Tenggara.',
    'Menggabungkan seni visual dengan data analitik untuk hasil maksimal.',
    '[{"foto": "https://placehold.co/100x100?text=AD", "nama": "Citra Lestari", "jabatan": "Art Director"}]',
    'Inactive', NULL, NULL, NULL, NULL, NULL,
    NULL, 'https://instagram.com/creativestudio', NULL,
    '["Adobe Creative Cloud", "Figma", "Blender 3D"]', 
    '[{"judul": "Best Creative Agency West Java", "lembaga": "Bandung Creative Hub", "tahun": "2023"}]', 
    '["https://placehold.co/600x600/e11d48/ffffff?text=Design+Studio"]',
    890,
    1716268800000,
    1716268800000
);
