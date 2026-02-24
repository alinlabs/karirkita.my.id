
export const menuConfig = {
  mainNav: [
    { title: "Beranda", href: "/" },
    { title: "Lowongan", href: "/pekerjaan" },
    { title: "Kandidat", href: "/pelamar" },
    { title: "Perusahaan", href: "/perusahaan" },
    { title: "Kelas & Mentor", href: "/kelas" },
  ],
  sidebarNav: [
    { title: "Dashboard", href: "/user/dashboard", icon: "LayoutDashboard" },
    { title: "Profil CV", href: "/user/profile", icon: "User" },
    
    { header: "Produk Dan Layanan" },
    { title: "Daftar Produk", href: "/user/services", icon: "ShoppingBag" },
    { title: "Surat Builder", href: "/user/letters", icon: "FileText" },
    { title: "Tanda Tangan", href: "/user/signature", icon: "PenTool" }, // Added Signature
    
    { header: "Bisnis" },
    { title: "Perusahaan", href: "/user/company", icon: "Building2" },
    { title: "Lowongan Kerja", href: "/user/jobs", icon: "Briefcase" },
    
    { header: "Akun" },
    { title: "Pengaturan", href: "/user/settings", icon: "Settings" },
  ],
};
