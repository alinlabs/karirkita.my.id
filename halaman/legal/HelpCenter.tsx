import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, Instagram } from 'lucide-react';
import { LegalLayout } from './LegalLayout';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className={`font-medium text-slate-900 group-hover:text-blue-600 transition-colors ${isOpen ? 'text-blue-600' : ''}`}>
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 text-slate-600 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
};

export const HelpCenter = () => {
  return (
    <LegalLayout
      title="Pusat Bantuan"
      subtitle="Temukan jawaban atas pertanyaan Anda seputar KarirKita"
      icon={<HelpCircle className="w-6 h-6 md:w-8 md:h-8" />}
      seoTitle="Pusat Bantuan - KarirKita"
      seoDescription="Pusat bantuan KarirKita menyediakan jawaban atas pertanyaan umum bagi pencari kerja dan perusahaan."
      heroPageKey="help"
    >
      <div className="space-y-8 md:space-y-10">
        <section>
          <p className="text-sm md:text-lg leading-relaxed mb-4 md:mb-6">
            Selamat datang di Pusat Bantuan KarirKita. Di sini Anda dapat menemukan panduan dan jawaban atas pertanyaan yang sering diajukan untuk membantu Anda memaksimalkan penggunaan platform kami.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs md:text-sm">1</span>
            Untuk Pencari Kerja
          </h2>
          <div className="bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100">
            <FAQItem
              question="Bagaimana cara membuat akun?"
              answer="Klik tombol 'Daftar' di pojok kanan atas halaman utama. Isi formulir pendaftaran dengan nama, email, dan kata sandi Anda. Anda juga bisa mendaftar menggunakan akun Google atau LinkedIn."
            />
            <FAQItem
              question="Bagaimana cara melamar pekerjaan?"
              answer="Setelah login, cari lowongan yang Anda minati. Klik tombol 'Lamar Sekarang' pada halaman detail lowongan. Pastikan profil dan CV Anda sudah lengkap sebelum melamar."
            />
            <FAQItem
              question="Bagaimana cara mengedit profil saya?"
              answer="Masuk ke dashboard akun Anda, lalu klik menu 'Profil Saya'. Di sana Anda dapat memperbarui informasi pribadi, pengalaman kerja, pendidikan, dan mengunggah CV terbaru."
            />
            <FAQItem
              question="Saya lupa kata sandi, apa yang harus saya lakukan?"
              answer="Klik 'Lupa Password' pada halaman login. Masukkan alamat email yang terdaftar, dan kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda."
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs md:text-sm">2</span>
            Untuk Perusahaan
          </h2>
          <div className="bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100">
            <FAQItem
              question="Bagaimana cara memposting lowongan kerja?"
              answer="Anda perlu mendaftar sebagai akun Perusahaan. Setelah diverifikasi, masuk ke dashboard perusahaan dan klik 'Buat Lowongan Baru'. Isi detail pekerjaan dan publikasikan."
            />
            <FAQItem
              question="Bagaimana cara mengelola pelamar?"
              answer="Di dashboard perusahaan, pilih menu 'Kelola Pelamar'. Anda dapat melihat daftar pelamar untuk setiap lowongan, mengunduh CV, dan mengubah status lamaran (misal: Wawancara, Diterima)."
            />
            <FAQItem
              question="Apakah ada biaya untuk memposting lowongan?"
              answer="KarirKita menawarkan paket gratis dan berbayar. Paket gratis memiliki batasan jumlah postingan aktif. Silakan cek halaman 'Harga' atau hubungi tim sales kami untuk info lebih lanjut."
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs md:text-sm">3</span>
            Akun & Keamanan
          </h2>
          <div className="bg-slate-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-100">
            <FAQItem
              question="Bagaimana cara mengganti email akun?"
              answer="Saat ini, untuk alasan keamanan, penggantian email utama harus dilakukan melalui permintaan ke tim support kami. Silakan hubungi kami melalui email."
            />
            <FAQItem
              question="Apakah data saya aman?"
              answer="Ya, kami menggunakan enkripsi standar industri untuk melindungi data Anda. Kami tidak membagikan data pribadi Anda kepada pihak ketiga tanpa izin, kecuali seperti yang dijelaskan dalam Kebijakan Privasi."
            />
            <FAQItem
              question="Bagaimana cara melaporkan penyalahgunaan?"
              answer="Jika Anda menemukan lowongan palsu atau aktivitas mencurigakan, silakan gunakan fitur 'Lapor' pada halaman terkait atau hubungi kami segera."
            />
          </div>
        </section>

        <section className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-100">
          <h2 className="text-center text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Masih Butuh Bantuan?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <a href="mailto:karirkita.my.id@gmail.com" className="flex flex-col items-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Email Support</h3>
              <p className="text-xs md:text-sm text-slate-500">karirkita.my.id@gmail.com</p>
            </a>

            <a href="tel:081807000054" className="flex flex-col items-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Customer Care</h3>
              <p className="text-xs md:text-sm text-slate-500">0818-070000-54</p>
            </a>

            <a href="https://instagram.com/karirkita.my.id" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-4 md:p-6 bg-white rounded-xl md:rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1 text-sm md:text-base">Instagram</h3>
              <p className="text-xs md:text-sm text-slate-500">@karirkita.my.id</p>
            </a>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
};
