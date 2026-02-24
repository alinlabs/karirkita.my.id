
import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { Combobox } from '../../komponen/ui/Combobox';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { Printer, ListChecks, Type, AlignLeft, Building2, Briefcase, User, Sparkles, QrCode, Image as ImageIcon, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { routingData } from '../../services/routingData';
import { PencariKerja, SkillItem } from '../../types';

// Import Templates (Existing)
import { generateLamaran } from './letter-templates/suratLamaran';
import { generateMagang } from './letter-templates/suratMagang';
import { generateResign } from './letter-templates/suratResign';
import { generatePenolakan } from './letter-templates/suratPenolakan';

// Import Templates (New Company)
import { generatePanggilan } from './letter-templates/suratPanggilan';
import { generatePenerimaan } from './letter-templates/suratPenerimaan';
import { generatePenawaran } from './letter-templates/suratPenawaran';

import { GeneratedLetter } from './letter-templates/types';

// Union type for all templates (Generic string to allow dynamic json)
type TemplateType = string;
type SignatureType = 'none' | 'qr' | 'image';
type FontType = string;
type StyleType = 'formal' | 'modern';

const DEFAULT_ATTACHMENTS = `1. Daftar Riwayat Hidup (CV)
2. Fotokopi Ijazah & Transkrip
3. Fotokopi KTP
4. Pas Foto Terbaru
5. Portofolio`;

export const UserLetterBuilder = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast, showToast } = useToast();
    
    // Mode State: 'seeker' or 'company'
    const [isCompanyMode, setIsCompanyMode] = useState(false);

    // Master Options State
    const [jobSeekerTemplates, setJobSeekerTemplates] = useState<any[]>([]);
    const [companyTemplates, setCompanyTemplates] = useState<any[]>([]);
    const [fontOptions, setFontOptions] = useState<any[]>([]);
    const [styleOptions, setStyleOptions] = useState<any[]>([]);

    // Data States
    const [templateType, setTemplateType] = useState<TemplateType>('lamaran');
    const [signatureType, setSignatureType] = useState<SignatureType>('none');
    const [selectedFont, setSelectedFont] = useState<FontType>('Times New Roman');
    const [selectedStyle, setSelectedStyle] = useState<StyleType>('formal');

    const [userData, setUserData] = useState<Partial<PencariKerja> & { 
        pendidikan_terakhir?: string, 
        tempat_lahir?: string, 
        tanggal_lahir?: string,
        alamat_lengkap?: string,
        domisili?: string
    }>({});
    const [userSkills, setUserSkills] = useState<SkillItem[]>([]);
    const [identity, setIdentity] = useState<any>({ logoUrl: '', nama: 'KarirKita' });
    const [isDownloading, setIsDownloading] = useState(false);

    // Form Data (Combined for both modes)
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientPosition: '',
        companyName: '',
        companyAddress: '',
        positionApplied: '', 
        resignationDate: '', 
        reason: '', 
        skills: '', 
        experience: '',
        // Company Fields
        interviewDate: '',
        interviewTime: '',
        interviewLocation: '',
        contactPerson: '',
        startDate: '',
        salaryOffer: '',
        benefit: '',
        probationPeriod: '',
        deadlineResponse: ''
    });

    // Content State
    const [letterContent, setLetterContent] = useState<GeneratedLetter>({
        opening: '', showBiodata: false, body: '', closing: ''
    });
    
    const [attachments, setAttachments] = useState(DEFAULT_ATTACHMENTS);
    const previewRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Data
    useEffect(() => {
        // Fetch Master Options
        routingData.getMasterOptions().then(data => {
            if(data.templateSurat) {
                // Map from {label, nilai} to {label, value}
                setJobSeekerTemplates(data.templateSurat.pelamar.map((x:any) => ({label: x.label, value: x.nilai})) || []);
                setCompanyTemplates(data.templateSurat.perusahaan.map((x:any) => ({label: x.label, value: x.nilai})) || []);
            }
            if(data.fontSurat) setFontOptions(data.fontSurat.map((x:any) => ({label: x.label, value: x.nilai})));
            if(data.gayaSurat) setStyleOptions(data.gayaSurat.map((x:any) => ({label: x.label, value: x.nilai})));
        });

        routingData.getIdentity().then(data => { if (data) setIdentity(data); });

        routingData.getTalents().then(data => {
            const found = data.find(t => t.email_kontak === user?.email) || data[0];
            if (found) {
                let lastEduStr = "-";
                if (found.riwayat_pendidikan && found.riwayat_pendidikan.length > 0) {
                    const sortedEdu = [...found.riwayat_pendidikan].sort((a, b) => b.tanggal_selesai.localeCompare(a.tanggal_selesai));
                    lastEduStr = `${sortedEdu[0].gelar} ${sortedEdu[0].bidang_studi}`;
                }

                const addressParts = [
                    found.jalan, 
                    found.kelurahan ? `Kel. ${found.kelurahan}` : '',
                    found.kecamatan ? `Kec. ${found.kecamatan}` : '',
                    found.kota,
                    found.provinsi
                ].filter(Boolean).join(', ');

                setUserData({
                    nama_lengkap: user?.name || found.nama_lengkap,
                    email_kontak: user?.email || 'email@example.com',
                    telepon_kontak: found.telepon_kontak || '0812-XXXX-XXXX',
                    domisili: found.kota ? `${found.kota}, ${found.provinsi}` : 'Indonesia',
                    tanda_tangan: found.tanda_tangan, // mapped correctly now
                    username: found.username,
                    tempat_lahir: found.tempat_lahir || 'Kota',
                    tanggal_lahir: found.tanggal_lahir || '2000-01-01',
                    pendidikan_terakhir: lastEduStr,
                    alamat_lengkap: addressParts || found.kota
                });
                
                if (found.keahlian_detail) {
                    setUserSkills(found.keahlian_detail);
                } else if (found.keahlian) {
                    setUserSkills(found.keahlian.map(k => ({ name: k, level: 50, category: 'hard_skill' })));
                }
            }
        });
    }, [user]);

    // Handle Mode Switch
    const handleModeSwitch = (mode: 'seeker' | 'company') => {
        if (mode === 'company') {
            setIsCompanyMode(true);
            setTemplateType('panggilan'); // Default company template
            // Auto fill company defaults if needed
            setFormData(prev => ({
                ...prev,
                companyName: 'PT. TechNova Indonesia', // Mock default
                recipientPosition: 'Calon Karyawan',
                recipientName: ''
            }));
            setAttachments(''); // Clear attachments for company letters by default
        } else {
            setIsCompanyMode(false);
            setTemplateType('lamaran');
            setAttachments(DEFAULT_ATTACHMENTS);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const fillBestSkills = () => {
        if (userSkills.length === 0) {
            showToast({ message: 'Tidak ada data keahlian di profil Anda.', type: 'error' });
            return;
        }
        const topSkills = [...userSkills].sort((a, b) => b.level - a.level).slice(0, 3).map(s => s.name).join(', ');
        setFormData(prev => ({ ...prev, skills: topSkills }));
        showToast({ message: '3 Keahlian terbaik berhasil ditambahkan!', type: 'success' });
    };

    // 2. Generate Content Logic
    useEffect(() => {
        let content: GeneratedLetter;
        switch (templateType) {
            // Seeker Templates
            case 'lamaran': content = generateLamaran(formData); break;
            case 'magang': content = generateMagang(formData); break;
            case 'resign': content = generateResign(formData); break;
            case 'penolakan': content = generatePenolakan(formData); break;
            
            // Company Templates
            case 'panggilan': content = generatePanggilan(formData); break;
            case 'penerimaan': content = generatePenerimaan(formData); break;
            case 'penawaran': content = generatePenawaran(formData); break;
            
            default: content = generateLamaran(formData);
        }
        setLetterContent(content);
    }, [formData, templateType]);

    // 3. Render Biodata Table Row Helper
    const BiodataRow = ({ label, value }: { label: string, value: string }) => (
        <tr className="align-top">
            <td className="py-0 w-[160px] font-medium whitespace-nowrap text-inherit leading-snug">{label}</td>
            <td className="py-0 w-[20px] text-center leading-snug">:</td>
            <td className="py-0 text-inherit leading-snug">{value}</td>
        </tr>
    );

    // 4. Print Handler
    const handlePrintPDF = () => {
        setIsDownloading(true);
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Pop-up diblokir. Mohon izinkan pop-up untuk mencetak.');
            setIsDownloading(false);
            return;
        }

        const todayFormatted = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const birthDateFormatted = userData.tanggal_lahir ? new Date(userData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
        
        // Label Handling
        let templateLabel = '';
        if (isCompanyMode) {
             templateLabel = companyTemplates.find(t => t.value === templateType)?.label?.toUpperCase() || 'SURAT KEPUTUSAN';
        } else {
             templateLabel = jobSeekerTemplates.find(t => t.value === templateType)?.label?.toUpperCase() || 'SURAT';
        }

        // Styles based on options
        const fontStack = selectedFont === 'Times New Roman' ? "'Times New Roman', serif" : 
                          selectedFont === 'Arial' ? "Arial, sans-serif" :
                          selectedFont === 'Roboto' ? "'Roboto', sans-serif" : "Calibri, sans-serif";
        
        const textAlign = selectedStyle === 'formal' ? 'justify' : 'left';
        const paraSpacing = selectedStyle === 'formal' ? '12px' : '15px'; 

        // Prepare Signature with Logo Overlay Logic
        let signatureImgHtml = '';
        if (signatureType === 'qr' && userData.username) {
            // Add &ecc=H to url
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/signature/' + userData.username)}&ecc=H`;
            // Overlay Logo Implementation for HTML String
            signatureImgHtml = `
            <div style="position: relative; width: 70px; height: 70px; display: inline-block;">
                <img src="${qrUrl}" alt="QR Validasi" style="width: 100%; height: 100%;" />
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background: white; padding: 2px; border-radius: 2px;">
                    <img src="${identity.logoUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
            </div>`;
        } else if (signatureType === 'image' && userData.tanda_tangan) {
            signatureImgHtml = `<img src="${userData.tanda_tangan}" alt="Tanda Tangan Asli" class="signature-img original" />`;
        }

        const hasAttachments = attachments && attachments.trim().length > 0;
        const bodyMargin = hasAttachments ? '5px' : paraSpacing;

        // Dynamic Sender Info based on mode
        const senderName = isCompanyMode ? formData.contactPerson || 'HR Manager' : userData.nama_lengkap;
        const senderInfo = isCompanyMode 
            ? `<strong>${formData.companyName}</strong><br/>${formData.companyAddress}` 
            : `<strong>${userData.nama_lengkap}</strong><br/>${userData.email_kontak} | ${userData.telepon_kontak}`;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <title>${templateLabel}</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
                <style>
                    @page { size: A4; margin: 0; }
                    body {
                        font-family: ${fontStack};
                        color: #000;
                        line-height: 1.4;
                        margin: 0;
                        padding: 15mm 20mm 25mm 20mm; 
                        background: white;
                        font-size: 11pt;
                        box-sizing: border-box;
                    }
                    .watermark {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 400px;
                        opacity: 0.08;
                        z-index: -1;
                        pointer-events: none;
                        filter: grayscale(100%);
                    }
                    .main-header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 3px double #000;
                        padding-bottom: 15px;
                    }
                    .letter-title {
                        font-size: 14pt;
                        font-weight: bold;
                        text-decoration: none; 
                        margin: 0 0 5px 0;
                        text-transform: uppercase;
                    }
                    .applicant-info { font-size: 10pt; }
                    .meta-date { text-align: right; margin-bottom: 5px; }
                    .recipient-block { margin-bottom: 15px; margin-top: 10px; }
                    .recipient-block p { margin: 2px 0; }
                    
                    /* TIGHT BIODATA STYLE */
                    .biodata-table { width: 100%; margin: 10px 0; border-collapse: collapse; }
                    .biodata-table td { 
                        padding: 0px 0; /* Reduced padding */
                        vertical-align: top; 
                        line-height: 1.35; /* Tighter line height */
                    }
                    .biodata-label { width: 160px; font-weight: bold; }
                    .biodata-sep { width: 20px; text-align: center; }

                    .text-body { text-align: ${textAlign}; white-space: pre-wrap; margin-bottom: ${bodyMargin}; line-height: 1.4; }
                    .text-block { text-align: ${textAlign}; white-space: pre-wrap; margin-bottom: ${paraSpacing}; line-height: 1.4; }
                    .attachment-container { margin-top: 0; margin-bottom: ${paraSpacing}; text-align: left; }
                    .att-intro { margin-bottom: 2px; line-height: 1.4; }
                    .att-list { margin: 0; padding-left: 25px; line-height: 1.3; }
                    .att-list li { margin-bottom: 0px; }
                    .footer-sign { margin-top: 30px; float: right; text-align: center; width: 220px; }
                    .signature-box { height: 80px; display: flex; align-items: center; justify-content: center; margin: 5px 0; }
                    .signature-img.original { height: 60px; width: auto; max-width: 160px; }
                    .signer-name { font-weight: bold; text-decoration: underline; }
                    
                    /* New Footer Style: Horizontal, Left Aligned */
                    .page-footer {
                        position: fixed; 
                        bottom: 5mm; 
                        left: 20mm; /* Aligned with body padding */
                        right: 20mm;
                        text-align: left;
                        font-size: 8pt; 
                        color: #999; 
                        font-family: Arial, sans-serif;
                        display: flex; 
                        flex-direction: row; 
                        align-items: center; 
                        gap: 10px;
                        padding-top: 10px;
                        border-top: 1px solid #eee;
                    }
                    .footer-logo { 
                        height: 16px; 
                        width: auto; 
                        opacity: 0.6; 
                        filter: grayscale(100%);
                    }
                    .footer-sep {
                        border-left: 1px solid #ccc;
                        height: 12px;
                    }
                    .footer-link { 
                        color: #999; 
                        text-decoration: none; 
                        font-weight: bold; 
                    }
                </style>
            </head>
            <body>
                <img src="${identity.logoUrl}" class="watermark" alt="Logo" />

                <div class="main-header">
                    <div class="letter-title">${templateLabel}</div>
                    <div class="applicant-info">
                        ${senderInfo}
                    </div>
                </div>

                <div class="meta-date">
                    ${userData.kota || 'Tempat'}, ${todayFormatted}
                </div>

                <div class="recipient-block">
                    <p>Kepada Yth.</p>
                    <p><strong>${formData.recipientName || (isCompanyMode ? 'Sdr/i Pelamar' : 'Bapak/Ibu Pimpinan')}</strong></p>
                    ${formData.recipientPosition ? `<p>${formData.recipientPosition}</p>` : ''}
                    <p>${isCompanyMode ? (formData.companyAddress || 'Di Tempat') : (formData.companyName || 'Di Tempat')}</p>
                </div>

                <div class="text-block">${letterContent.opening}</div>

                ${letterContent.showBiodata ? `
                <table class="biodata-table">
                    <tr><td class="biodata-label">Nama</td><td class="biodata-sep">:</td><td>${userData.nama_lengkap}</td></tr>
                    <tr><td class="biodata-label">Tempat, Tgl Lahir</td><td class="biodata-sep">:</td><td>${userData.tempat_lahir}, ${birthDateFormatted}</td></tr>
                    <tr><td class="biodata-label">Pendidikan</td><td class="biodata-sep">:</td><td>${userData.pendidikan_terakhir}</td></tr>
                    <tr><td class="biodata-label">Alamat</td><td class="biodata-sep">:</td><td>${userData.alamat_lengkap}</td></tr>
                    <tr><td class="biodata-label">No. Telepon</td><td class="biodata-sep">:</td><td>${userData.telepon_kontak}</td></tr>
                    <tr><td class="biodata-label">Email</td><td class="biodata-sep">:</td><td>${userData.email_kontak}</td></tr>
                </table>
                ` : ''}

                <div class="text-body">${letterContent.body.trim()}</div>

                ${hasAttachments ? `
                <div class="attachment-container">
                    <div class="att-intro">Lampiran:</div>
                    <ol class="att-list">
                        ${attachments.split('\n').filter(Boolean).map(line => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`).join('')}
                    </ol>
                </div>
                ` : ''}

                <div class="text-block">${letterContent.closing}</div>

                <div class="footer-sign">
                    <p>Hormat kami,</p>
                    <div class="signature-box">
                        ${signatureImgHtml}
                    </div>
                    <div class="signer-name">${senderName}</div>
                </div>

                <div class="page-footer">
                    <img src="${identity.logoUrl}" class="footer-logo" alt="Logo" />
                    <div class="footer-sep"></div>
                    <span>Dibuat oleh KarirKita - Platform Karir Terpercaya</span>
                    <div class="footer-sep"></div>
                    <a href="https://www.karirkita.my.id" class="footer-link">www.karirkita.my.id</a>
                </div>

                <script>
                    window.onload = function() { setTimeout(function(){ window.print(); }, 800); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setIsDownloading(false);
    };

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const birthDatePreview = userData.tanggal_lahir ? new Date(userData.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    
    // Label Preview logic
    let templateLabelPreview = '';
    if (isCompanyMode) {
        templateLabelPreview = companyTemplates.find(t => t.value === templateType)?.label?.toUpperCase() || 'SURAT';
    } else {
        templateLabelPreview = jobSeekerTemplates.find(t => t.value === templateType)?.label?.toUpperCase() || 'SURAT';
    }

    const previewStyle: React.CSSProperties = {
        fontFamily: selectedFont === 'Times New Roman' ? '"Times New Roman", Times, serif' : 
                    selectedFont === 'Arial' ? 'Arial, Helvetica, sans-serif' :
                    selectedFont === 'Roboto' ? '"Roboto", sans-serif' : '"Calibri", sans-serif',
        textAlign: selectedStyle === 'formal' ? 'justify' : 'left',
    };

    const hasAttachmentsPreview = attachments && attachments.trim().length > 0;

    return (
        <div className="pb-20 animate-fade-in-up">
            {toast && <Toast message={toast.message} type={toast.type} />}

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/user/dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Surat Builder</h1>
                        <p className="text-slate-500 font-medium text-sm">Buat surat profesional otomatis (HRD / Pelamar).</p>
                    </div>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto self-start">
                    <button 
                        onClick={() => handleModeSwitch('seeker')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${!isCompanyMode ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <User className="w-4 h-4" /> Pencari Kerja
                    </button>
                    <button 
                        onClick={() => handleModeSwitch('company')}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${isCompanyMode ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building2 className="w-4 h-4" /> Perusahaan (HRD)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* --- LEFT: INPUTS --- */}
                <div className="space-y-6">
                    <Card className={`p-6 rounded-[2rem] border shadow-sm ${isCompanyMode ? 'bg-purple-50/50 border-purple-100' : 'bg-blue-50/50 border-blue-100'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full text-white ${isCompanyMode ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                {isCompanyMode ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <h3 className="font-bold text-slate-900">
                                {isCompanyMode ? 'Informasi Pengirim (Perusahaan)' : 'Informasi Pengirim (Pelamar)'}
                            </h3>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1 ml-1">
                            {isCompanyMode ? (
                                <>
                                    <p>Surat akan dikirim atas nama Perusahaan.</p>
                                    <p><span className="font-semibold">Nama:</span> {formData.companyName || 'PT...'}</p>
                                </>
                            ) : (
                                <>
                                    <p><span className="font-semibold w-24 inline-block">Nama:</span> {userData.nama_lengkap}</p>
                                    <p><span className="font-semibold w-24 inline-block">Pendidikan:</span> {userData.pendidikan_terakhir}</p>
                                </>
                            )}
                        </div>
                    </Card>

                    <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm">
                        <div className="space-y-6">
                            
                            {/* --- TIPE SURAT --- */}
                            <div className="grid md:grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Surat</label>
                                    <Combobox 
                                        options={isCompanyMode ? companyTemplates : jobSeekerTemplates} 
                                        value={templateType} 
                                        onChange={(val) => setTemplateType(val as TemplateType)} 
                                        placeholder="Pilih Template" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><Type className="w-4 h-4"/> Jenis Font</label>
                                        <Combobox options={fontOptions} value={selectedFont} onChange={(val) => setSelectedFont(val as FontType)} placeholder="Pilih Font" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><AlignLeft className="w-4 h-4"/> Gaya</label>
                                        <Combobox options={styleOptions} value={selectedStyle} onChange={(val) => setSelectedStyle(val as StyleType)} placeholder="Pilih Gaya" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-b border-slate-100 pb-2 mb-4 pt-2">
                                <h3 className="font-bold text-slate-900">Detail Surat</h3>
                            </div>

                            {/* COMMON INPUTS */}
                            {!isCompanyMode && (
                                <>
                                    <Input label="Nama Perusahaan" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="PT. ..." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Nama Penerima" value={formData.recipientName} onChange={(e) => handleChange('recipientName', e.target.value)} placeholder="HRD / Pimpinan" />
                                        <Input label="Jabatan Penerima" value={formData.recipientPosition} onChange={(e) => handleChange('recipientPosition', e.target.value)} placeholder="HR Manager" />
                                    </div>
                                    <Input label="Alamat Perusahaan" value={formData.companyAddress} onChange={(e) => handleChange('companyAddress', e.target.value)} placeholder="Jl. Sudirman..." />
                                </>
                            )}

                            {isCompanyMode && (
                                <>
                                    <Input label="Nama Perusahaan Anda" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="PT. ..." />
                                    <Input label="Alamat Kantor" value={formData.companyAddress} onChange={(e) => handleChange('companyAddress', e.target.value)} placeholder="Lokasi..." />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Nama Kandidat (Penerima)" value={formData.recipientName} onChange={(e) => handleChange('recipientName', e.target.value)} placeholder="Sdr. Budi" />
                                        <Input label="Posisi Dilamar" value={formData.positionApplied} onChange={(e) => handleChange('positionApplied', e.target.value)} placeholder="Frontend Dev" />
                                    </div>
                                </>
                            )}

                            {/* DYNAMIC INPUTS BASED ON TEMPLATE */}
                            {/* 1. Lowongan / Magang (Jobseeker) */}
                            {!isCompanyMode && (templateType === 'lamaran' || templateType === 'magang') && (
                                <>
                                    <Input label="Posisi yang Dilamar" value={formData.positionApplied} onChange={(e) => handleChange('positionApplied', e.target.value)} placeholder="Frontend Developer" />
                                    <div className="relative">
                                        <Input label="Keahlian Utama" value={formData.skills} onChange={(e) => handleChange('skills', e.target.value)} placeholder="React, Node.js..." />
                                        <button type="button" onClick={fillBestSkills} className="absolute right-0 top-0 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-blue-100"><Sparkles className="w-3 h-3" /> Auto-fill</button>
                                    </div>
                                    {templateType === 'lamaran' && (
                                        <Input label="Bidang Pengalaman" value={formData.experience} onChange={(e) => handleChange('experience', e.target.value)} placeholder="Pengembangan Web" />
                                    )}
                                </>
                            )}

                            {/* 2. Resign (Jobseeker) */}
                            {templateType === 'resign' && (
                                <Input label="Tanggal Terakhir Bekerja" type="date" value={formData.resignationDate} onChange={(e) => handleChange('resignationDate', e.target.value)} />
                            )}

                            {/* 3. Panggilan Interview (Company) */}
                            {templateType === 'panggilan' && (
                                <div className="space-y-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="text-sm font-bold text-purple-800">Detail Interview</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Hari, Tanggal" value={formData.interviewDate} onChange={(e) => handleChange('interviewDate', e.target.value)} placeholder="Senin, 20 Mei 2024" />
                                        <Input label="Waktu" value={formData.interviewTime} onChange={(e) => handleChange('interviewTime', e.target.value)} placeholder="10:00 WIB" />
                                    </div>
                                    <Input label="Lokasi / Link Meeting" value={formData.interviewLocation} onChange={(e) => handleChange('interviewLocation', e.target.value)} placeholder="Zoom / Ruang Meeting Lt.2" />
                                    <Input label="Bertemu Dengan (PIC)" value={formData.contactPerson} onChange={(e) => handleChange('contactPerson', e.target.value)} placeholder="Ibu Ani (HR)" />
                                </div>
                            )}

                            {/* 4. Penawaran / Offering (Company) */}
                            {templateType === 'penawaran' && (
                                <div className="space-y-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="text-sm font-bold text-purple-800">Detail Offering</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Gaji Pokok" value={formData.salaryOffer} onChange={(e) => handleChange('salaryOffer', e.target.value)} placeholder="Rp 5.000.000" />
                                        <Input label="Masa Percobaan" value={formData.probationPeriod} onChange={(e) => handleChange('probationPeriod', e.target.value)} placeholder="3 Bulan" />
                                    </div>
                                    <Input label="Benefit Tambahan" value={formData.benefit} onChange={(e) => handleChange('benefit', e.target.value)} placeholder="BPJS, Makan Siang" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Tanggal Mulai" type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
                                        <Input label="Batas Respon" type="date" value={formData.deadlineResponse} onChange={(e) => handleChange('deadlineResponse', e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* 5. Penerimaan / Acceptance (Company) */}
                            {templateType === 'penerimaan' && (
                                <div className="space-y-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <h4 className="text-sm font-bold text-purple-800">Detail Onboarding</h4>
                                    <Input label="Tanggal Masuk (First Day)" type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
                                </div>
                            )}

                            {/* Common: Reason Field */}
                            {(templateType === 'resign' || templateType === 'penolakan') && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Alasan</label>
                                    <textarea className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all text-sm" rows={2} value={formData.reason} onChange={(e) => handleChange('reason', e.target.value)} placeholder="Alasan singkat..." />
                                </div>
                            )}

                            {/* Attachments (Default for Seeker, Optional for Company) */}
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 mt-4">
                                <h4 className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2"><ListChecks className="w-4 h-4" /> Daftar Lampiran</h4>
                                <textarea className="w-full p-3 rounded-lg border border-yellow-200 bg-white/50 text-sm focus:outline-none h-24 leading-relaxed" value={attachments} onChange={(e) => setAttachments(e.target.value)} placeholder="Kosongkan jika tidak ada lampiran" />
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-4">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Tanda Tangan</h4>
                                <div className="flex flex-wrap gap-2">
                                    <button type="button" onClick={() => setSignatureType('none')} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${signatureType === 'none' ? 'bg-white border-blue-500 text-blue-600' : 'border-slate-200 text-slate-500'}`}>Tanpa TTD</button>
                                    <button type="button" onClick={() => setSignatureType('qr')} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${signatureType === 'qr' ? 'bg-white border-blue-500 text-blue-600' : 'border-slate-200 text-slate-500'}`}><QrCode className="w-3 h-3" /> QR Digital</button>
                                    <button type="button" onClick={() => setSignatureType('image')} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-1 ${signatureType === 'image' ? 'bg-white border-blue-500 text-blue-600' : 'border-slate-200 text-slate-500'}`}><ImageIcon className="w-3 h-3" /> Gambar Asli</button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* --- RIGHT: LIVE PREVIEW --- */}
                <div className="sticky top-24 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2"><FileText className="w-4 h-4" /> Live Preview</h3>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handlePrintPDF} className="bg-slate-900 hover:bg-slate-800 text-white" disabled={isDownloading}>{isDownloading ? <span className="animate-spin mr-2">⏳</span> : <Printer className="w-4 h-4 mr-2" />} Cetak / PDF</Button>
                        </div>
                    </div>

                    <div className="relative w-full bg-slate-200/50 rounded-xl p-4 overflow-hidden border border-slate-200 flex justify-center">
                        <div className="overflow-visible custom-scrollbar">
                            <div className="transform scale-[0.45] origin-top" style={{ width: '210mm', height: 'auto' }}>
                                <div id="letter-preview-container" className="bg-white p-[20mm] rounded-sm shadow-xl min-h-[297mm] w-[210mm] relative group mx-auto text-slate-900 leading-relaxed text-[12pt] flex flex-col justify-between" style={previewStyle}>
                                    <img src={identity.logoUrl} alt="Watermark" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] opacity-[0.08] pointer-events-none grayscale z-0" />

                                    <div ref={previewRef} className="relative z-10 flex flex-col h-full">
                                        <div className="text-center mb-10 border-b-4 border-double border-black pb-5">
                                            <h1 className="text-[18pt] font-bold mb-2 uppercase tracking-wide">{templateLabelPreview}</h1>
                                            <div className="text-[11pt] font-normal" style={{ fontFamily: 'inherit' }}>
                                                {isCompanyMode ? (
                                                    <>
                                                        <strong>{formData.companyName}</strong><br/>
                                                        {formData.companyAddress}
                                                    </>
                                                ) : (
                                                    <>
                                                        <strong>{userData.nama_lengkap}</strong><br/>
                                                        {userData.email_kontak} | {userData.telepon_kontak}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-right mb-4">{userData.kota || 'Tempat'}, {today}</p>
                                            
                                            <p>Kepada Yth.</p>
                                            <p><strong>{formData.recipientName || (isCompanyMode ? 'Sdr/i Pelamar' : 'Bapak/Ibu Pimpinan')}</strong></p>
                                            {formData.recipientPosition && <p>{formData.recipientPosition}</p>}
                                            <p>{isCompanyMode ? (formData.companyAddress ? '' : 'Di Tempat') : (formData.companyName || 'Di Tempat')}</p>
                                        </div>

                                        <div className="whitespace-pre-wrap mb-4" style={{ textAlign: previewStyle.textAlign }}>{letterContent.opening}</div>

                                        {letterContent.showBiodata && !isCompanyMode && (
                                            <table className="w-full mb-6 border-collapse">
                                                <tbody>
                                                    <BiodataRow label="Nama" value={userData.nama_lengkap || ''} />
                                                    <BiodataRow label="Tempat, Tgl Lahir" value={`${userData.tempat_lahir}, ${birthDatePreview}`} />
                                                    <BiodataRow label="Pendidikan Terakhir" value={userData.pendidikan_terakhir || ''} />
                                                    <BiodataRow label="Alamat" value={userData.alamat_lengkap || ''} />
                                                    <BiodataRow label="No. Telepon" value={userData.telepon_kontak || ''} />
                                                    <BiodataRow label="Email" value={userData.email_kontak || ''} />
                                                </tbody>
                                            </table>
                                        )}

                                        <div className="whitespace-pre-wrap" style={{ textAlign: previewStyle.textAlign, marginBottom: hasAttachmentsPreview ? '5px' : '15px' }}>
                                            {letterContent.body.trim()}
                                        </div>

                                        {hasAttachmentsPreview && (
                                            <div className="mb-6" style={{ textAlign: 'left' }}>
                                                <p className="mb-1">{isCompanyMode ? 'Lampiran:' : 'Sebagai bahan pertimbangan, bersama surat ini saya lampirkan:'}</p>
                                                <ol className="list-decimal pl-5 m-0">
                                                    {attachments.split('\n').filter(Boolean).map((line, idx) => (
                                                        <li key={idx} style={{ marginBottom: '0' }}>{line.replace(/^\d+\.\s*/, '')}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}

                                        <div className="whitespace-pre-wrap mb-10" style={{ textAlign: previewStyle.textAlign }}>{letterContent.closing}</div>

                                        <div className="mb-10 text-right">
                                            <div className="inline-block text-center min-w-[200px]">
                                                <p className="mb-2">{isCompanyMode ? 'Hormat kami,' : 'Hormat saya,'}</p>
                                                <div className="h-24 flex items-center justify-center">
                                                    {signatureType === 'qr' && userData.username && (
                                                        <div className="relative w-20 h-20">
                                                            <img 
                                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/signature/' + userData.username)}&ecc=H`} 
                                                                alt="QR" 
                                                                className="w-full h-full" 
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-5 h-5 bg-white rounded-sm p-0.5 flex items-center justify-center">
                                                                    <img src={identity.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {signatureType === 'image' && userData.tanda_tangan && (
                                                        <img src={userData.tanda_tangan} alt="Sign" className="h-20 object-contain" />
                                                    )}
                                                </div>
                                                <p className="font-bold border-b border-black inline-block min-w-[150px] pb-1">{isCompanyMode ? (formData.contactPerson || 'HR Manager') : userData.nama_lengkap}</p>
                                            </div>
                                        </div>

                                        {/* REVISED FOOTER FOR PREVIEW */}
                                        <div className="pt-4 border-t border-slate-200 flex flex-row items-center justify-start gap-3 text-[9pt] text-slate-500 mt-auto font-sans">
                                            <img src={identity.logoUrl} alt="Logo" className="h-4 opacity-60 grayscale" />
                                            <div className="h-3 w-px bg-slate-300"></div>
                                            <span>Dibuat oleh KarirKita - Platform Karir Terpercaya</span>
                                            <div className="h-3 w-px bg-slate-300"></div>
                                            <a href="https://www.karirkita.my.id" style={{ color: '#999', textDecoration: 'none', fontWeight: 'bold' }}>www.karirkita.my.id</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
