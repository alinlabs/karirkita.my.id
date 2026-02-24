import React from 'react';
import { FileText } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const TermsOfService = () => {
  return (
    <LegalLayout
      title="Syarat & Ketentuan"
      subtitle="Perjanjian Penggunaan Layanan KarirKita"
      lastUpdated="1 Januari 2024"
      icon={<FileText className="w-6 h-6 md:w-8 md:h-8" />}
      seoTitle="Syarat & Ketentuan - KarirKita"
      seoDescription="Syarat dan ketentuan penggunaan platform KarirKita untuk pencari kerja dan perusahaan."
      heroPageKey="terms"
    >
      <div className="space-y-6 md:space-y-8">
        <section>
          <p className="text-sm md:text-lg leading-relaxed">
            Selamat datang di KarirKita. Dengan mengakses atau menggunakan situs web kami (https://www.karirkita.my.id), Anda setuju untuk terikat oleh Syarat dan Ketentuan berikut. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan menggunakan layanan kami.
          </p>
        </section>

        <section>
          <h2>1. Definisi</h2>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li><strong>"Platform"</strong> merujuk pada situs web KarirKita dan layanan terkait.</li>
            <li><strong>"Pengguna"</strong> merujuk pada individu atau entitas yang mengakses Platform, termasuk Pencari Kerja dan Perusahaan.</li>
            <li><strong>"Pencari Kerja"</strong> adalah individu yang mencari peluang kerja.</li>
            <li><strong>"Perusahaan"</strong> adalah entitas yang memposting lowongan kerja.</li>
            <li><strong>"Konten"</strong> merujuk pada teks, gambar, data, dan informasi lain yang diunggah oleh Pengguna.</li>
          </ul>
        </section>

        <section>
          <h2>2. Kelayakan Pengguna</h2>
          <p>
            Layanan ini hanya tersedia bagi individu yang berusia minimal 18 tahun atau usia legal untuk bekerja di Indonesia. Dengan menggunakan Platform, Anda menjamin bahwa Anda memiliki hak, wewenang, dan kapasitas untuk menyetujui Syarat ini.
          </p>
        </section>

        <section>
          <h2>3. Pendaftaran Akun & Keamanan</h2>
          <p>
            Untuk mengakses fitur tertentu, Anda harus mendaftar akun. Anda setuju untuk:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li>Memberikan informasi yang akurat, lengkap, dan terbaru.</li>
            <li>Menjaga kerahasiaan kata sandi akun Anda.</li>
            <li>Bertanggung jawab penuh atas semua aktivitas yang terjadi di bawah akun Anda.</li>
            <li>Segera memberi tahu kami jika ada penggunaan akun tanpa izin.</li>
          </ul>
        </section>

        <section>
          <h2>4. Aturan Posting Lowongan Kerja</h2>
          <p>Perusahaan setuju untuk mematuhi aturan berikut saat memposting lowongan:</p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li>Lowongan harus nyata, legal, dan tidak diskriminatif.</li>
            <li>Dilarang memposting skema piramida, multi-level marketing (MLM), atau pekerjaan yang mengharuskan pembayaran di muka dari pelamar.</li>
            <li>Deskripsi pekerjaan harus jelas dan akurat.</li>
            <li>KarirKita berhak menghapus lowongan yang melanggar kebijakan tanpa pengembalian dana (jika berlaku).</li>
          </ul>
        </section>

        <section>
          <h2>5. Tanggung Jawab Pengguna</h2>
          <h3>5.1 Pencari Kerja</h3>
          <p>
            Anda setuju untuk hanya melamar pekerjaan yang sesuai dengan kualifikasi Anda dan memberikan data CV yang jujur.
          </p>
          <h3>5.2 Perusahaan</h3>
          <p>
            Anda setuju untuk menggunakan data pelamar hanya untuk tujuan rekrutmen dan menjaga kerahasiaan data pribadi pelamar sesuai dengan Kebijakan Privasi.
          </p>
        </section>

        <section>
          <h2>6. Aktivitas yang Dilarang</h2>
          <p>Pengguna dilarang keras untuk:</p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li>Melanggar hukum atau peraturan yang berlaku di Indonesia.</li>
            <li>Mengunggah konten yang mengandung SARA, pornografi, atau ujaran kebencian.</li>
            <li>Melakukan scraping, crawling, atau pengambilan data otomatis dari Platform.</li>
            <li>Menyebarkan virus, malware, atau kode berbahaya lainnya.</li>
            <li>Mengganggu integritas atau kinerja Platform.</li>
          </ul>
        </section>

        <section>
          <h2>7. Hak Kekayaan Intelektual</h2>
          <p>
            Konten yang Anda unggah (seperti CV atau Logo Perusahaan) tetap menjadi milik Anda. Namun, Anda memberikan lisensi non-eksklusif, bebas royalti kepada KarirKita untuk menggunakan, menampilkan, dan mendistribusikan konten tersebut sehubungan dengan operasi layanan Platform.
          </p>
          <p>
            Seluruh desain, logo, kode, dan konten asli KarirKita adalah milik KarirKita dan dilindungi oleh hukum hak cipta.
          </p>
        </section>

        <section>
          <h2>8. Batasan Tanggung Jawab</h2>
          <p>
            KarirKita bertindak sebagai perantara pasif. Kami tidak menjamin keakuratan lowongan kerja, identitas pengguna, atau keberhasilan proses rekrutmen. Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan Platform.
          </p>
        </section>

        <section>
          <h2>9. Penghentian Layanan</h2>
          <p>
            Kami berhak untuk menangguhkan atau menghentikan akses Anda ke Platform kapan saja, dengan atau tanpa alasan, termasuk jika Anda melanggar Syarat ini.
          </p>
        </section>

        <section>
          <h2>10. Hukum yang Berlaku</h2>
          <p>
            Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan di pengadilan yang berwenang di Indonesia.
          </p>
        </section>

        <section>
          <h2>11. Kontak Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami di:
          </p>
          <address className="not-italic bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-200 mt-2">
            <strong>KarirKita Legal Team</strong><br />
            Email: karirkita.my.id@gmail.com<br />
            Alamat: Business Consultant Center Nagri Kidul, Purwakarta
          </address>
        </section>
      </div>
    </LegalLayout>
  );
};
