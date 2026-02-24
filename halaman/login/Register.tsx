
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../komponen/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircle2, Eye, EyeOff, Check, AlertCircle, Loader2, ShieldCheck, RefreshCw, User, MapPin, ArrowRight, ArrowLeft, XCircle, Plus, Lock, Facebook } from 'lucide-react';
import { SEO } from '../../komponen/umum/SEO';
import { Text } from '../../komponen/ui/Text';
import { routingData } from '../../services/routingData';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { useWilayah } from '../../hooks/useWilayah';
import emailjs from '@emailjs/browser';
import { Skeleton } from '../../komponen/ui/Skeleton';
import { authService } from '../../services/authService';
import { isValidPassword, isValidPhoneNumber } from '../../utils/validators';
import { PhoneInput } from '../../komponen/ui/PhoneInput';
import { OtpInput } from '../../komponen/ui/OtpInput';
import { useRegisterLogic } from '../../hooks/useRegisterLogic';
import { Combobox } from '../../komponen/ui/Combobox'; 
import { UniversalLottie } from '../../komponen/ui/UniversalLottie';
import { Modal } from '../../komponen/ui/Modal';
import { siteConfig } from '../../config/site';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'verify';
const EMAILJS_TEMPLATE_ID = 'email_verify_karirkita';
const EMAILJS_PUBLIC_KEY = 'KLDCj4aB9j7LOTVMt';

// SECURITY CONSTANTS
const OTP_DURATION_SEC = 300;
const MAX_EMAIL_CHANGES = 3;
const SUSPEND_DURATION_MS = 3600000;
const RESEND_COOLDOWN_SEC = 300; 

