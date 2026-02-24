import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { LegalLayout } from './LegalLayout';
import { Button } from '../../komponen/ui/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';

export const ContactUs = () => {
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:karirkita.my.id@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`)}`;
    
    window.location.href = mailtoLink;

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      showToast({ message: 'Pesan Anda berhasil dikirim!', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  return (
    <LegalLayout
      title="Hubungi Kami"
      subtitle="Kami siap membantu Anda. Silakan hubungi kami melalui formulir atau kontak di bawah ini."
      icon={<Mail className="w-6 h-6 md:w-8 md:h-8" />}
      seoTitle="Hubungi Kami - KarirKita"
      seoDescription="Hubungi tim KarirKita untuk pertanyaan, saran, atau bantuan seputar layanan kami."
      heroPageKey="contact"
    >
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Contact Information */}
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Informasi Kontak</h2>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">Alamat Kantor (Online Office)</h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    Business Consultant Center Nagri Kidul<br />
                    Kec. Purwakarta, Kabupaten Purwakarta<br />
                    Jawa Barat 41111
                  </p>
                  <a 
                    href="https://share.google/Qbfh0ybWbJCbZzSF0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs md:text-sm text-blue-600 hover:underline mt-1 inline-block"
                  >
                    Lihat di Google Maps
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">Email</h3>
                  <p className="text-slate-600 text-sm md:text-base">
                    <span className="block mb-1"><strong>Utama:</strong> karirkita.my.id@gmail.com</span>
                    <span className="block"><strong>Office Center:</strong> office.alincorporation@gmail.com</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">Customer Care</h3>
                  <p className="text-slate-600 text-sm md:text-base">0818-070000-54</p>
                  <p className="text-xs text-slate-400 mt-1">Senin - Jumat, 09:00 - 17:00 WIB</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Media Sosial</h2>
            <div className="flex gap-3 md:gap-4">
              <a href="https://instagram.com/karirkita.my.id" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-pink-50 text-pink-600 rounded-lg md:rounded-xl hover:bg-pink-100 transition-colors font-medium text-sm md:text-base">
                Instagram @karirkita.my.id
              </a>
            </div>
          </section>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Kirim Pesan</h2>
          
          {isSuccess ? (
            <div className="bg-green-50 border border-green-100 rounded-xl md:rounded-2xl p-6 md:p-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-green-800 mb-2">Pesan Terkirim!</h3>
              <p className="text-sm md:text-base text-green-700">Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda.</p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-4 md:mt-6 text-sm font-bold text-green-700 hover:underline"
              >
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1 md:mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm md:text-base"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1 md:mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm md:text-base"
                  placeholder="nama@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1 md:mb-1.5">Subjek</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white text-sm md:text-base"
                  placeholder="Judul pesan Anda"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs md:text-sm font-semibold text-slate-700 mb-1 md:mb-1.5">Pesan</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white resize-none text-sm md:text-base"
                  placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full h-10 md:h-12 rounded-lg md:rounded-xl text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Kirim Pesan <Send className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </LegalLayout>
  );
};
