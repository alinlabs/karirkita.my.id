
DROP TABLE IF EXISTS pengguna;

-- TABLE DEFINITION
CREATE TABLE pengguna (
    id_pengguna TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT 'password123',
    nama_lengkap TEXT NOT NULL,
    headline TEXT,
    email_kontak TEXT UNIQUE,
    telepon_kontak TEXT UNIQUE, -- Format: 628... (No spaces/dashes)
    
    -- Split Place/Date Birth
    tempat_lahir TEXT,
    tanggal_lahir TEXT,
    
    -- Media
    foto_profil TEXT,
    banner TEXT,
    tanda_tangan TEXT,
    video_profil TEXT, -- New: Video Profile URL
    
    tentang_saya TEXT,
    
    -- Address breakdown
    provinsi TEXT,
    kota TEXT,
    kecamatan TEXT,
    kelurahan TEXT,
    jalan TEXT,
    rt TEXT,
    rw TEXT,
    kode_pos TEXT,
    
    -- Status & Promo
    aktifkan_label TEXT DEFAULT 'Active', -- Renamed from status_saja (Active/Inactive)
    status_ketersediaan TEXT DEFAULT 'job_seeking',
    promosi TEXT DEFAULT 'Inactive',
    verifikasi TEXT DEFAULT 'proses', -- NEW: proses, ditolak, disetujui
    
    -- JSON Columns (Profile Data)
    keahlian TEXT,
    keahlian_detail TEXT,
    sosial_media TEXT,
    layanan TEXT,
    portofolio TEXT,
    sertifikasi TEXT,
    organisasi TEXT,
    pengalaman_kerja TEXT,
    riwayat_pendidikan TEXT,
    galeri_kegiatan TEXT,
    
    dilihat INTEGER DEFAULT 0,
    
    created_at INTEGER, 
    updated_at INTEGER
);

