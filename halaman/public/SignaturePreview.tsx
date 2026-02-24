
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { routingData } from '../../services/routingData';
import { PencariKerja, Identitas } from '../../types';
import { CheckCircle2, ShieldCheck, Calendar, Scale, Printer, ChevronLeft, ArrowLeft } from 'lucide-react';
import { Button } from '../../komponen/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const SignaturePreview = () => {
    const { username } = useParams();
    const { user } = useAuth(); 
    const [userData, setUserData] = useState<PencariKerja | null>(null);
    const [signatureUrl, setSignatureUrl] = useState('');
    const [identity, setIdentity] = useState<Partial<Identitas>>({ logoUrl: 'https://placehold.co/100x100/2563eb/ffffff?text=KK', nama: 'KarirKita' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            // 1. Fetch Identity
            try {
                const idData = await routingData.getIdentity();
                if (idData) setIdentity(idData);
            } catch (e) { console.error(e); }

            // 2. Fetch User & Signature
            try {
                const users = await routingData.getTalents();
                const found = users.find(u => u.username === username);
                if (found) {
                    setUserData(found);
                    const storedSig = localStorage.getItem(`signature_${found.username}`);
                    setSignatureUrl(storedSig || found.tanda_tangan || '');
                }
            } catch (e) { console.error(e); }
            
            setLoading(false);
        };
        load();
    }, [username]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-medium animate-pulse">Memuat Verifikasi...</div>;
    if (!userData || !signatureUrl) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-bold p-4 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-300 mb-4" />
            <p>Data Tanda Tangan Tidak Ditemukan / Belum Dibuat.</p>
            <Link to="/" className="mt-4">
                <Button variant="outline">Kembali ke Beranda</Button>
            </Link>
        </div>
    );

    const garudaLogo = identity.aset?.garuda;
    const verificationLink = window.location.href;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationLink)}&color=0f172a&ecc=H`;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans">
            <div className="max-w-[210mm] mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 relative z-50 print:hidden">
                {user ? (
                    <Link to="/user/signature" className="w-full md:w-auto">
                        <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-white/50 w-full md:w-auto justify-start">
                            <ChevronLeft className="w-4 h-4 mr-2" /> Kembali ke Editor
                        </Button>
                    </Link>
                ) : (
                    <Link to="/" className="w-full md:w-auto">
                        <Button variant="ghost" className="text-slate-600 hover:text-blue-600 hover:bg-white/50 w-full md:w-auto justify-start">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Halaman Utama
                        </Button>
                    </Link>
                )}
            
                <div className="flex gap-2 w-full md:w-auto">
                    <Button 
                        onClick={handlePrint} 
                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg w-full md:w-auto"
                    >
                        <Printer className="w-4 h-4 mr-2" /> Cetak / Simpan PDF
                    </Button>
                </div>
            </div>

            <div className="bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-2xl relative overflow-hidden flex flex-col border border-slate-200 rounded-sm print:shadow-none print:border-none">
                
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/cubes.png')` }}></div>
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900"></div>

                <header className="px-10 pt-12 pb-6 border-b-2 border-slate-900 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-5">
                        <img src={identity.logoUrl} alt="Logo" className="h-14 w-auto grayscale contrast-125" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest leading-none">Sertifikat Digital</h1>
                            <p className="text-slate-500 text-xs tracking-[0.2em] font-sans mt-1 uppercase">Otentikasi Tanda Tangan Elektronik</p>
                        </div>
                    </div>
                    {garudaLogo && (
                        <div className="text-right">
                            <img src={garudaLogo} alt="Garuda" className="h-16 w-auto opacity-90 inline-block" />
                        </div>
                    )}
                </header>

                <main className="flex-1 px-10 py-12 relative z-10 flex flex-col">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-900 px-6 py-2 rounded-full border border-green-700/20 mb-6 shadow-sm print:bg-transparent print:border-slate-300">
                            <ShieldCheck className="w-5 h-5 text-green-700" />
                            <span className="font-bold font-sans text-sm tracking-wide">VERIFIED & SECURE</span>
                        </div>
                        
                        <p className="text-slate-700 leading-relaxed text-sm font-sans max-w-2xl mx-auto">
                            Dokumen ini menerangkan bahwa tanda tangan digital yang tercantum di bawah ini adalah <strong>ASLI</strong> dan dibuat oleh pemilik akun terverifikasi di platform <strong>{identity.nama}</strong>.
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto border-2 border-slate-200 rounded-xl bg-slate-50/30 p-8 relative mb-12 w-full print:border-slate-300">
                        <div className="flex items-center gap-5 mb-8 border-b border-dashed border-slate-300 pb-6">
                            <img src={userData.foto_profil} alt="Profile" className="w-16 h-16 rounded-lg object-cover border border-slate-300 shadow-sm bg-white" />
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 font-sans">{userData.nama_lengkap}</h2>
                                <p className="text-slate-500 text-xs font-sans uppercase tracking-wide font-bold">Pemilik Sah Tanda Tangan</p>
                                <p className="text-slate-400 text-xs font-mono mt-1">ID: {userData.user_id?.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="text-center py-2">
                            <div className="relative inline-block px-8">
                                <img src={signatureUrl} alt="Digital Signature" className="h-32 object-contain relative z-10 mix-blend-multiply" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
                                    <span className="text-6xl font-bold -rotate-12 text-slate-900">VALID</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
                                <p className="text-[10px] text-slate-400 font-mono break-all">Digital Hash: {btoa(signatureUrl).substring(0, 40)}...</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto border-t-2 border-slate-100 pt-8">
                        <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Scale className="w-4 h-4" /> Disclaimer & Legalitas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-slate-500 font-sans leading-relaxed">
                            <div>
                                <p className="mb-2">
                                    <strong>1. Keabsahan Digital:</strong> Tanda tangan ini dibuat secara elektronik dan memiliki kekuatan hukum yang sah sesuai dengan ketentuan peraturan perundang-undangan yang berlaku mengenai Informasi dan Transaksi Elektronik (UU ITE).
                                </p>
                                <p>
                                    <strong>2. Verifikasi:</strong> Keaslian dokumen ini dapat diverifikasi kapan saja dengan memindai QR Code yang terlampir, yang akan mengarahkan ke halaman verifikasi resmi di server {identity.nama}.
                                </p>
                            </div>
                            <div>
                                <p className="mb-2">
                                    <strong>3. Hak Cipta:</strong> Tanda tangan ini adalah properti eksklusif dari {userData.nama_lengkap}. Penggunaan tanpa izin tertulis dari pemilik adalah tindakan ilegal.
                                </p>
                                <p>
                                    <strong>4. Tanggung Jawab:</strong> {identity.nama} bertindak sebagai penyedia platform verifikasi identitas dan tidak bertanggung jawab atas isi materi dari dokumen yang ditandatangani menggunakan tanda tangan ini di luar platform.
                                </p>
                            </div>
                        </div>
                    </div>

                </main>

                <footer className="bg-slate-50 px-10 py-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 print:bg-white print:border-t-2 print:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 border border-slate-200 bg-white shadow-sm p-1">
                            <img src={qrUrl} alt="QR Verification" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-white rounded-sm p-0.5 flex items-center justify-center border border-slate-100">
                                    <img src={identity.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>
                        </div>
                        <div className="text-xs font-sans text-slate-600">
                            <p className="font-bold text-slate-900">Scan untuk Validasi</p>
                            <p className="text-[10px] text-slate-500 max-w-[150px] mt-1">
                                Arahkan kamera smartphone Anda untuk cek keaslian dokumen ini secara real-time.
                            </p>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1 justify-center md:justify-end">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Electronic Signature Registered
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 justify-center md:justify-end">
                            <Calendar className="w-3 h-3" /> Timestamp: {today}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 italic">
                            Generated by KarirKita.my.id System
                        </p>
                    </div>
                </footer>

            </div>
        </div>
    );
};
