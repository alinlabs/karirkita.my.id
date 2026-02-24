
// Enum untuk tipe data statis
export enum TipePekerjaan {
  FULL_TIME = 'Full Time',
  PART_TIME = 'Part Time',
  FREELANCE = 'Freelance',
  CONTRACT = 'Contract',
  INTERNSHIP = 'Internship'
}

export enum LevelPekerjaan {
  JUNIOR = 'Junior',
  MIDDLE = 'Middle',
  SENIOR = 'Senior',
  LEAD = 'Lead'
}

export enum StatusKetersediaan {
  MENCARI_KERJA = 'job_seeking',
  BUKA_JASA = 'open_for_business',
  TIDAK_TERSEDIA = 'unavailable'
}

// Interface sinkronisasi untuk kolom JSON di DB
export interface SyncItem {
  id: string; // user_id atau company_id
  timestamp: number;
}

export interface StrukturOrganisasi {
  foto: string;
  nama: string;
  jabatan: string;
}

// 1. Tabel Perusahaan (companies)
export interface Perusahaan {
  perusahaan_id: string; 
  user_id?: string; 
  nama: string;
  slug: string;
  logo_url: string;
  banner_url: string;
  video_profil?: string; // New
  deskripsi: string;
  
  // Split Address
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  kelurahan?: string;
  jalan?: string;
  kode_pos?: string;
  
  // Computed for display
  lokasi?: string; 

  website_url: string;
  industri: string;
  ukuran_perusahaan: string; 
  promosi?: boolean | string; // 'Active'/'Inactive'
  verifikasi?: 'proses' | 'ditolak' | 'disetujui' | string; // NEW: Verification Status
  status_verifikasi?: 'kosong' | 'proses' | 'ditolak' | 'disetujui' | string; // Alias for backend consistency
  
  // Tracking & Sync
  dilihat?: number;
  pelamar?: SyncItem[]; 
  panggilan?: SyncItem[]; 
  
  // Extended Profile Fields
  tagline?: string;
  tahun_berdiri?: string;
  email_kontak?: string;
  
  // Contact Details
  nomor_telepon?: string;
  fax?: string; // New
  whatsapp?: string; // New
  
  visi?: string; 
  misi?: string; 
  
  // New: Struktural
  struktural?: StrukturOrganisasi[];

  // New: Popup Sambutan
  popup_sambutan?: boolean | string; // 'Active'/'Inactive'
  ukuran_banner_url?: string;
  ukuran_banner_sambutan?: string; // Ratio e.g. "4:3"
  teks_sambutan?: string;
  tombol_ajakan?: string;
  link_ajakan?: string;
  
  // Split Socials
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  
  sosial_media?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  
  teknologi?: string[];
  penghargaan?: {
    judul: string;
    lembaga: string;
    tahun: string;
  }[];
  galeri?: string[]; 
  created_at?: number;
  updated_at?: number;
}

// 2. Tabel Lowongan (jobs)
export interface Lowongan {
  lowongan_id: string; 
  slug: string;
  posisi: string; 
  perusahaan_id: string; 
  perusahaan: Perusahaan; 
  
  // Detailed Location
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  kelurahan?: string;
  jalan?: string;
  kode_pos?: string;
  lokasi: string; // Computed/Legacy string

  maps?: string; 
  tipe_pekerjaan: TipePekerjaan | string;
  sistem_kerja?: string; // New: WFH, WFO, Hybrid, etc.
  sistem_gaji?: string; // New: Bulanan, Harian, etc.
  pendidikan_minimal?: string; 
  rentang_gaji?: string; 
  deskripsi_pekerjaan: string; 
  kualifikasi: string[]; 
  fasilitas?: string[]; 
  banner?: string; 
  promosi?: boolean | string; // 'Active'/'Inactive'
  
  status?: 'Active' | 'Closed' | 'Draft';
  total_pelamar?: number;
  dilihat?: number; 
  created_at?: number;
  updated_at?: number;

