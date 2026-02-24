import React from 'react';
import { Shield } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const PrivacyPolicy = () => {
  return (
    <LegalLayout
      title="Kebijakan Privasi"
      subtitle="Bagaimana Kami Melindungi Data Anda"
      lastUpdated="20 Mei 2024"
      icon={<Shield className="w-6 h-6 md:w-8 md:h-8" />}
      seoTitle="Kebijakan Privasi - KarirKita"
      seoDescription="Kebijakan privasi KarirKita menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda."
      heroPageKey="privacy"
    >
      <div className="space-y-6 md:space-y-8">
        <section>
          <p className="text-sm md:text-lg leading-relaxed">
            Di <strong>KarirKita</strong>, kami sangat menghargai privasi Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami. Dengan menggunakan layanan kami, Anda menyetujui praktik data yang dijelaskan dalam kebijakan ini.
          </p>
        </section>

        <section>
          <h2>1. Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan beberapa jenis informasi untuk memberikan layanan terbaik:</p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li><strong>Informasi Akun:</strong> Nama lengkap, alamat email, nomor telepon, dan kata sandi yang dienkripsi.</li>
            <li><strong>Data Profil Profesional:</strong> Riwayat pekerjaan, pendidikan, keahlian, sertifikasi, dan dokumen portofolio atau CV yang Anda unggah.</li>
            <li><strong>Data Penggunaan:</strong> Informasi tentang bagaimana Anda menggunakan situs kami, termasuk riwayat pencarian kerja, lamaran yang dikirim, dan waktu akses.</li>
            <li><strong>Data Perangkat & Teknis:</strong> Alamat IP, jenis browser, dan sistem operasi untuk keperluan keamanan dan analitik.</li>
            <li><strong>Cookies:</strong> Data kecil yang disimpan di perangkat Anda untuk meningkatkan pengalaman pengguna (lihat Kebijakan Cookies).</li>
          </ul>
        </section>

        <section>
          <h2>2. Penggunaan Informasi</h2>
          <p>Data Anda digunakan untuk tujuan berikut:</p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li><strong>Penyediaan Layanan:</strong> Memproses pendaftaran akun, memposting lowongan, dan memfasilitasi lamaran kerja.</li>
            <li><strong>Personalisasi:</strong> Merekomendasikan lowongan kerja yang sesuai dengan profil dan minat Anda.</li>
            <li><strong>Komunikasi:</strong> Mengirimkan notifikasi penting terkait keamanan akun, status lamaran, atau pembaruan layanan.</li>
            <li><strong>Keamanan:</strong> Mendeteksi dan mencegah aktivitas penipuan atau penyalahgunaan platform.</li>
            <li><strong>Analitik:</strong> Memahami tren penggunaan untuk meningkatkan kinerja dan fitur platform kami.</li>
          </ul>
        </section>

        <section>
          <h2>3. Perlindungan & Keamanan Data</h2>
          <p>
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang ketat untuk melindungi data pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Ini termasuk penggunaan enkripsi SSL/TLS untuk transmisi data, firewall, dan kontrol akses fisik ke server kami.
          </p>
          <p>
            Meskipun kami berusaha sebaik mungkin, tidak ada metode transmisi melalui internet atau penyimpanan elektronik yang 100% aman. Oleh karena itu, kami tidak dapat menjamin keamanan mutlak.
          </p>
        </section>

        <section>
          <h2>4. Berbagi Informasi</h2>
          <p>
            Kami <strong>tidak akan pernah</strong> menjual data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran. Data Anda hanya dibagikan dalam situasi berikut:
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li><strong>Dengan Perusahaan Pemberi Kerja:</strong> Saat Anda melamar pekerjaan, data profil dan CV Anda akan dibagikan kepada perusahaan terkait.</li>
            <li><strong>Penyedia Layanan Pihak Ketiga:</strong> Kami dapat menggunakan pihak ketiga tepercaya untuk membantu operasional kami (misalnya, hosting server, layanan email), yang terikat oleh perjanjian kerahasiaan.</li>
            <li><strong>Kewajiban Hukum:</strong> Jika diwajibkan oleh hukum atau perintah pengadilan yang sah.</li>
          </ul>
        </section>

        <section>
          <h2>5. Hak Pengguna</h2>
          <p>Anda memiliki hak-hak berikut terkait data pribadi Anda:</p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li><strong>Akses & Koreksi:</strong> Anda dapat mengakses dan memperbarui informasi profil Anda kapan saja melalui pengaturan akun.</li>
            <li><strong>Penghapusan:</strong> Anda dapat meminta penghapusan akun dan data pribadi Anda dengan menghubungi tim dukungan kami.</li>
            <li><strong>Penarikan Persetujuan:</strong> Anda dapat berhenti berlangganan dari email pemasaran kami kapan saja.</li>
          </ul>
        </section>

        <section>
          <h2>6. Penyimpanan Data</h2>
          <p>
            Kami menyimpan data pribadi Anda selama akun Anda aktif atau selama diperlukan untuk menyediakan layanan kepada Anda. Kami juga dapat menyimpan data tertentu untuk mematuhi kewajiban hukum, menyelesaikan sengketa, dan menegakkan perjanjian kami.
          </p>
        </section>

        <section>
          <h2>7. Layanan Pihak Ketiga</h2>
          <p>
            Situs kami mungkin berisi tautan ke situs web pihak ketiga. Kebijakan Privasi ini tidak berlaku untuk situs web tersebut. Kami menyarankan Anda untuk membaca kebijakan privasi dari setiap situs yang Anda kunjungi.
          </p>
        </section>

        <section>
          <h2>8. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau pemberitahuan di situs web kami.
          </p>
        </section>

        <section>
          <h2>9. Kontak Kami</h2>
          <p>
            Jika Anda memiliki pertanyaan atau kekhawatiran tentang Kebijakan Privasi ini, silakan hubungi Petugas Perlindungan Data kami di:
          </p>
          <address className="not-italic bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-200 mt-2">
            <strong>KarirKita Privacy Team</strong><br />
            Email: karirkita.my.id@gmail.com<br />
            Alamat: Business Consultant Center Nagri Kidul, Purwakarta
          </address>
        </section>
      </div>
    </LegalLayout>
  );
};