-- SEED DATA
INSERT OR IGNORE INTO pengguna (
    id_pengguna, username, password, nama_lengkap, headline, email_kontak, telepon_kontak, 
    tempat_lahir, tanggal_lahir, foto_profil, banner, tanda_tangan, video_profil,
    tentang_saya, provinsi, kota, kecamatan, kelurahan, jalan, rt, rw, kode_pos, 
    aktifkan_label, status_ketersediaan, promosi, verifikasi,
    keahlian, keahlian_detail, sosial_media, layanan, portofolio, sertifikasi, organisasi, 
    pengalaman_kerja, riwayat_pendidikan, galeri_kegiatan,
    dilihat, created_at, updated_at
) VALUES (
    't1', 
    'sarahdev', 
    'password123',
    'Sarah Putri', 
    'Frontend Developer', 
    'sarah@example.com', 
    '6281234567890', -- Sanitized Phone
    'Surabaya', 
    '1998-05-14', 
    'https://placehold.co/400x400/2563eb/ffffff?text=SP', 
    'https://placehold.co/1200x400/1e3a8a/ffffff?text=Coding+Setup', 
    'https://placehold.co/300x150/ffffff/000000?text=Sarah+Signature', 
    'https://www.youtube.com/embed/dQw4w9WgXcQ', -- Video Profil
    'Frontend Developer yang passionate dengan React ecosystem dan User Experience.\nSaya berfokus pada performa aplikasi dan skalabilitas kode. Berpengalaman dalam memimpin tim kecil dan berkolaborasi dengan desainer.', 
    'Jawa Timur', 'Surabaya', 'Sukolilo', 'Keputih', 'Jl. Teknik Kimia', '02', '05', '60111', 
    'Active', 'job_seeking', 'Active', 'disetujui',
    '["React", "TypeScript", "Tailwind CSS"]', 
    '[{"name": "React", "level": 90, "category": "hard_skill", "displayMode": "percent"}, {"name": "TypeScript", "level": 85, "category": "hard_skill", "displayMode": "percent"}, {"name": "Tailwind CSS", "level": 95, "category": "hard_skill", "displayMode": "percent"}, {"name": "Komunikasi", "level": 80, "category": "soft_skill", "displayMode": "label"}, {"name": "Kepemimpinan", "level": 75, "category": "soft_skill", "displayMode": "label"}, {"name": "Bahasa Indonesia", "level": 100, "category": "language", "displayMode": "label"}, {"name": "English", "level": 85, "category": "language", "displayMode": "percent"}]',
    '{"github_url": "https://github.com/sarahdev", "linkedin_url": "https://linkedin.com/in/sarahdev", "website_url": "https://sarah.dev", "instagram_url": "https://instagram.com/sarah.codes"}',
    '[{"id": "s1", "judul": "Jasa Pembuatan Website Company Profile", "deskripsi": "Paket pembuatan website profesional menggunakan React & Tailwind. Cocok untuk UMKM dan perusahaan.", "harga": "3500000", "harga_coret": "5000000", "thumbnail_url": "https://placehold.co/400x300/2563eb/ffffff?text=Web+Dev", "fitur": ["Desain Responsif", "SEO Basic", "Domain & Hosting 1 Tahun", "Revisi 3x"]}, {"id": "s2", "judul": "Konsultasi Optimasi Performa Web", "deskripsi": "Analisis dan perbaikan performa website untuk meningkatkan Core Web Vitals dan SEO.", "harga": "1500000", "thumbnail_url": "https://placehold.co/400x300/10b981/ffffff?text=Performance", "fitur": ["Audit Lighthouse", "Optimasi Gambar", "Code Splitting", "Laporan PDF"]}]',
    '[{"id": "p1", "judul": "E-Commerce Dashboard Optimization", "deskripsi": "Optimasi performa dashboard analitik untuk klien ritel besar. Fokus pada pengurangan load time dan interaktivitas data real-time.", "gambar_url": "https://placehold.co/800x500/e2e8f0/64748b?text=Dashboard+Main", "banner_custom_url": "https://placehold.co/800x500/1e293b/ffffff?text=Dashboard+Cover", "galeri_url": ["https://placehold.co/800x500/3b82f6/ffffff?text=Analytics+View", "https://placehold.co/800x500/10b981/ffffff?text=Mobile+Responsive", "https://placehold.co/800x500/f59e0b/ffffff?text=Dark+Mode"], "tautan_eksternal": "https://github.com/sarahdev/dashboard", "metrik": [{"tipe": "bar", "judul": "Efisiensi Performa (Lighthouse)", "data": [{"label": "Sebelum", "nilai": 45}, {"label": "Sesudah", "nilai": 98}]}, {"tipe": "circle", "judul": "Client Satisfaction", "data": [{"label": "NPS Score", "nilai": 90, "deskripsi": "Sangat Puas"}]}]}, {"id": "p2", "judul": "Travel Booking App Animation", "deskripsi": "Showcase animasi interaktif untuk aplikasi travel menggunakan Framer Motion. Video demo tersedia.", "gambar_url": "https://placehold.co/800x500/3b82f6/ffffff?text=Travel+App+Thumb", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "metrik": [{"tipe": "circle", "judul": "User Engagement", "data": [{"label": "Avg. Session", "nilai": 85, "deskripsi": "Meningkat 85%"}]}]}]',
    '[{"id": "a1", "judul": "AWS Certified Solutions Architect", "penerbit": "Amazon Web Services", "tanggal": "2023", "credential_id": "AWS-12345678", "sertifikat_url": "#", "tautan_sertifikat": "https://aws.amazon.com/verification", "deskripsi": "Sertifikasi profesional untuk perancangan sistem terdistribusi di AWS."}, {"id": "a2", "judul": "Juara 1 Hackathon Finhacks", "penerbit": "Bank BCA", "tanggal": "2022", "deskripsi": "Membangun solusi pembayaran QRIS offline-first."}]',
    '[{"id": "org1", "nama_organisasi": "Himpunan Mahasiswa Informatika", "peran": "Ketua Divisi IPTEK", "tanggal_mulai": "2020", "tanggal_selesai": "2021", "logo_url": "https://placehold.co/100x100/1e293b/ffffff?text=HMIF", "tautan_sertifikat": "https://drive.google.com/file/d/xxxxx", "deskripsi": "Mengadakan workshop coding mingguan untuk 100+ mahasiswa."}, {"id": "org2", "nama_organisasi": "Google Developer Student Clubs", "peran": "Core Team Member", "tanggal_mulai": "2019", "tanggal_selesai": "2020", "logo_url": "https://placehold.co/100x100/ea4335/ffffff?text=GDSC", "deskripsi": "Memfasilitasi event Google Cloud Study Jam."}]',
    '[{"id": "e1", "posisi": "Junior Frontend Dev", "nama_perusahaan": "Startup A", "logo_perusahaan_url": "https://placehold.co/100x100/2563eb/ffffff?text=SA", "sosial_media_perusahaan": "https://instagram.com/startupa", "tanggal_mulai": "2022", "tanggal_selesai": "2023", "deskripsi": "Mengembangkan fitur utama website menggunakan Vue.js dan mengintegrasikan Payment Gateway.", "tanggung_jawab": ["Membangun reusable component library menggunakan Vue 3.", "Melakukan migrasi kode legacy dari jQuery ke Vue.js.", "Bekerja sama dengan tim backend untuk integrasi REST API.", "Optimasi load time website hingga 40% lebih cepat."], "pencapaian": ["Employee of the Month - Juni 2022", "Berhasil menaikkan conversion rate checkout sebesar 15%."], "referensi": {"nama": "Budi Santoso", "posisi": "CTO Startup A", "tipe_kontak": "email", "kontak": "budi@startupa.com"}, "tautan_paklaring": "https://drive.google.com/file/d/xxxxx"}]',
    '[{"id": "edu1", "nama_institusi": "Universitas Indonesia", "logo_institusi_url": "https://placehold.co/100x100/f59e0b/ffffff?text=UI", "gelar": "Sarjana (S1)", "bidang_studi": "Ilmu Komputer", "tanggal_mulai": "2018", "tanggal_selesai": "2022", "deskripsi": "Lulus dengan predikat Cum Laude. Fokus pada Software Engineering dan AI.", "prestasi": ["Ketua Himpunan Mahasiswa 2021", "Asisten Dosen Pemrograman Web", "Best Capstone Project Award"]}]',
    '["https://placehold.co/600x400/1e293b/ffffff?text=Speaking+at+Event", "https://placehold.co/600x400/3b82f6/ffffff?text=Team+Meeting", "https://placehold.co/600x400/0f172a/ffffff?text=Workspace"]',
    151,
    1716182400000,
    1716182400000
),
(
    't2', 
    'ahmad_design', 
    'password123',
    'Ahmad Rizky', 
    'UI/UX Designer', 
    'ahmad@example.com', 
    '6281234567891', 
    'Bandung', 
    '1999-08-20', 
    'https://placehold.co/400x400/10b981/ffffff?text=AR', 
    'https://placehold.co/1200x400/065f46/ffffff?text=Design+Workspace', 
    'https://placehold.co/300x150/ffffff/000000?text=Ahmad+Signature', 
    NULL,
    'UI/UX Designer dengan pengalaman 3 tahun dalam merancang aplikasi mobile dan website yang user-friendly. Mahir menggunakan Figma dan Adobe XD.', 
    'Jawa Barat', 'Bandung', 'Coblong', 'Dago', 'Jl. Ir. H. Juanda', '05', '02', '40135', 
    'Active', 'job_seeking', 'Active', 'disetujui',
    '["Figma", "Adobe XD", "Prototyping"]', 
    '[{"name": "Figma", "level": 95, "category": "hard_skill", "displayMode": "percent"}, {"name": "Adobe XD", "level": 80, "category": "hard_skill", "displayMode": "percent"}]',
    '{"dribbble_url": "https://dribbble.com/ahmadrizky", "linkedin_url": "https://linkedin.com/in/ahmadrizky"}',
    '[{"id": "s1", "judul": "Jasa Desain UI Aplikasi Mobile", "deskripsi": "Desain UI aplikasi mobile modern dan user-friendly.", "harga": "2500000", "thumbnail_url": "https://placehold.co/400x300/10b981/ffffff?text=UI+Design", "fitur": ["Source File Figma", "Interactive Prototype", "Revisi 2x"]}]',
    '[{"id": "p1", "judul": "Redesign Aplikasi E-Wallet", "deskripsi": "Redesign aplikasi e-wallet untuk meningkatkan user experience.", "gambar_url": "https://placehold.co/800x500/10b981/ffffff?text=E-Wallet+Redesign"}]',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    120,
    1716182400000,
    1716182400000
),
(
    't3', 
    'linda_writer', 
    'password123',
    'Linda Kusuma', 
    'Content Writer', 
    'linda@example.com', 
    '6281234567892', 
    'Jakarta', 
    '2000-02-10', 
    'https://placehold.co/400x400/f59e0b/ffffff?text=LK', 
    'https://placehold.co/1200x400/b45309/ffffff?text=Writing+Desk', 
    NULL, 
    NULL,
    'Content Writer spesialis SEO dan copywriting. Berpengalaman menulis artikel blog, caption media sosial, dan deskripsi produk.', 
    'DKI Jakarta', 'Jakarta Selatan', 'Kebayoran Baru', 'Senayan', 'Jl. Jend. Sudirman', '01', '03', '12190', 
    'Active', 'freelance', 'Inactive', 'proses',
    '["SEO Writing", "Copywriting", "Content Strategy"]', 
    '[{"name": "SEO Writing", "level": 90, "category": "hard_skill", "displayMode": "percent"}, {"name": "Copywriting", "level": 85, "category": "hard_skill", "displayMode": "percent"}]',
    '{"medium_url": "https://medium.com/@lindakusuma", "linkedin_url": "https://linkedin.com/in/lindakusuma"}',
    '[{"id": "s1", "judul": "Jasa Penulisan Artikel SEO", "deskripsi": "Artikel SEO friendly 1000 kata.", "harga": "150000", "thumbnail_url": "https://placehold.co/400x300/f59e0b/ffffff?text=Article+Writing", "fitur": ["Riset Keyword", "Lolos Plagiarism Check", "Revisi 1x"]}]',
    '[{"id": "p1", "judul": "Artikel Blog Teknologi", "deskripsi": "Kumpulan artikel blog tentang teknologi terbaru.", "gambar_url": "https://placehold.co/800x500/f59e0b/ffffff?text=Tech+Blog"}]',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    95,
    1716182400000,
    1716182400000
),
(
    't4', 
    'budi_backend', 
    'password123',
    'Budi Santoso', 
    'Backend Developer', 
    'budi@example.com', 
    '6281234567893', 
    'Yogyakarta', 
    '1997-11-05', 
    'https://placehold.co/400x400/ef4444/ffffff?text=BS', 
    'https://placehold.co/1200x400/991b1b/ffffff?text=Server+Room', 
    NULL, 
    NULL,
    'Backend Developer berpengalaman dengan Node.js dan Golang. Fokus pada microservices dan database optimization.', 
    'DI Yogyakarta', 'Yogyakarta', 'Depok', 'Caturtunggal', 'Jl. Kaliurang', '03', '01', '55281', 
    'Active', 'job_seeking', 'Active', 'disetujui',
    '["Node.js", "Golang", "PostgreSQL"]', 
    '[{"name": "Node.js", "level": 90, "category": "hard_skill", "displayMode": "percent"}, {"name": "Golang", "level": 80, "category": "hard_skill", "displayMode": "percent"}]',
    '{"github_url": "https://github.com/budisantoso", "linkedin_url": "https://linkedin.com/in/budisantoso"}',
    NULL,
    '[{"id": "p1", "judul": "API Gateway Microservices", "deskripsi": "Implementasi API Gateway untuk arsitektur microservices.", "gambar_url": "https://placehold.co/800x500/ef4444/ffffff?text=API+Gateway"}]',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    110,
    1716182400000,
    1716182400000
);