  // Submission Type
  jenis_submit?: 'walk_interview' | 'karirkita' | 'custom';
  kontak?: {
    atas_nama: string;
    tipe: 'whatsapp' | 'email' | 'telpon';
    nilai: string;
  }[];
}

// Sub-tables untuk Pencari Kerja

export interface MetrikProyek {
  tipe: 'bar' | 'circle' | 'table' | 'list';
  judul: string;
  data: {
    label: string;
    nilai: string | number;
    deskripsi?: string;
  }[];
}

export interface Proyek {
  id: string;
  judul: string;
  deskripsi: string;
  gambar_url: string;
  banner_custom_url?: string; 
  galeri_url?: string[]; 
  video_url?: string; 
  tautan_eksternal?: string; 
  metrik?: MetrikProyek[]; 
}

export interface Pengalaman {
  id: string;
  posisi: string;
  nama_perusahaan: string;
  logo_perusahaan_url?: string; 
  sosial_media_perusahaan?: string; 
  tanggal_mulai: string;
  tanggal_selesai: string | 'Present';
  deskripsi: string;
  tanggung_jawab?: string[]; 
  pencapaian?: string[]; 
  referensi?: { 
    nama: string;
    posisi: string;
    tipe_kontak?: 'email' | 'whatsapp' | 'instagram' | 'linkedin'; 
    kontak?: string;
  };
  tautan_paklaring?: string; 
  metrik?: MetrikProyek[];
}

export interface Pendidikan {
  id: string;
  nama_institusi: string;
  logo_institusi_url?: string; 
  gelar: string;
  bidang_studi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  deskripsi?: string;
  prestasi?: string[]; 
}

export interface Sertifikasi {
  id: string;
  judul: string;
  penerbit: string; 
  tanggal: string;
  deskripsi?: string;
  sertifikat_url?: string; 
  tautan_sertifikat?: string; 
  credential_id?: string;
  logo_penerbit?: string;
  tingkat?: string;
}

export interface Organisasi {
  id: string;
  nama_organisasi: string;
  peran: string;
  logo_url?: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  deskripsi?: string;
  tautan_sertifikat?: string; 
}

export interface Layanan {
  id: string;
  judul: string;
  deskripsi: string;
  harga: string;
  harga_coret?: string; 
  thumbnail_url?: string; 
  galeri_url?: string[]; 
  fitur?: string[]; 
}

export interface SkillItem {
  name: string;
  level: number; 
  category: 'hard_skill' | 'soft_skill' | 'language';
  displayMode?: 'percent' | 'label'; 
  image?: string; 
}

// 3. Tabel Pencari Kerja (talents/users)
export interface PencariKerja {
  user_id: string;
  username: string;
  nama_lengkap: string;
  headline: string; 
  email_kontak?: string;
  telepon_kontak?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  
  foto_profil: string;
  banner?: string; 
  tanda_tangan?: string; 
  video_profil?: string; // New
  tentang_saya: string; 
  
  // Tracking
  dilihat?: number;
  lamaran?: SyncItem[]; 
  panggilan?: SyncItem[]; 
  
  // Address Fields
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  kelurahan?: string;
  jalan?: string;
  rt?: string;
  rw?: string;
  kode_pos?: string;

  // New Skills Structure
  keahlian: string[]; 
  keahlian_detail?: SkillItem[]; 
  
  // Relations
  portofolio: Proyek[];
  pengalaman_kerja: Pengalaman[];
  riwayat_pendidikan?: Pendidikan[];
  sertifikasi?: Sertifikasi[];
  organisasi?: Organisasi[]; 
  layanan?: Layanan[]; 
  galeri_kegiatan?: string[]; 
  
  sosial_media: {
    linkedin_url?: string;
    github_url?: string;
    website_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    facebook_url?: string;
    twitter_url?: string;
  };
  
