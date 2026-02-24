
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../komponen/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Facebook, Eye, EyeOff, Mail, ArrowLeft, Lock, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { SEO } from '../../komponen/umum/SEO';
import { Text } from '../../komponen/ui/Text';
import { routingData } from '../../services/routingData';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { authService } from '../../services/authService';
import { PhoneInput } from '../../komponen/ui/PhoneInput';
import { OtpInput } from '../../komponen/ui/OtpInput';
import { isValidPassword } from '../../utils/validators';
import emailjs from '@emailjs/browser';
import { UniversalLottie } from '../../komponen/ui/UniversalLottie';
import { siteConfig } from '../../config/site';

// EmailJS Config (Reused)
const EMAILJS_SERVICE_ID = 'verify';
const EMAILJS_TEMPLATE_ID = 'email_verify_karirkita';
const EMAILJS_PUBLIC_KEY = 'KLDCj4aB9j7LOTVMt';

const OTP_DURATION_SEC = 300; 

type LoginMode = 'login' | 'forgot_request' | 'forgot_verify' | 'forgot_reset';
type Method = 'email' | 'phone';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Success Animation State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Anti-Spam Honeypot State
  const [botTrap, setBotTrap] = useState('');

  // State Flow
  const [mode, setMode] = useState<LoginMode>('login');
  const [method, setMethod] = useState<Method>('email');

  // Input States
  const [identifier, setIdentifier] = useState(''); 
  const [phone, setPhone] = useState(''); 
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP States
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [targetMaskedEmail, setTargetMaskedEmail] = useState(''); 

  // Meta Data
  const [content, setContent] = useState<{ judul: string, deskripsi: string, hero?: string } | null>(null);
  const [identity, setIdentity] = useState({ logoUrl: "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png", nama: "KarirKita" });
  const seoData = siteConfig.pages.login;

  useEffect(() => {
    routingData.getIdentity().then((data: any) => { if (data) setIdentity(prev => ({...prev, logoUrl: data.logoUrl || prev.logoUrl, nama: data.nama || prev.nama })); });
    routingData.getPageData().then(data => {
        if (data && data.login) { 
            const login = data.login;
            const isMobile = window.innerWidth < 768;
            const content = isMobile ? login.mobile : login.desktop;

            setContent({ 
                judul: content.judul || "Masuk Akun", 
                deskripsi: content.deskripsi || "Lanjutkan perjalanan karir Anda sekarang.",
                hero: content.hero
            }); 
        } 
        else { setContent({ judul: "Masuk ke Akun", deskripsi: "Lanjutkan perjalanan karir Anda sekarang." }); }
    });
  }, []);

  // Timer Countdown
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleMaintenance = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast({ message: "Fitur ini sedang dalam perbaikan (Maintenance)", type: 'info' });
  };

  const getActiveIdentifier = () => {
      if (method === 'phone') return phone.replace(/\D/g, ''); 
      return identifier;
  };

  // Helper to mask email
  const maskEmail = (emailStr: string) => {
      const parts = emailStr.split('@');
      if (parts.length < 2) return emailStr;
      
      const name = parts[0];
      const domain = parts[1];
      
      if (name.length <= 4) {
          return `${name.slice(0, 1)}***@${domain}`;
      }
      const prefix = name.slice(0, 3);
      const suffix = name.slice(-3);
      return `${prefix}***${suffix}@${domain}`;
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- LOGIC: SEND OTP ---
  const handleSendOTP = async () => {
      if (botTrap) {
          setIsLoading(true);
          setTimeout(() => { setIsLoading(false); setTimer(120); setMode('forgot_verify'); }, 1500);
          return;
      }

      const activeInput = getActiveIdentifier();
      if (!activeInput) return showToast({ message: "Mohon isi data terlebih dahulu.", type: 'error' });

      setIsLoading(true);

      let emailToSend = '';
      if (method === 'email') {
          if (!identifier.includes('@')) {
              setIsLoading(false);
              return showToast({ message: "Mohon masukkan format email yang benar.", type: 'error' });
          }
          emailToSend = identifier;
      } else {
          emailToSend = `user${activeInput.substring(activeInput.length - 4)}@gmail.com`; 
      }

      setTargetMaskedEmail(maskEmail(emailToSend));
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      const publicLogoUrl = identity.logoUrl.startsWith('http') ? identity.logoUrl : 'https://imgur.com/4ihTaYE.png';

      const templateParams = {
          subject: mode === 'forgot_request' ? 'PERINGATAN: Permintaan Reset Password - KarirKita' : 'Kode OTP Login - KarirKita',
          to_email: emailToSend,
          to_name: emailToSend.split('@')[0],
          otp: otp,
          duration: '5', 
          theme_color: '#dc2626',
          logo_url: publicLogoUrl,
          greeting_text: 'Permintaan Reset Password',
          intro_text: 'Kami menerima permintaan untuk mereset kata sandi akun KarirKita Anda. Gunakan kode berikut untuk melanjutkan:',
          warning_display: 'block'
      };

      try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
          setTimer(OTP_DURATION_SEC); // 5 Mins
          setMode('forgot_verify');
          showToast({ message: "Kode OTP 6 digit terkirim.", type: 'success' });
      } catch (error) {
          console.error(error);
          showToast({ message: "Gagal mengirim email.", type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  // --- LOGIC: VERIFY OTP ---
  const handleVerifyOTP = () => {
      if (botTrap) return;

      if (timer === 0) {
          return showToast({ message: "Kode OTP sudah kadaluarsa. Kirim ulang.", type: 'error' });
      }
      if (inputOtp !== generatedOtp) {
          return showToast({ message: "Kode OTP salah.", type: 'error' });
      }
      
      showToast({ message: "Verifikasi Berhasil!", type: 'success' });
      setMode('forgot_reset');
  };

  // --- LOGIC: RESET PASSWORD ---
  const handleResetPassword = async () => {
      if (botTrap) return;

      if (!isValidPassword(newPassword)) {
          return showToast({ message: "Password minimal 8 karakter, ada huruf, angka, simbol.", type: 'error' });
      }
      
      setIsLoading(true);
      try {
          await authService.resetPassword({ identifier: getActiveIdentifier(), newPassword });
          showToast({ message: "Password berhasil diubah! Silakan login.", type: 'success' });
          setMode('login');
          setPassword('');
          setNewPassword('');
          setInputOtp('');
      } catch (err) {
          showToast({ message: "Gagal mengubah password.", type: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  // --- LOGIC: NORMAL LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botTrap) return;

    const activeId = getActiveIdentifier();
    if (!activeId || !password) return showToast({ message: "Lengkapi data login.", type: 'error' });

    setIsLoading(true);
    
    try {
        const res: any = await authService.login({ identifier: activeId, password: password });
        if (res.success && res.user) {
            const role = res.user.role || 'user';
            
            // 1. Set Auth Context
            login({
                id: res.user.user_id,
                name: res.user.nama_lengkap,
                email: res.user.email_kontak,
                role: role,
                avatar: res.user.foto_profil_url
            });
            
            // 2. Show Success Modal & Animation
            setIsLoading(false);
            setShowSuccessModal(true);
            
            // 3. Delay Redirect to show animation
            setTimeout(() => {
                if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/user/dashboard');
                }
            }, 3500); // 3.5 seconds delay
            
        } else {
            showToast({ message: res.error || "Login gagal.", type: 'error' });
            setIsLoading(false);
        }
    } catch (err) {
        showToast({ message: "Gagal terhubung ke server.", type: 'error' });
        setIsLoading(false);
    }
  };

  const renderInputIdentifier = () => {
      if (method === 'email') {
          return (
            <div className="relative animate-in fade-in zoom-in-95 duration-300">
                <input 
                    type="text" 
                    maxLength={80}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400" 
                    placeholder="Username atau Email" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="w-5 h-5" />
                </div>
            </div>
          );
      }
      return (
          <div className="animate-in fade-in zoom-in-95 duration-300">
             <PhoneInput 
                value={phone}
                onChange={setPhone}
                placeholder="812-3456-7890"
             />
          </div>
      );
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
            <h1 className="text-3xl font-black mb-2 tracking-tight"><Text>{content?.judul || 'Masuk'}</Text></h1>
            <p className="text-blue-100 text-sm font-medium opacity-90"><Text>{content?.deskripsi || 'Selamat datang kembali.'}</Text></p>
        </div>
    </div>

    {/* --- MAIN CONTAINER (White Overlap on Mobile) --- */}
    <div className="w-full max-w-md mx-auto relative z-20 -mt-10 lg:mt-0 bg-white rounded-t-[2rem] lg:rounded-none px-6 pt-8 pb-12 lg:p-0 shadow-xl lg:shadow-none animate-in slide-in-from-bottom-8 duration-500">
      <SEO 
        title={seoData.title} 
        description={seoData.description} 
        keywords="login karirkita, masuk akun pencari kerja, login perusahaan" 
        image={seoData.image} 
      />
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Desktop Header (Hidden on Mobile) */}
      <div className="hidden lg:block relative z-20 mb-8">
        <Link to="/" className="flex items-center gap-2 mb-8 group w-fit">
            <img src={identity.logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">{identity.nama}</span>
        </Link>
        {mode === 'login' && (
            <>
                <h1 className="text-3xl font-bold text-slate-900 mb-2"><Text>{content?.judul || 'Masuk'}</Text></h1>
                <p className="text-slate-500 leading-relaxed text-sm"><Text>{content?.deskripsi || 'Selamat datang kembali.'}</Text></p>
            </>
        )}
      </div>

      {/* Sub-Header for Forgot Password Modes */}
      <div className="mb-6">
          {(mode === 'forgot_request' || mode === 'forgot_verify') && (
              <>
                <button onClick={() => setMode('login')} className="flex items-center text-slate-400 hover:text-slate-600 text-sm mb-4 transition-colors"><ArrowLeft className="w-4 h-4 mr-1"/> Kembali Login</button>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Pemulihan Akun</h1>
                <p className="text-slate-500 text-sm">Kami akan mengirimkan kode verifikasi (OTP) untuk mereset kata sandi Anda.</p>
              </>
          )}
          {mode === 'forgot_reset' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Buat Password Baru</h1>
                <p className="text-slate-500 text-sm">Silakan masukkan password baru yang aman.</p>
              </>
          )}
      </div>

      {/* --- MOBILE ONLY LOTTIE (Inside White Container) --- */}
      {mode === 'login' && (
        <div className="w-full h-40 md:h-64 my-2 lg:hidden animate-in fade-in zoom-in duration-700">
            <UniversalLottie src={content?.hero ? `https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/${content.hero}` : "https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/IndonesiaConnect.lottie"} />
        </div>
      )}

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <input type="text" name="fax_number_login" value={botTrap} onChange={(e) => setBotTrap(e.target.value)} tabIndex={-1} autoComplete="off" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }} aria-hidden="true" />

          {/* STEP 1: INPUT IDENTIFIER (LOGIN & REQUEST) */}
          {(mode === 'login' || mode === 'forgot_request') && (
              <div className="space-y-2">
                  <div className="flex justify-between items-center">
                      <label className="block text-sm font-bold text-slate-700">
                          {method === 'email' ? 'Username / Email' : 'Nomor Telepon'}
                      </label>
                      <button 
                        type="button" 
                        onClick={() => {
                            setMethod(method === 'email' ? 'phone' : 'email');
                            setIdentifier('');
                            setPhone('');
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      >
                          {method === 'email' ? 'Gunakan Nomor Telpon' : 'Gunakan Username / Email'}
                      </button>
                  </div>
                  {renderInputIdentifier()}
                  
                  {mode === 'forgot_request' && method === 'phone' && (
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-3 items-start animate-in slide-in-from-top-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-yellow-700 leading-relaxed font-medium">Verifikasi akan dilakukan melalui <strong>email yang terkait</strong> dengan nomor telepon ini. Bukan melalui WhatsApp, Telepon, atau SMS.</p>
                      </div>
                  )}
              </div>
          )}

          {/* STEP 1B: PASSWORD (ONLY LOGIN) */}
          {mode === 'login' && (
              <div>
                  <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-slate-700"><Text>Password</Text></label>
                      <button type="button" onClick={() => setMode('forgot_request')} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">Lupa Password?</button>
                  </div>
                  <div className="relative">
                      <input type={showPassword ? "text" : "password"} maxLength={64} className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
              </div>
          )}

          {/* STEP 2: VERIFY OTP */}
          {mode === 'forgot_verify' && (
              <div className="animate-in slide-in-from-right-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4">
                      <p className="text-sm text-blue-800 text-center mb-4 leading-relaxed">
                          Kode OTP telah dikirimkan ke <br/><strong>{targetMaskedEmail}</strong>
                      </p>
                      <div className="flex justify-center mb-4">
                          <OtpInput length={6} value={inputOtp} onChange={(val) => setInputOtp(val.replace(/\D/g, ''))} disabled={timer === 0} />
                      </div>
                      <div className="text-center mt-3 text-xs font-bold text-slate-500 flex flex-col items-center gap-2">
                          {timer > 0 ? (
                              <span className={timer < 60 ? 'text-red-500 animate-pulse' : ''}>Berlaku: {formatTime(timer)}</span>
                          ) : (
                              <button type="button" onClick={handleSendOTP} className="text-blue-600 hover:underline flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Kirim Ulang Kode</button>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {mode === 'forgot_reset' && (
              <div className="animate-in slide-in-from-right-4 space-y-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Password Baru</label>
                      <div className="relative">
                          <input type={showPassword ? "text" : "password"} maxLength={64} className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-white" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 kar, angka & simbol" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 ml-1 flex items-center gap-1"><Lock className="w-3 h-3"/> Minimal 8 karakter, 1 Angka, 1 Simbol</p>
                  </div>
              </div>
          )}

          {/* ACTION BUTTONS */}
          <Button 
            className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 text-white mt-4 disabled:opacity-50" 
            isLoading={isLoading}
            disabled={mode === 'forgot_verify' && timer === 0}
            onClick={
                mode === 'login' ? handleLogin : 
                mode === 'forgot_request' ? handleSendOTP :
                mode === 'forgot_verify' ? handleVerifyOTP :
                handleResetPassword
            }
          >
              {mode === 'login' ? 'Masuk Sekarang' : 
               mode === 'forgot_request' ? 'Kirim Kode Verifikasi' :
               mode === 'forgot_verify' ? 'Verifikasi OTP' :
               'Simpan Password Baru'}
          </Button>
      </form>

      {/* FOOTER */}
      {mode === 'login' && (
          <>
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-3 text-slate-400"><Text>Atau Masuk Dengan</Text></span></div>
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
                <Text>Belum punya akun?</Text> <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold ml-1 relative z-10"><Text>Daftar</Text></Link>
            </div>
          </>
      )}
    </div>

    {/* Success Modal - Full Screen Overlay */}
    {showSuccessModal && createPortal(
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-64 h-64 md:w-80 md:h-80 mb-6">
                <UniversalLottie 
                    src="https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/lottie/BerhasilVerifikasi.lottie" 
                    loop={false} 
                    autoplay={true} 
                />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                Verifikasi Berhasil
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium animate-in slide-in-from-bottom-4 duration-700 delay-500 text-center px-4">
                Selamat Datang Kembali!
            </p>
            <p className="text-slate-400 text-sm mt-8 animate-pulse">Mengalihkan ke dashboard...</p>
        </div>,
        document.body
    )}
    </>
  );
};
