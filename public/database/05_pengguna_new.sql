-- Seed Data for New Users (Mela & Alvareza)

INSERT INTO pengguna (
    id_pengguna, username, nama_lengkap, headline, email_kontak, telepon_kontak,
    tempat_lahir, tanggal_lahir, foto_profil, banner, tentang_saya,
    provinsi, kota, kecamatan, kelurahan, jalan, kode_pos,
    status_ketersediaan, keahlian, keahlian_detail, sosial_media,
    pengalaman_kerja, riwayat_pendidikan, portofolio, sertifikasi, organisasi, galeri_kegiatan, layanan,
    created_at, updated_at
) VALUES 
-- 1. Mela Melati Aprilia
(
    'u-mela', 
    'melamelati', 
    'Mela Melati Aprilia', 
    'S1 Manajemen | Admin & Sales Professional', 
    'mela.melati@example.com', 
    '', 
    'Subang', 
    '2004-04-14', 
    'https://ui-avatars.com/api/?name=Mela+Melati+Aprilia&background=random&color=fff', 
    'https://placehold.co/1200x300/e2e8f0/1e293b?text=Mela+Melati', 
    'Profesional muda dengan latar belakang pendidikan S1 Manajemen. Memiliki pengalaman di bidang administrasi, penjualan, dan pendidikan.',
    'Jawa Barat', 'Subang', '', '', '', '',
    'job_seeking', 
    '["Administrasi", "Penjualan", "Manajemen", "Pengajaran"]', 
    '[]', 
    '{}', 
    '[
        {"id": "exp-1", "posisi": "Reseller", "nama_perusahaan": "Justmine Beauty", "tanggal_mulai": "2020", "tanggal_selesai": "2022", "deskripsi": "Reseller skincare justmine beauty"},
        {"id": "exp-2", "posisi": "Sales", "nama_perusahaan": "Roti Purwadadi", "tanggal_mulai": "2022", "tanggal_selesai": "2022", "deskripsi": "Sales roti Purwadadi"},
        {"id": "exp-3", "posisi": "Guru", "nama_perusahaan": "SD IT Candra Buana", "tanggal_mulai": "2023", "tanggal_selesai": "2023", "deskripsi": "Guru SD it Candra buana"},
        {"id": "exp-4", "posisi": "Admin", "nama_perusahaan": "PT Humaira Travel Umroh dan Internasional", "tanggal_mulai": "2023", "tanggal_selesai": "2024", "deskripsi": "Admin PT Humaira travel umroh dan internasional"}
    ]', 
    '[
        {"id": "edu-1", "nama_institusi": "Universitas (TBA)", "gelar": "S1", "bidang_studi": "Manajemen", "tanggal_mulai": "2020", "tanggal_selesai": "2024"}
    ]', 
    '[]', '[]', '[]', '[]', '[]',
    strftime('%s', 'now') * 1000, 
    strftime('%s', 'now') * 1000
),

-- 2. Alvareza Hilka Pratama
(
    'u-alvareza', 
    'alvareza', 
    'Alvareza Hilka Pratama', 
    'Digital Marketing & Administration Enthusiast', 
    'alvareza@example.com', 
    '0858-4376-9386', 
    '', 
    '', 
    'https://ui-avatars.com/api/?name=Alvareza+Hilka+Pratama&background=random&color=fff', 
    'https://placehold.co/1200x300/e2e8f0/1e293b?text=Alvareza+Hilka', 
    'Lulusan SMK jurusan Akuntansi & Keuangan Lembaga. Memiliki minat di bidang digital marketing dan administrasi. Teliti, komunikatif, dan mampu bekerja dalam tim. Berpengalaman dalam PKL dan organisasi.',
    'Jawa Barat', 'Kab. Bogor', 'Kec. Parungpanjang', 'Ds. Ciraca', 'Jl. Cipelang, RT/RW 001/12', '',
    'job_seeking', 
    '["Creative Media Design", "Project Management", "UI/UX Design & System", "Manajemen Media Sosial", "Content Writing", "Administrasi", "Microsoft Office", "Canva", "Kerja sama tim", "Komunikasi"]', 
    '[]', 
    '{}', 
    '[
        {"id": "exp-1", "posisi": "Marketing Communication Manager", "nama_perusahaan": "-", "tanggal_mulai": "", "tanggal_selesai": "", "deskripsi": "Menyusun strategi promosi dan komunikasi pemasaran. Mengelola dan meningkatkan engagement media sosial. Mengatur dan menjalankan campaign marketing. Menganalisis performa pemasaran"},
        {"id": "exp-2", "posisi": "Administrasi Keuangan", "nama_perusahaan": "-", "tanggal_mulai": "", "tanggal_selesai": "", "deskripsi": "Mengelola pembukuan dan laporan keuangan. Mengarsipkan dokumen administrasi. Menginput dan merekap data keuangan. Menyusun laporan keuangan sederhana"},
        {"id": "exp-3", "posisi": "IT & Social Media Specialist", "nama_perusahaan": "-", "tanggal_mulai": "", "tanggal_selesai": "", "deskripsi": "Mengelola akun media sosial. Membuat dan mengedit konten digital. Monitoring insight dan performa konten. Meningkatkan interaksi dan branding digital"},
        {"id": "exp-4", "posisi": "Digital Marketing (PKL/Proyek)", "nama_perusahaan": "-", "tanggal_mulai": "", "tanggal_selesai": "", "deskripsi": "Membuat dan mengelola konten media sosial. Menjalankan campaign digital marketing. Melakukan analisis performa kampanye. Meningkatkan engagement dan branding"},
        {"id": "exp-5", "posisi": "Chief Operational Officer (PKL/Proyek)", "nama_perusahaan": "-", "tanggal_mulai": "", "tanggal_selesai": "", "deskripsi": "Mengatur dan mengawasi operasional tim. Mengelola jalannya proyek. Mengkoordinasikan anggota tim. Memastikan target proyek tercapai"}
    ]', 
    '[
        {"id": "edu-1", "nama_institusi": "SMK", "gelar": "SMK", "bidang_studi": "Akuntansi & Keuangan Lembaga", "tanggal_mulai": "", "tanggal_selesai": ""}
    ]', 
    '[]', '[]', '[]', '[]', '[]',
    strftime('%s', 'now') * 1000, 
    strftime('%s', 'now') * 1000
);
