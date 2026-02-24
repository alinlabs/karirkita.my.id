
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const Disclaimer = () => {
  return (
    <LegalLayout
      title="Disclaimer"
      subtitle="Penyangkalan Tanggung Jawab"
      lastUpdated="1 Januari 2024"
      icon={<AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />}
      seoTitle="Disclaimer - KarirKita"
      seoDescription="Penyangkalan tanggung jawab KarirKita terkait informasi lowongan kerja dan penggunaan platform."
      heroPageKey="disclaimer"
    >
      <div className="space-y-6 md:space-y-8">
        <section>
          <p className="text-sm md:text-lg leading-relaxed">
            Informasi yang disediakan di website <strong>KarirKita</strong> (https://www.karirkita.my.id) hanya untuk tujuan informasi umum. Meskipun kami berusaha menjaga informasi tetap terkini dan benar, kami tidak membuat pernyataan atau jaminan dalam bentuk apa pun, tersurat maupun tersirat, tentang kelengkapan, keakuratan, keandalan, kesesuaian, atau ketersediaan sehubungan dengan situs web atau informasi, produk, layanan, atau grafik terkait yang terdapat di situs web untuk tujuan apa pun.
          </p>
        </section>

        <section>
          <h2>1. Peran Sebagai Perantara</h2>
          <p>
            KarirKita bertindak sebagai platform perantara yang menghubungkan pencari kerja dengan perusahaan pemberi kerja. Kami <strong>bukan</strong> agen perekrutan, pemberi kerja langsung, atau perwakilan dari perusahaan yang memposting lowongan di situs kami.
          </p>
          <p>
            Keputusan perekrutan sepenuhnya berada di tangan perusahaan pemberi kerja. Kami tidak menjamin bahwa Anda akan diwawancarai atau dipekerjakan, dan kami tidak bertanggung jawab atas keputusan ketenagakerjaan apa pun yang dibuat oleh perusahaan.
          </p>
        </section>

        <section>
          <h2>2. Akurasi Informasi Lowongan</h2>
          <p>
            Lowongan kerja yang diposting berasal dari berbagai perusahaan dan sumber pihak ketiga. KarirKita tidak memverifikasi secara independen setiap detail dari setiap lowongan.
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li>Kami tidak bertanggung jawab atas keakuratan, kelengkapan, atau legalitas materi lowongan yang diposting oleh pengguna atau perusahaan.</li>
            <li>Pelamar disarankan untuk selalu melakukan verifikasi mandiri (due diligence) sebelum melamar atau menghadiri wawancara.</li>
          </ul>
        </section>

        <section>
          <h2>3. Risiko Penggunaan</h2>
          <p>
            Penggunaan Anda atas situs web dan ketergantungan Anda pada informasi apa pun di situs web semata-mata merupakan risiko Anda sendiri.
          </p>
          <p>
            Dalam hal apa pun kami tidak akan bertanggung jawab atas kerugian atau kerusakan apa pun termasuk tanpa batasan, kerugian atau kerusakan tidak langsung atau konsekuensial, atau kerugian atau kerusakan apa pun yang timbul dari hilangnya data atau keuntungan yang timbul dari, atau sehubungan dengan, penggunaan situs web ini.
          </p>
        </section>

        <section>
          <h2>4. Tautan Pihak Ketiga</h2>
          <p>
            Melalui situs web ini, Anda dapat menautkan ke situs web lain yang tidak berada di bawah kendali KarirKita. Kami tidak memiliki kendali atas sifat, konten, dan ketersediaan situs-situs tersebut. Dimasukannya tautan apa pun tidak serta merta menyiratkan rekomendasi atau mendukung pandangan yang diungkapkan di dalamnya.
          </p>
        </section>

        <section>
          <h2>5. Waspada Penipuan</h2>
          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 md:p-4 rounded-r-lg">
            <h3 className="text-orange-800 font-bold text-base md:text-lg mb-1 md:mb-2 mt-0">Peringatan Penting</h3>
            <p className="text-orange-700 mb-0 text-sm md:text-base">
              KarirKita dan perusahaan mitra resmi <strong>tidak pernah memungut biaya apapun</strong> (seperti biaya travel, akomodasi, biaya administrasi, atau pelatihan) dari pelamar dalam proses rekrutmen.
            </p>
            <p className="text-orange-700 mt-2 mb-0 text-sm md:text-base">
              Jika Anda diminta untuk mentransfer uang, harap segera laporkan kepada kami dan abaikan permintaan tersebut.
            </p>
          </div>
        </section>

        <section>
          <h2>6. Ketersediaan Layanan</h2>
          <p>
            Kami berupaya semaksimal mungkin untuk menjaga agar situs web tetap berjalan lancar. Namun, KarirKita tidak bertanggung jawab, dan tidak akan bertanggung jawab, jika situs web tidak tersedia sementara karena masalah teknis di luar kendali kami.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};
