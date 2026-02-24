# STRUKTUR PROYEK KARIRKITA

Berikut adalah struktur direktori dan file utama dalam proyek ini:

```
/
├── .env                    # Variabel lingkungan (Environment Variables)
├── .env.example            # Contoh variabel lingkungan
├── .gitignore              # Daftar file yang diabaikan oleh Git
├── App.tsx                 # Komponen utama aplikasi
├── index.css               # Stylesheet global (Tailwind CSS)
├── index.html              # Entry point HTML
├── index.tsx               # Entry point React
├── package.json            # Manifest dependensi dan skrip proyek
├── postcss.config.js       # Konfigurasi PostCSS
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── tsconfig.json           # Konfigurasi TypeScript
├── types.ts                # Definisi tipe TypeScript global
├── vite.config.ts          # Konfigurasi Vite Build Tool
│
├── config/                 # Konfigurasi aplikasi
│
├── context/                # React Context Providers
│   ├── DataContext.tsx     # Context data global
│   ├── LoadingContext.tsx  # Context status loading
│   ├── SettingsContext.tsx # Context pengaturan aplikasi
│   └── ToastContext.tsx    # Context notifikasi toast
│
├── halaman/                # Halaman-halaman aplikasi (Pages)
│   ├── admin/              # Halaman dashboard admin
│   ├── beranda/            # Halaman utama (Landing Page)
│   ├── error/              # Halaman error (404, dll)
│   ├── kelas/              # Halaman fitur kelas/kursus
│   ├── legal/              # Halaman legal (Privacy Policy, Terms)
│   ├── login/              # Halaman autentikasi (Login/Register)
│   ├── pekerjaan/          # Halaman lowongan kerja
│   ├── pelamar/            # Halaman dashboard pelamar
│   ├── pembayaran/         # Halaman pembayaran
│   ├── penawaran/          # Halaman penawaran/promosi
│   ├── perusahaan/         # Halaman profil perusahaan
│   ├── profil/             # Halaman profil pengguna
│   ├── public/             # Halaman publik lainnya
│   └── user/               # Halaman dashboard user umum
│
├── hooks/                  # Custom React Hooks
│   ├── useAuth.ts          # Hook autentikasi
│   ├── useDebounce.ts      # Hook debounce value
│   ├── useMediaQuery.ts    # Hook responsivitas media query
│   ├── useRegisterLogic.ts # Hook logika registrasi
│   ├── useToast.ts         # Hook notifikasi toast
│   └── useWilayah.ts       # Hook data wilayah Indonesia
│
├── komponen/               # Komponen UI Reusable
│   ├── admin/              # Komponen khusus admin
│   ├── ui/                 # Komponen UI atomik (Button, Input, Card, dll)
│   └── umum/               # Komponen umum (Navbar, Footer, Layout, dll)
│
├── public/                 # Aset statis publik
│   ├── cloudflare/         # Skrip Cloudflare Worker
│   ├── database/           # Skrip SQL Database
│   ├── developer/          # Dokumentasi pengembang
│   ├── images/             # Aset gambar
│   └── logo/               # Aset logo
│
├── services/               # Layanan API dan Logika Bisnis
│   ├── aiService.ts        # Layanan integrasi AI
│   ├── authService.ts      # Layanan autentikasi
│   ├── pekerjaanService.ts # Layanan data pekerjaan
│   ├── pelamarService.ts   # Layanan data pelamar
│   ├── perusahaanService.ts# Layanan data perusahaan
│   ├── profilService.ts    # Layanan data profil
│   ├── routingData.ts      # Routing dan fetching data utama
│   └── socket.ts           # Konfigurasi WebSocket
│
└── utils/                  # Utilitas dan Helper Functions
    ├── cn.ts               # Utilitas penggabungan class (Tailwind)
    ├── formatters.ts       # Formatter data (mata uang, tanggal)
    ├── seoHelpers.ts       # Helper SEO
    ├── slugify.ts          # Generator slug URL
    └── validators.ts       # Validator input form
```

## Keterangan Pengembang
Website ini dikembangkan oleh **AiLabs Indonesia**.
**CEO:** Alvareza Hilka Pratama