  status_saja: boolean; // Legacy mapping
  aktifkan_label: string; // New: 'Active'/'Inactive'
  status_ketersediaan?: StatusKetersediaan | string; 
  promosi?: boolean | string; 
  verifikasi?: 'proses' | 'ditolak' | 'disetujui' | string; // NEW: Verification Status
  status_verifikasi?: 'kosong' | 'proses' | 'ditolak' | 'disetujui' | string; // Alias for backend consistency
  
  created_at?: number;
  updated_at?: number;
}

// Updated Notifikasi Type
export interface Notifikasi {
  id: number;
  kepada?: string; 
  dari?: string;   
  type: 'success' | 'info' | 'warning' | 'system';
  title: string;
  message: string;
  
  // Action Button
  tombol_ajakan?: string; // Replaces tombol/ajakan
  deskripsi_ajakan?: string;
  hyperlink?: string;
  
  created_at: number; 
}

export interface Mitra {
  nama: string;
  logo: string;
  warna?: string; // Hex color for brand
}

export interface Testimoni {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}

export interface City {
  id: string;
  name: string;
  province: string;
  type?: string;
}

export interface Identitas {
  nama: string;
  tagline: string;
  deskripsi: string;
  domain: string;
  logoUrl: string;
  icoUrl?: string; // New
  admin?: {
    email: string;
    password?: string;
  };
  kontak: {
    email: string;
    telepon: string;
    alamat: string;
  };
  sosialMedia: {
    linkedin: string;
    instagram: string;
    twitter: string;
    facebook: string;
  };
  dutaMerek?: {
    perusahaan?: string;
    pekerjaan?: string;
    talenta?: string;
  };
  spanduk?: {
    perusahaan?: string;
    pekerjaan?: string;
    talenta?: string;
  };
  brandAmbassador?: {
    companies?: string;
    jobs?: string;
    talents?: string;
  };
  banners?: {
    companies?: string;
    jobs?: string;
    talents?: string;
  };
  animasiHero?: {
    kiri?: string;
    kanan?: string;
    ponsel?: string;
  };
  aset?: {
    garuda?: string;
    terverifikasi?: string;
  };
  mitra?: Mitra[];
  testimoni?: Testimoni[]; 
  statistik?: { label: string; nilai: string }[];
  rekening?: {
    bank: string;
    nomor: string;
    atas_nama: string;
    logo?: string;
  }[];
  kategori?: {
    label: string;
    icon: string;
    bg?: string;
    accent?: string;
  }[];
  hakCipta: string;
}

export interface FeatureItem {
  judul: string;
  deskripsi: string;
  warna: string;
  warnaHover: string;
}

export interface StepItem {
  judul: string;
  deskripsi: string;
}

// Type Aliases
export type Company = Perusahaan;
export type Job = Lowongan;
export type Talent = PencariKerja;

export interface Kelas {
  id: number;
  slug: string;
  judul: string;
  mentor: string;
  peran: string;
  tanggal: string;
  waktu: string;
  harga: string;
  gambar: string;
  sampul_gambar?: string; // New
  sampul_video?: string; // New
  kategori: string;
  tingkat: string;
  rating: number;
  peserta: number;
  deskripsi: string;
  kurikulum: string[];
  target_pencapaian?: string[];
  manfaat: string[];
}

export interface PengalamanMentor {
  peran: string;
  perusahaan: string;
  periode: string;
}

export interface LayananMentor {
  judul: string;
  harga: string;
  durasi: string;
  deskripsi: string;
}

export interface Mentor {
  id: number;
  slug: string;
  nama: string;
  peran: string;
  perusahaan: string;
  lokasi: string;
  gambar: string;
  sampul_gambar?: string; // New
  sampul_video?: string; // New
  keahlian: string[];
  sesi: number;
  rating: number;
  tentang: string;
  pengalaman: PengalamanMentor[];
  ulasan: number;
  layanan: LayananMentor[];
}

export interface Promosi {
  nama: string;
  harga: string;
  durasi: string;
  deskripsi: string;
  fitur: string[];
  unggulan: boolean;
  warna: string;
}
