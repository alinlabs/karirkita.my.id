
import React from 'react';
import { Cookie } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

export const CookiesPolicy = () => {
  return (
    <LegalLayout
      title="Kebijakan Cookie"
      subtitle="Penggunaan Teknologi Pelacakan di KarirKita"
      lastUpdated="20 Mei 2024"
      icon={<Cookie className="w-6 h-6 md:w-8 md:h-8" />}
      seoTitle="Kebijakan Cookie - KarirKita"
      seoDescription="Kebijakan penggunaan cookie pada platform KarirKita untuk meningkatkan pengalaman pengguna."
      heroPageKey="cookies"
    >
      <div className="space-y-6 md:space-y-8">
        <section>
          <p className="text-sm md:text-lg leading-relaxed">
            <strong>KarirKita</strong> menggunakan cookie dan teknologi serupa untuk memberikan pengalaman terbaik bagi pengguna, menganalisis lalu lintas situs, dan mempersonalisasi konten. Kebijakan ini menjelaskan apa itu cookie, bagaimana kami menggunakannya, dan bagaimana Anda dapat mengelolanya.
          </p>
        </section>

        <section>
          <h2>1. Apa itu Cookie?</h2>
          <p>
            Cookie adalah file teks kecil yang disimpan di perangkat Anda (komputer, tablet, atau ponsel) saat Anda mengunjungi situs web. Cookie membantu situs web mengingat preferensi Anda (seperti login, bahasa, ukuran font, dan preferensi tampilan lainnya) selama jangka waktu tertentu, sehingga Anda tidak perlu memasukkannya kembali setiap kali Anda kembali ke situs atau berpindah dari satu halaman ke halaman lain.
          </p>
        </section>

        <section>
          <h2>2. Jenis Cookie yang Kami Gunakan</h2>
          <p>Kami menggunakan jenis cookie berikut untuk memastikan kelancaran operasional platform kami:</p>
          
          <div className="space-y-3 md:space-y-4 mt-3 md:mt-4">
            <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mt-0">Cookie Esensial (Wajib)</h3>
              <p className="mb-0">
                Cookie ini sangat penting agar situs web berfungsi dengan baik. Mereka memungkinkan Anda untuk menavigasi situs dan menggunakan fitur-fiturnya, seperti mengakses area aman (login). Tanpa cookie ini, layanan yang Anda minta tidak dapat disediakan.
              </p>
            </div>

            <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mt-0">Cookie Kinerja & Analitik</h3>
              <p className="mb-0">
                Cookie ini mengumpulkan informasi tentang bagaimana pengunjung menggunakan situs web kami, misalnya halaman mana yang paling sering dikunjungi dan apakah mereka mendapatkan pesan kesalahan. Informasi ini digunakan hanya untuk meningkatkan cara kerja situs web kami. Kami menggunakan layanan seperti Google Analytics untuk tujuan ini.
              </p>
            </div>

            <div className="bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
              <h3 className="text-base md:text-lg font-bold text-slate-900 mt-0">Cookie Fungsionalitas</h3>
              <p className="mb-0">
                Cookie ini memungkinkan situs web untuk mengingat pilihan yang Anda buat (seperti nama pengguna, bahasa, atau wilayah tempat Anda berada) dan menyediakan fitur yang ditingkatkan dan lebih pribadi.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>3. Cookie Pihak Ketiga</h2>
          <p>
            Selain cookie kami sendiri, kami juga dapat menggunakan berbagai cookie pihak ketiga untuk melaporkan statistik penggunaan Layanan, mengirimkan iklan di dan melalui Layanan, dan sebagainya. Contohnya termasuk Google Analytics, Facebook Pixel, dan layanan media sosial lainnya.
          </p>
        </section>

        <section>
          <h2>4. Mengelola Cookie</h2>
          <p>
            Anda memiliki hak untuk memutuskan apakah akan menerima atau menolak cookie. Anda dapat mengatur kontrol browser web Anda untuk menerima atau menolak cookie.
          </p>
          <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2">
            <li>Jika Anda memilih untuk menolak cookie, Anda masih dapat menggunakan situs web kami, meskipun akses Anda ke beberapa fungsi dan area situs web kami mungkin terbatas.</li>
            <li>Karena cara menolak cookie melalui kontrol browser web bervariasi dari satu browser ke browser lainnya, Anda harus mengunjungi menu bantuan browser Anda untuk informasi lebih lanjut.</li>
          </ul>
        </section>

        <section>
          <h2>5. Perubahan pada Kebijakan Cookie Ini</h2>
          <p>
            Kami dapat memperbarui Kebijakan Cookie ini dari waktu ke waktu untuk mencerminkan, misalnya, perubahan pada cookie yang kami gunakan atau untuk alasan operasional, hukum, atau peraturan lainnya. Oleh karena itu, harap kunjungi kembali Kebijakan Cookie ini secara teratur untuk tetap mendapat informasi tentang penggunaan cookie dan teknologi terkait kami.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};
