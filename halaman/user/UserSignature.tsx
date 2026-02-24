
import React, { useRef, useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { PenTool, Save, Link as LinkIcon, QrCode, ArrowLeft, Download, CheckCircle2, Eye, AlertCircle, FileCheck, HelpCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { routingData } from '../../services/routingData';
import { PencariKerja } from '../../types';

export const UserSignature = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast, showToast } = useToast();
    
    // Canvas State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasCanvasContent, setHasCanvasContent] = useState(false);
    
    // Data State
    const [signatureLinkInput, setSignatureLinkInput] = useState('');
    const [userData, setUserData] = useState<PencariKerja | null>(null);
    const [identity, setIdentity] = useState({ logoUrl: 'https://placehold.co/100x100/2563eb/ffffff?text=KK', nama: 'KarirKita' });
    
    // Result/View State
    const [savedSignatureUrl, setSavedSignatureUrl] = useState<string>('');
    const [verificationId, setVerificationId] = useState<string>('');
    const [isSaved, setIsSaved] = useState(false);

    // 1. Fetch User Data & Existing Signature
    useEffect(() => {
        // Fetch Identity
        routingData.getIdentity().then((data: any) => {
            if (data && data.logoUrl) setIdentity(prev => ({...prev, logoUrl: data.logoUrl, nama: data.nama}));
        });

        routingData.getTalents().then(data => {
            const found = data.find(t => t.email_kontak === user?.email) || data[0]; // Fallback demo
            if (found) {
                setUserData(found);
                
                // Cek LocalStorage dulu (untuk simulasi update realtime di demo)
                const localSig = localStorage.getItem(`signature_${found.username}`);
                
                if (localSig) {
                    setSavedSignatureUrl(localSig);
                    setSignatureLinkInput(localSig.startsWith('data:') ? '' : localSig); 
                    setIsSaved(true);
                    setVerificationId(`SIGN-${found.user_id?.toUpperCase() || 'USR'}-${new Date().getFullYear()}`);
                } else if (found.tanda_tangan) {
                    // Jika tidak ada di local, ambil dari JSON
                    setSavedSignatureUrl(found.tanda_tangan);
                    setSignatureLinkInput(found.tanda_tangan);
                    setIsSaved(true);
                    setVerificationId(`SIGN-${found.user_id?.toUpperCase() || 'USR'}-${new Date().getFullYear()}`);
                }
            }
        });
    }, [user]);

    // 2. Canvas Initialization
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = '#000000';
            }
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            if(ctx) ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        }
    }, []);

    // --- Drawing Logic ---
    const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ('touches' in event) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = (event as React.MouseEvent).clientX;
            clientY = (event as React.MouseEvent).clientY;
        }
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if(e.cancelable) e.preventDefault();
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) { ctx.beginPath(); ctx.moveTo(x, y); }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if(e.cancelable) e.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.stroke();
            if (!hasCanvasContent) setHasCanvasContent(true);
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        if(ctx) ctx.beginPath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasCanvasContent(false);
        }
    };

    // --- Action Handlers ---

    // Download Draft PNG (Fitur Bantuan)
    const handleDownloadPng = () => {
        if (!canvasRef.current || !hasCanvasContent) {
            showToast({ message: 'Canvas masih kosong!', type: 'error' });
            return;
        }
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `Signature_${userData?.username || 'user'}.png`;
        link.click();
        showToast({ message: 'Gambar Tanda Tangan diunduh. Silakan upload ke hosting gambar Anda.', type: 'info' });
    };

    // Simpan ke Profil (Mock Database) - HANYA DARI LINK
    const handleSave = () => {
        if (!signatureLinkInput) {
            showToast({ message: 'Wajib mengisi kolom Link Gambar untuk menyimpan!', type: 'error' });
            return;
        }

        const finalUrl = signatureLinkInput;

        // Mock Persistence
        setSavedSignatureUrl(finalUrl);
        const newId = `SIGN-${userData?.user_id?.toUpperCase() || 'USR'}-${Math.floor(1000 + Math.random() * 9000)}`;
        setVerificationId(newId);
        setIsSaved(true);
        
        // Simpan ke localStorage agar bisa dibaca di halaman Preview (Simulasi Backend)
        if (userData) {
            localStorage.setItem(`signature_${userData.username}`, finalUrl);
        }
        
        showToast({ message: 'Tanda tangan berhasil disimpan & diterbitkan!', type: 'success' });
    };

    return (
        <div className="pb-20 animate-fade-in-up">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/user/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Tanda Tangan Digital</h1>
                    <p className="text-slate-500 font-medium text-sm">Kelola tanda tangan resmi untuk dokumen dan verifikasi.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* --- LEFT COLUMN: EDITOR --- */}
                <div className="lg:col-span-7 space-y-6">
                    <Card className="p-6 md:p-8 rounded-[2rem] border-slate-200 shadow-sm relative overflow-hidden">
                        
                        {/* AREA KANVAS (ALAT BANTU) */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <PenTool className="w-5 h-5 text-blue-600" /> Generator Tanda Tangan
                                </h3>
                                {/* Helper Tools */}
                                <div className="flex gap-2">
                                    <button onClick={clearCanvas} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                        Reset
                                    </button>
                                    <button onClick={handleDownloadPng} disabled={!hasCanvasContent} className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1">
                                        <Download className="w-3.5 h-3.5" /> PNG
                                    </button>
                                </div>
                            </div>
                            
                            {/* Petunjuk Penggunaan Kanvas */}
                            <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl mb-3 text-xs text-blue-800 leading-relaxed flex gap-2">
                                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>
                                    <strong>Fitur Bantuan:</strong> Gunakan area ini untuk menggambar tanda tangan Anda, lalu klik tombol <strong>PNG</strong> untuk mengunduhnya. <br/>
                                    File PNG tersebut bisa Anda upload ke hosting gambar (Google Drive, Imgur, dll) untuk mendapatkan link publik.
                                </p>
                            </div>

                            <div className="relative w-full h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 touch-none cursor-crosshair overflow-hidden hover:border-blue-300 transition-colors">
                                <canvas
                                    ref={canvasRef}
                                    className="w-full h-full block"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                                {!hasCanvasContent && !isDrawing && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 select-none">
                                        <span className="text-slate-400 font-handwriting text-2xl font-bold rotate-[-5deg]">Gambar Disini</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEPARATOR */}
                        <div className="relative flex py-2 items-center mb-6">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">INPUT UNTUK PUBLIKASI (WAJIB)</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* INPUT LINK (UTAMA) */}
                        <div className="mb-8">
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-bold text-slate-700">Link Gambar Tanda Tangan</label>
                                <span className="text-xs text-red-500 font-bold">*Wajib Diisi</span>
                            </div>
                            <Input 
                                placeholder="https://example.com/my-signature.png" 
                                value={signatureLinkInput}
                                onChange={(e) => setSignatureLinkInput(e.target.value)}
                                className="bg-slate-50 border-blue-200 focus:border-blue-500"
                                icon={<LinkIcon className="w-4 h-4" />}
                            />
                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3"/> 
                                Masukkan URL gambar langsung (Direct Link) agar tanda tangan muncul di dokumen.
                            </p>
                        </div>

                        <Button 
                            onClick={handleSave} 
                            disabled={!signatureLinkInput}
                            className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5 mr-2" /> Simpan & Terbitkan
                        </Button>
                    </Card>
                </div>

                {/* --- RIGHT COLUMN: PREVIEW & PUBLIC LINK --- */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* STATE: BELUM DISIMPAN */}
                    {!isSaved && (
                        <Card className="p-6 rounded-[2rem] bg-slate-50 border-slate-200 border-dashed border-2 text-center h-full min-h-[300px] flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                <QrCode className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Link Publik Belum Aktif</h3>
                            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                Silakan masukkan <strong>Link Gambar</strong> yang valid, lalu klik <strong>Simpan</strong> untuk mengaktifkan halaman verifikasi publik.
                            </p>
                        </Card>
                    )}

                    {/* STATE: SUDAH DISIMPAN (TAMPILKAN QR & LINK) */}
                    {isSaved && savedSignatureUrl && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                            
                            {/* Card Status Publikasi */}
                            <Card className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <FileCheck className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-green-400/20 rounded-full border border-green-400/30">
                                            <CheckCircle2 className="w-5 h-5 text-green-300" />
                                        </div>
                                        <span className="font-bold text-green-300 tracking-wide text-sm">TERVERIFIKASI</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">Tanda Tangan Publik</h3>
                                    <p className="text-blue-200 text-xs font-mono mb-6 opacity-80">Ref ID: {verificationId}</p>
                                    
                                    {userData && (
                                        <Link to={`/signature/${userData.username}`} className="block w-full">
                                            <Button className="w-full bg-white text-blue-700 hover:bg-blue-50 border-none font-bold h-12 rounded-xl shadow-lg">
                                                <Eye className="w-4 h-4 mr-2" /> Lihat Sertifikat Digital
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </Card>

                            {/* Card Detail Link & QR */}
                            <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <QrCode className="w-4 h-4 text-slate-500" /> Akses Validasi
                                </h4>
                                
                                <div className="flex flex-col gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 relative">
                                            {/* Centered Logo in QR Code with High ECC */}
                                            <div className="relative w-16 h-16">
                                                <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/signature/' + userData?.username)}&color=000000&ecc=H`} 
                                                    alt="QR" 
                                                    className="w-full h-full mix-blend-multiply" 
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-5 h-5 bg-white rounded-md p-0.5 flex items-center justify-center shadow-sm border border-slate-100">
                                                        <img src={identity.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Public URL</p>
                                            <p className="text-sm font-bold text-blue-600 truncate">karirkita.my.id/signature/{userData?.username}</p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 text-sm text-yellow-800">
                                        <AlertCircle className="w-5 h-5 shrink-0" />
                                        <p className="text-xs leading-relaxed">
                                            <strong>Info Legal:</strong> QR Code ini mengarah langsung ke halaman validasi tanda tangan Anda yang berisi logo KarirKita di tengahnya.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