export const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast, showToast } = useToast();
  
  // Use Custom Logic Hook
  const reg = useRegisterLogic();
  
  // Local UI State (Navigation & Location)
  const { provinces, regencies, districts, villages, fetchRegencies, fetchDistricts, fetchVillages } = useWilayah();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); 
  const [botTrap, setBotTrap] = useState('');
  
  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Location State
  const [selectedProvId, setSelectedProvId] = useState('');
  const [selectedRegId, setSelectedRegId] = useState('');
  const [selectedDistId, setSelectedDistId] = useState('');
  const [selectedVillId, setSelectedVillId] = useState(''); 
  const [domicile, setDomicile] = useState({
      provinsi: '', kota: '', kecamatan: '', kelurahan: ''
  });

  // Verification & Security State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  
  const [timer, setTimer] = useState(0); 
  const [cooldownTimer, setCooldownTimer] = useState(0); 
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [emailChangeCount, setEmailChangeCount] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [isSuspended, setIsSuspended] = useState(false);
  const [suspensionEndTime, setSuspensionEndTime] = useState<number | null>(null);

  // Fetch Meta & Identity
  const [content, setContent] = useState<{ judul: string, deskripsi: string, hero?: string } | null>(null);
  const [identity, setIdentity] = useState({ logoUrl: "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png", nama: "KarirKita" });
  const seoData = siteConfig.pages.register;

  useEffect(() => {
    routingData.getIdentity().then((data: any) => {
        if (data) setIdentity(prev => ({ ...prev, logoUrl: data.logoUrl || prev.logoUrl, nama: data.nama || prev.nama }));
    });
    routingData.getPageData().then(data => {
        if (data && data.register) {
            const register = data.register;
            const isMobile = window.innerWidth < 768;
            const content = isMobile ? register.mobile : register.desktop;

            setContent({ 
                judul: content.judul || "Buat Akun Baru", 
                deskripsi: content.deskripsi || "Lengkapi informasi dasar Anda untuk memulai.",
                hero: content.hero
            });
        } else {
            setContent({ judul: "Buat Akun Baru", deskripsi: "Lengkapi informasi dasar Anda untuk memulai." });
        }
    });

    const suspendEnd = localStorage.getItem('reg_suspend_until');
    if (suspendEnd) {
        const remaining = parseInt(suspendEnd) - Date.now();
        if (remaining > 0) {
            setIsSuspended(true);
            setSuspensionEndTime(parseInt(suspendEnd));
        } else {
            localStorage.removeItem('reg_suspend_until');
        }
    }
  }, []);

  // Generate suggestions on step 2
  useEffect(() => {
      if (step === 2 && reg.usernameSuggestions.length === 0) {
          reg.generateSuggestions();
      }
  }, [step]);

  // Timers
  useEffect(() => {
    let interval: any;
    if (timer > 0) interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    let interval: any;
    if (cooldownTimer > 0) interval = setInterval(() => setCooldownTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [cooldownTimer]);

  useEffect(() => {
      let interval: any;
      if (isSuspended && suspensionEndTime) {
          interval = setInterval(() => {
              const remaining = suspensionEndTime - Date.now();
              if (remaining <= 0) {
                  setIsSuspended(false);
                  setSuspensionEndTime(null);
                  localStorage.removeItem('reg_suspend_until');
                  setEmailChangeCount(0);
              }
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isSuspended, suspensionEndTime]);

  // Combobox Options Mappers
  const provOptions = provinces.map(p => ({ label: p.name, value: p.id }));
  const regOptions = regencies.map(r => ({ label: r.name, value: r.id }));
  const distOptions = districts.map(d => ({ label: d.name, value: d.id }));
  const villOptions = villages.map(v => ({ label: v.name, value: v.id }));

  // Location Handlers (Updated for Combobox direct value)
  const onProvinceChange = (id: string) => {
      setSelectedProvId(id);
      const name = provinces.find(p => p.id === id)?.name || '';
      setDomicile(prev => ({ ...prev, provinsi: name, kota: '', kecamatan: '', kelurahan: '' }));
      // Reset children
      setSelectedRegId('');
      setSelectedDistId('');
      setSelectedVillId('');
      fetchRegencies(id);
  };

  const onRegencyChange = (id: string) => {
      setSelectedRegId(id);
      const name = regencies.find(r => r.id === id)?.name || '';
      setDomicile(prev => ({ ...prev, kota: name, kecamatan: '', kelurahan: '' }));
      // Reset children
      setSelectedDistId('');
      setSelectedVillId('');
      fetchDistricts(id);
  };

  const onDistrictChange = (id: string) => {
      setSelectedDistId(id);
      const name = districts.find(d => d.id === id)?.name || '';
      setDomicile(prev => ({ ...prev, kecamatan: name, kelurahan: '' }));
      // Reset child
      setSelectedVillId('');
      fetchVillages(id);
  };

  const onVillageChange = (id: string) => {
      setSelectedVillId(id);
      const name = villages.find(v => v.id === id)?.name || '';
      setDomicile(prev => ({ ...prev, kelurahan: name }));
  };

  const handleNextStep = () => {
      if (botTrap) { setStep(2); return; }
      if (!reg.firstName || !reg.lastName) { showToast({ message: 'Nama depan dan belakang wajib diisi.', type: 'error' }); return; }
      const rawPhone = reg.phoneNumber.replace(/\D/g, '');
      if (!isValidPhoneNumber(rawPhone)) { showToast({ message: 'Nomor telepon tidak valid.', type: 'error' }); return; }
      if (reg.isPhoneAvailable === false) { showToast({ message: 'Nomor telepon sudah terdaftar.', type: 'error' }); return; }
      if (!domicile.provinsi || !domicile.kota) { showToast({ message: 'Mohon lengkapi alamat domisili.', type: 'error' }); return; }
      setStep(2);
  };

  const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      reg.setEmail(e.target.value);
      
      // If user was previously sending to another email, track change
      if (isOtpSent) {
          const newCount = emailChangeCount + 1;
          setEmailChangeCount(newCount);
          if (newCount >= MAX_EMAIL_CHANGES) {
              const endTime = Date.now() + SUSPEND_DURATION_MS;
              setIsSuspended(true);
              setSuspensionEndTime(endTime);
              localStorage.setItem('reg_suspend_until', endTime.toString());
              showToast({ message: "Aktivitas mencurigakan terdeteksi. Akun disuspend 1 jam.", type: 'error', duration: 5000 });
          }
          setIsOtpSent(false);
          setTimer(0);
          setResendCount(0);
      }
  };

  const sendOtp = async () => {
      if (botTrap || isSuspended) return;
      if (reg.emailError) return showToast({ message: reg.emailError, type: 'error' });
      if (!reg.email) return showToast({ message: "Email wajib diisi.", type: 'error' });
      if (reg.isEmailAvailable === false) return showToast({ message: "Email sudah terdaftar.", type: 'error' });
      if (reg.isUsernameAvailable !== true) return showToast({ message: "Pastikan username valid dan tersedia dahulu.", type: 'error' });
      
      if (cooldownTimer > 0) {
          showToast({ message: `Tunggu ${Math.ceil(cooldownTimer/60)} menit sebelum kirim ulang.`, type: 'info' });
          return;
      }

      setIsSendingOtp(true);
      const generatedOtp = generateOTP();
      setOtp(generatedOtp);

      const publicLogoUrl = identity.logoUrl.startsWith('http') ? identity.logoUrl : 'https://imgur.com/4ihTaYE.png';

      const templateParams = {
          subject: 'Verifikasi Pendaftaran Akun - KarirKita',
          to_email: reg.email,
          to_name: `${reg.firstName} ${reg.lastName}`, 
          otp: generatedOtp,
          duration: Math.floor(OTP_DURATION_SEC / 60),
          theme_color: '#2563eb',
          logo_url: publicLogoUrl, 
          greeting_text: 'Halo, Sahabat Karir!',
          intro_text: 'Selamat datang! Langkah kecil untuk karir besar Anda dimulai di sini. Gunakan kode di bawah ini untuk verifikasi:',
          warning_display: 'none'
      };

      try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
          showToast({ message: "Kode OTP terkirim ke email.", type: 'success' });
          setIsOtpSent(true);
          setTimer(OTP_DURATION_SEC); 
          
          const newResendCount = resendCount + 1;
          setResendCount(newResendCount);
          if (newResendCount >= 2) {
              setCooldownTimer(RESEND_COOLDOWN_SEC);
          }

      } catch (error) {
          console.error(error);
          showToast({ message: "Gagal mengirim email.", type: 'error' });
      } finally {
          setIsSendingOtp(false);
      }
  };

  const verifyOtp = () => {
      if (botTrap || isSuspended) return;
      if (timer === 0) {
          showToast({ message: "Kode OTP kadaluarsa. Minta kode baru.", type: 'error' });
          return;
      }

      if (userOtp === otp) {
          setIsEmailVerified(true);
          setIsOtpSent(false); 
          showToast({ message: "Email diverifikasi!", type: 'success' });
      } else {
          showToast({ message: "Kode OTP salah.", type: 'error' });
      }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botTrap || isSuspended) return;

    if (!reg.username || !reg.isUsernameAvailable) return showToast({ message: "Username tidak tersedia.", type: 'error' });
    if (!isEmailVerified) return showToast({ message: "Verifikasi email dulu.", type: 'error' });
    if (!isValidPassword(reg.password)) return showToast({ message: "Password minimal 8 karakter, wajib mengandung huruf, angka, dan simbol.", type: 'error' });

    setIsLoading(true);
    
    try {
        const payload = {
            username: reg.username,
            password: reg.password,
            email_kontak: reg.email,
            telepon_kontak: reg.phoneNumber.replace(/\D/g, ''),
            nama_lengkap: `${reg.firstName} ${reg.lastName}`,
            domisili: `${domicile.kota}, ${domicile.provinsi}`,
            provinsi: domicile.provinsi,
            kota: domicile.kota,
            kecamatan: domicile.kecamatan,
            kelurahan: domicile.kelurahan,
        };

        const res: any = await authService.register(payload);
        if (res.success) {
            // Trigger Success Animation Modal
            setIsLoading(false);
            setShowSuccessModal(true);
            
            // Wait 4.5 seconds (4500ms) then redirect
            setTimeout(() => {
                navigate('/login');
            }, 4500);
        } else {
            showToast({ message: res.error || "Gagal registrasi.", type: 'error' });
            setIsLoading(false);
        }
    } catch (err) {
        showToast({ message: "Terjadi kesalahan sistem.", type: 'error' });
        setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleMaintenance = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast({ message: "Fitur ini sedang dalam perbaikan (Maintenance)", type: 'info' });
  };

  return (
    <>
    {/* --- MOBILE HERO SECTION (Blue Banner) --- */}
    <div className="lg:hidden bg-blue-600 px-6 pt-10 pb-20 rounded-b-[0px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center text-white">
            <Link to="/" className="mb-6 bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/20">
                <img src={identity.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-white" />
            </Link>
            <h1 className="text-3xl font-black mb-2 tracking-tight"><Text>{content?.judul || 'Daftar Akun'}</Text></h1>
            <p className="text-blue-100 text-sm font-medium opacity-90"><Text>{content?.deskripsi || 'Mulai karir profesional Anda.'}</Text></p>
        </div>
    </div>

    {/* --- MAIN CONTAINER (White Overlap on Mobile) --- */}
    <div className="w-full max-w-md mx-auto relative z-20 -mt-10 lg:mt-0 bg-white rounded-t-[2rem] lg:rounded-none px-6 pt-8 pb-12 lg:p-0 shadow-xl lg:shadow-none animate-in slide-in-from-bottom-8 duration-500">
       <SEO 
         title={seoData.title} 
         description={seoData.description} 
         keywords="daftar karirkita, registrasi pencari kerja, buat akun loker" 
         image={seoData.image} 
       />
       {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Desktop Header */}
      <div className="hidden lg:block relative z-20">
        <Link to="/" className="flex items-center gap-2 mb-6 group w-fit">
            <img src={identity.logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">{identity.nama}</span>
        </Link>
      </div>

      {isSuspended && suspensionEndTime && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-sm animate-pulse">
              <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                      <h3 className="font-bold text-red-700">Akses Dibekukan Sementara</h3>
                      <p className="text-sm text-red-600 mt-1">
                          Terdeteksi aktivitas mencurigakan. Coba lagi dalam <strong>{Math.ceil((suspensionEndTime - Date.now()) / 60000)} menit</strong>.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Desktop Mode Title */}
      <div className="mb-6 hidden lg:block">
          {!content ? (
              <div className="space-y-2"><Skeleton className="h-10 w-3/4 rounded-lg" /><Skeleton className="h-4 w-full rounded-lg" /></div>
          ) : (
              <><h1 className="text-3xl font-bold text-slate-900 mb-2"><Text>{content.judul}</Text></h1><p className="text-slate-500 leading-relaxed text-sm"><Text>{content.deskripsi}</Text></p></>
          )}
      </div>

      {/* --- MOBILE ONLY LOTTIE (Inside White Container) --- */}
      <div className="w-full h-40 md:h-64 my-2 lg:hidden animate-in fade-in zoom-in duration-700">
          <UniversalLottie src={content?.hero ? `https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/${content.hero}` : "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/IndonesiaConnect.lottie"} />
      </div>

      <div className="mb-8 flex items-center gap-2">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
      </div>

      <form className="space-y-5" onSubmit={handleRegister}>
          {/* Honeypot */}
          <input type="text" name="fax_number_verification" value={botTrap} onChange={(e) => setBotTrap(e.target.value)} tabIndex={-1} autoComplete="off" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }} aria-hidden="true" />

          {/* STEP 1 */}
          {step === 1 && !isSuspended && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Depan</label><input required type="text" maxLength={30} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none transition-all bg-white" placeholder="John" value={reg.firstName} onChange={(e) => reg.setFirstName(e.target.value)} /></div>
                      <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Belakang</label><input required type="text" maxLength={30} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none transition-all bg-white" placeholder="Doe" value={reg.lastName} onChange={(e) => reg.setLastName(e.target.value)} /></div>
                  </div>

                  <div>
                      <div className="relative z-20">
                          <PhoneInput 
                            label="Nomor Telepon"
                            value={reg.phoneNumber}
                            onChange={reg.setPhoneNumber}
                            error={reg.phoneError}
                          />
                          <div className="absolute right-3 top-[2.2rem]">
                              {reg.isPhoneChecking ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : 
                               reg.isPhoneAvailable === true ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                               reg.isPhoneAvailable === false ? <XCircle className="w-5 h-5 text-red-500" /> : null}
                          </div>
                      </div>
                  </div>

                  <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600"/> Alamat Domisili</h4>
                      <div className="grid grid-cols-2 gap-3">
                          <Combobox 
                            options={provOptions} 
                            value={selectedProvId} 
                            onChange={onProvinceChange} 
                            placeholder="Provinsi" 
                            className="text-xs"
                          />
                          <Combobox 
                            options={regOptions} 
                            value={selectedRegId} 
                            onChange={onRegencyChange} 
                            placeholder="Kota/Kab" 
                            disabled={!selectedProvId}
                            className="text-xs"
                          />
                          <Combobox 
                            options={distOptions} 
                            value={selectedDistId} 
                            onChange={onDistrictChange} 
                            placeholder="Kecamatan" 
                            disabled={!selectedRegId}
                            className="text-xs"
                          />
                          <Combobox 
                            options={villOptions} 
                            value={selectedVillId} 
                            onChange={onVillageChange} 
                            placeholder="Kelurahan" 
                            disabled={!selectedDistId}
                            className="text-xs"
                          />
                      </div>
                  </div>

                  <Button type="button" onClick={handleNextStep} className="w-full h-12 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white mt-4">
                      <Text>Lanjut</Text> <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
              </div>
          )}

          {/* STEP 2 */}
          {step === 2 && !isSuspended && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-2 font-medium">
                      <ArrowLeft className="w-4 h-4" /> Kembali
                  </button>

                  <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                      <div className="relative">
                          <input 
                            required type="text" maxLength={20}
                            className={`w-full h-12 pl-10 pr-10 rounded-xl border outline-none transition-all bg-white ${reg.usernameError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100'}`}
                            placeholder="username_anda" 
                            value={reg.username} 
                            onChange={(e) => reg.setUsername(e.target.value)} 
                          />
                          <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                          <div className="absolute right-3 top-3.5">
                              {reg.isUsernameChecking ? <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> : 
                               reg.isUsernameAvailable === true ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                               reg.isUsernameAvailable === false ? <XCircle className="w-5 h-5 text-red-500" /> : null}
                          </div>
                      </div>
                      
                      {/* Suggestions UI */}
                      {reg.usernameSuggestions.length > 0 && !reg.isUsernameAvailable && (
                          <div className="mt-3">
                              <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-slate-500">Tersedia:</span>
                                  <button type="button" onClick={reg.generateSuggestions} className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Refresh</button>
                              </div>
                              <ul className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white divide-y divide-slate-100">
                                  {reg.usernameSuggestions.map((sug, idx) => (
                                      <li 
                                        key={idx} 
                                        onClick={() => reg.setUsername(sug)} 
                                        className="p-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer flex items-center justify-between group transition-colors"
                                      >
                                          <span className="font-medium font-mono tracking-tight">{sug}</span>
                                          <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-blue-300 group-hover:bg-blue-100 flex items-center justify-center">
                                              <Plus className="w-3 h-3 text-slate-300 group-hover:text-blue-600" />
                                          </div>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      )}

                      {reg.usernameError && (
                          <div className="bg-red-50 p-3 rounded-xl mt-2 flex gap-3 items-start animate-in slide-in-from-top-1 border border-red-100">
                              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                              <p className="text-red-600 text-xs leading-relaxed font-medium">{reg.usernameError}</p>
                          </div>
                      )}
                  </div>

                  <div className={`transition-all duration-300 ${!reg.isUsernameAvailable ? 'opacity-70' : 'opacity-100'}`}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between">
                          Email Address
                          {!reg.isUsernameAvailable && <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded">Terkunci</span>}
                      </label>
                      <div className="relative">
                          <input 
                            required type="email" maxLength={80}
                            className={`w-full h-12 px-4 rounded-xl border outline-none transition-all ${isEmailVerified ? 'border-green-500 bg-gray-50 text-gray-500 cursor-not-allowed' : (!reg.isUsernameAvailable ? 'border-slate-200 bg-slate-100 cursor-not-allowed' : (reg.emailError ? 'border-red-300' : 'border-slate-200 focus:border-blue-500'))}`} 
                            placeholder="nama@gmail.com" 
                            value={reg.email} 
                            onChange={handleEmailChange} 
                            disabled={!reg.isUsernameAvailable || isEmailVerified || isOtpSent} 
                          />
                          
                          {isEmailVerified ? (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 flex items-center gap-1 bg-white p-1 rounded-full shadow-sm">
                                  <Lock className="w-3 h-3 text-slate-400 mr-1" />
                                  <ShieldCheck className="w-5 h-5" />
                              </div>
                          ) : (
                              <button 
                                type="button" 
                                onClick={sendOtp} 
                                disabled={isSendingOtp || !reg.email || isOtpSent || reg.isEmailAvailable === false || !reg.isUsernameAvailable || cooldownTimer > 0} 
                                className="absolute right-1 top-1 bottom-1 px-4 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                  {isSendingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                   (cooldownTimer > 0 ? formatTime(cooldownTimer) : (isOtpSent ? 'Kirim Ulang' : 'Verifikasi'))}
                              </button>
                          )}
                          <div className="absolute right-24 top-3.5 mr-2">
                              {reg.isEmailChecking ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> :
                               reg.isEmailAvailable === false ? <XCircle className="w-4 h-4 text-red-500" /> : null}
                          </div>
                      </div>
                      
                      {reg.emailError && <p className="text-red-500 text-xs mt-1">{reg.emailError}</p>}
                      {!reg.isUsernameAvailable && <p className="text-slate-400 text-xs mt-1 flex items-center gap-1 italic"><Check className="w-3 h-3" /> Pastikan username valid.</p>}

                      {isOtpSent && !isEmailVerified && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-in slide-in-from-top-2">
                              <p className="text-xs text-blue-700 mb-4 font-medium text-center">
                                Masukkan 4 digit kode OTP yang dikirim ke <strong>{reg.email}</strong>
                              </p>
                              
                              <div className="flex flex-col gap-4 items-center">
                                  <OtpInput 
                                    length={4} 
                                    value={userOtp} 
                                    onChange={(val) => setUserOtp(val.replace(/\D/g, ''))}
                                    disabled={timer === 0}
                                  />
                                  
                                  <div className="flex flex-col items-center gap-2 w-full">
                                      {timer > 0 ? (
                                          <div className={`text-xs font-bold font-mono ${timer < 60 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                                              Berlaku: {formatTime(timer)}
                                          </div>
                                      ) : (
                                          <div className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                                              Waktu Habis. Silakan minta kode baru.
                                          </div>
                                      )}

                                      <Button 
                                        type="button" 
                                        size="sm" 
                                        onClick={verifyOtp} 
                                        disabled={userOtp.length !== 4 || timer === 0}
                                        className="w-full"
                                      >
                                        Verifikasi Kode
                                      </Button>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
                  
                  {isEmailVerified && (
                      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                          <div>
                              <div className="flex justify-between">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <span className="text-[10px] text-slate-400 mt-0.5">Min. 8 karakter, huruf, angka, simbol</span>
                              </div>
                              <div className="relative">
                                  <input required type={reg.showPassword ? "text" : "password"} maxLength={64} className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white" placeholder="S3cr3tP@ss!" value={reg.password} onChange={(e) => reg.setPassword(e.target.value)} />
                                  <button type="button" onClick={() => reg.setShowPassword(!reg.showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">{reg.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                              </div>
                          </div>
                          <Button className="w-full h-12 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white mt-2" isLoading={isLoading}><Text>Daftar Sekarang</Text></Button>
                      </div>
                  )}
              </div>
          )}
      </form>

      {/* Social Login Section */}
      <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-3 text-slate-400"><Text>Atau Daftar Dengan</Text></span></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
          <button onClick={handleMaintenance} className="flex items-center justify-center h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors hover:border-slate-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
          </button>
          <button onClick={handleMaintenance} className="flex items-center justify-center h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors hover:border-slate-300">
              <Facebook className="w-5 h-5 text-[#1877F2]" />
          </button>
          <button onClick={handleMaintenance} className="flex items-center justify-center h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors hover:border-slate-300">
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.13-.48-3.08.48-1.04.98-2.17.93-3.13-.11-.88-.95-1.58-1.84-2.13-2.92-1.63-3.23-1.39-6.9.59-9.05.95-1.04 2.61-1.69 4.36-1.58 1.14.07 2.21.61 2.95.61.69 0 2.05-.73 3.49-.62 1.48.11 2.6.76 3.32 1.84-2.89 1.76-2.4 5.92.51 7.12-.45 1.25-1.04 2.5-1.8 3.51-1.12 1.51-2.3 3.03-4.25 2.92l-.01.01c-.01 0-.01 0-.02 0zm-3.32-15.66c.88-1.07 1.48-2.55 1.31-4.07-1.28.05-2.83.85-3.75 1.93-.82.96-1.53 2.52-1.34 4.02 1.43.11 2.91-.81 3.78-1.88z"/></svg>
          </button>
      </div>

      <div className="mt-8 mb-4 pb-4 text-center text-sm font-medium text-slate-500">
          <Text>Sudah punya akun?</Text> <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1 relative z-10"><Text>Masuk</Text></Link>
      </div>
    </div>

    {/* Success Modal - Full Screen Overlay */}
    {showSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-64 h-64 md:w-80 md:h-80 mb-6">
                <UniversalLottie 
                    src="https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/BerhasilVerifikasi.lottie" 
                    loop={false} 
                    autoplay={true} 
                />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Pendaftaran Berhasil!
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium animate-in slide-in-from-bottom-4 duration-700 delay-500">
                Terima kasih telah bergabung.
            </p>
            <p className="text-slate-400 text-sm mt-8 animate-pulse">Mengalihkan ke halaman login...</p>
        </div>
    )}
    </>
  );
};
