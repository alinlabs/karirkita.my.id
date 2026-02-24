
import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Input } from '../../komponen/ui/Input';
import { Button } from '../../komponen/ui/Button';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { Modal } from '../../komponen/ui/Modal';
import { FileText, Briefcase, GraduationCap, Image as ImageIcon, Trophy, Users, Camera, Check, AlertCircle, CheckCircle2, Sparkles, Bot, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { routingData } from '../../services/routingData';
import { PencariKerja, StatusKetersediaan, Sertifikasi, Organisasi, Pengalaman, Pendidikan, Proyek, SkillItem } from '../../types';

// Import Modular Components
import { InfoDasar } from './cv/InfoDasar';
import { PengalamanCV } from './cv/Pengalaman';
import { PendidikanCV } from './cv/Pendidikan';
import { PortofolioCV } from './cv/Portofolio';
import { PrestasiCV } from './cv/Prestasi';
import { OrganisasiCV } from './cv/Organisasi';
import { GaleriCV } from './cv/Galeri';
import { KeahlianCV } from './cv/Keahlian';

interface SkillOption {
    label: string;
    value: string;
    image?: string;
}

export const UserProfile = () => {
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'experience' | 'education' | 'portfolio' | 'achievements' | 'organizations' | 'gallery'>('info');
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  
  // SmartKarir AI State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isProUser, setIsProUser] = useState(false); 

  // -- STATE DATA --
  // Initial empty state
  const [formData, setFormData] = useState({
    id_pengguna: '', // Added for update
    nama_lengkap: '',
    headline: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    email_kontak: '',
    telepon_kontak: '',
    
    // Address Breakdown
    provinsi: '',
    kota: '',
    kecamatan: '',
    kelurahan: '',
    jalan: '',
    rt: '',
    rw: '',
    kode_pos: '',
    
    // domisili removed from state, reconstructed if needed or used from breakdown
    
    tentang_saya: '',
    
    status_ketersediaan: 'job_seeking' as StatusKetersediaan | string,
    foto_profil: '', // Updated
    banner: '', // Updated
    website_url: '',
    linkedin_url: '',
    github_url: '',
    instagram_url: '',
    youtube_url: '',
    facebook_url: '',
    twitter_url: ''
  });

  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experiences, setExperiences] = useState<Partial<Pengalaman>[]>([]);
  const [education, setEducation] = useState<Partial<Pendidikan>[]>([]);
  const [portfolio, setPortfolio] = useState<Partial<Proyek>[]>([]);
  const [achievements, setAchievements] = useState<Partial<Sertifikasi>[]>([]);
  const [organizations, setOrganizations] = useState<Partial<Organisasi>[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);

  // Load Data on Mount
  useEffect(() => {
    // Load Skills Options
    routingData.getSkills()
        .then(data => {
            const skills: SkillOption[] = [];
            const traverse = (obj: any) => {
                if(Array.isArray(obj)) obj.forEach(traverse);
                else if(typeof obj === 'object') {
                    // Match skill.json structure: "keahlian" and "gambar"
                    if(obj.keahlian) {
                        skills.push({ label: obj.keahlian, value: obj.keahlian, image: obj.gambar });
                    } else if (obj.skill) {
                        skills.push({ label: obj.skill, value: obj.skill, image: obj.image });
                    }
                    Object.values(obj).forEach(traverse);
                }
            };
            traverse(data);
            const uniqueSkills = Array.from(new Map(skills.map(item => [item.value, item])).values());
            setAvailableSkills(uniqueSkills.sort((a, b) => a.label.localeCompare(b.label)));
        });

    // Load User Data
    routingData.getTalents()
        .then(data => {
            const user = data[0]; 
            if(user) {
                setFormData(prev => ({
                    ...prev,
                    ...user,
                    status_ketersediaan: user.status_ketersediaan || 'job_seeking',
                    banner: user.banner || '', // Updated
                    foto_profil: user.foto_profil || '', // Updated
                    website_url: user.sosial_media.website_url || '',
                    linkedin_url: user.sosial_media.linkedin_url || '',
                    github_url: user.sosial_media.github_url || '',
                    instagram_url: user.sosial_media.instagram_url || '',
                    
                    // Address Mapping
                    provinsi: user.provinsi || '',
                    kota: user.kota || '',
                    kecamatan: user.kecamatan || '',
                    kelurahan: user.kelurahan || '',
                    jalan: user.jalan || '',
                    rt: user.rt || '',
                    rw: user.rw || '',
                    kode_pos: user.kode_pos || '',

                    // Fallback logic for fields that might be empty in old JSON
                    tempat_lahir: user.tempat_lahir || '',
                    tanggal_lahir: user.tanggal_lahir || '',
                    email_kontak: user.email_kontak || '',
                    telepon_kontak: user.telepon_kontak || ''
                }));
                
                // Initialize Skills
                if (user.keahlian_detail) {
                    setSkills(user.keahlian_detail);
                } else if (user.keahlian) {
                    // Fallback for legacy simple string array -> default to hard skill 50%
                    setSkills(user.keahlian.map(k => ({ name: k, level: 50, category: 'hard_skill' })));
                }

                setExperiences(user.pengalaman_kerja || []);
                setEducation(user.riwayat_pendidikan || []);
                setPortfolio(user.portofolio || []);
                setAchievements(user.sertifikasi || []);
                setOrganizations(user.organisasi || []);
                setGallery(user.galeri_kegiatan || []);
                setIsProUser(true); 
            }
        });
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
        const payload = {
            ...formData,
            keahlian_detail: skills,
            keahlian: skills.map(s => s.name), // Sync legacy array
            pengalaman_kerja: experiences,
            riwayat_pendidikan: education,
            portofolio: portfolio,
            sertifikasi: achievements,
            organisasi: organizations,
            galeri_kegiatan: gallery,
            updated_at: Date.now()
        };

        // Assuming user ID is available in formData or we get it from auth context
        // For now, using formData.id_pengguna or fallback
        const userId = formData.id_pengguna || 't1'; 
        
        await routingData.updateUser(userId, payload);
        showToast({ message: 'Profil berhasil diperbarui!', type: 'success' });
    } catch (error) {
        console.error("Failed to update profile", error);
        showToast({ message: 'Gagal memperbarui profil', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSmartKarirClick = () => {
      setIsAIModalOpen(true);
  };

  const generateAIBio = () => {
      setAiGenerating(true);
      setTimeout(() => {
          setAiGenerating(false);
          setFormData(prev => ({
              ...prev,
              tentang_saya: "Profesional berdedikasi dengan pengalaman luas di bidang teknologi. Memiliki passion kuat dalam pengembangan software yang scalable dan user-friendly."
          }));
          setIsAIModalOpen(false);
          showToast({ message: "Bio berhasil dibuat oleh AI!", type: 'success' });
      }, 2000);
  };

  const calculateStrength = () => {
      let score = 0;
      if (formData.nama_lengkap) score += 10;
      if (formData.headline) score += 10;
      if (formData.tentang_saya?.length > 20) score += 10;
      if (skills.length > 0) score += 10;
      if (experiences.length > 0) score += 15;
      if (education.length > 0) score += 10;
      if (portfolio.length > 0) score += 15;
      if (achievements.length > 0) score += 10;
      if (organizations.length > 0) score += 5;
      if (gallery.length > 0) score += 5;
      return Math.min(score, 100);
  };
  const strength = calculateStrength();

  const tabs = [
    { id: 'info', label: 'Info Dasar', icon: FileText },
    { id: 'skills', label: 'Keahlian', icon: Star },
    { id: 'experience', label: 'Pengalaman', icon: Briefcase },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap },
    { id: 'portfolio', label: 'Portofolio', icon: ImageIcon },
    { id: 'achievements', label: 'Prestasi', icon: Trophy },
    { id: 'organizations', label: 'Organisasi', icon: Users },
    { id: 'gallery', label: 'Galeri', icon: Camera },
  ];

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Edit Profil CV</h1>
           <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Kelola informasi yang tampil di CV Online dan halaman publik Anda.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Link to="/user/cv" className="w-full sm:w-auto">
                <Button variant="outline" className="gap-2 rounded-xl h-12 border-slate-200 w-full sm:w-auto justify-center hover:bg-slate-50 font-semibold shadow-sm">
                    <FileText className="w-4 h-4" /> Preview CV
                </Button>
            </Link>
            <Button 
                onClick={handleSave} 
                isLoading={isLoading} 
                className="w-full sm:w-auto shadow-xl shadow-blue-600/20 gap-2 rounded-xl h-12 px-8 font-bold bg-blue-600 hover:bg-blue-700 justify-center transition-transform hover:-translate-y-0.5"
            >
                <Check className="w-4 h-4" /> Simpan
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-4 space-y-6">
            <Card className="p-0 text-center relative overflow-hidden border-none shadow-lg shadow-slate-200/50 rounded-[2rem]">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                </div>
                <div className="relative z-10 -mt-16 pb-8 px-6">
                    <div className="w-32 h-32 mx-auto bg-white rounded-[2rem] p-1.5 shadow-xl shadow-blue-900/10 relative group mb-4">
                        <div className="w-full h-full rounded-[1.5rem] bg-slate-100 overflow-hidden relative">
                            {formData.foto_profil ? (
                                <img src={formData.foto_profil} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                    <Users className="w-10 h-10" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <Input 
                            placeholder="Paste Avatar URL..." 
                            name="foto_profil" 
                            value={formData.foto_profil} 
                            onChange={(e) => setFormData({...formData, foto_profil: e.target.value})} 
                            className="text-center text-xs h-9 rounded-lg" 
                        />
                    </div>

                    <h3 className="font-bold text-2xl text-slate-900">{formData.nama_lengkap || 'Nama Lengkap'}</h3>
                    <p className="text-slate-500 font-medium">{formData.headline || 'Job Headline'}</p>
                </div>
            </Card>

            <Card className="p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/40">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-900">Kelengkapan Profil</h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${strength === 100 ? 'text-green-700 bg-green-100' : 'text-blue-600 bg-blue-100'}`}>{strength}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 p-0.5">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${strength}%` }}></div>
                </div>
                <div className="space-y-3 text-sm font-medium text-slate-600">
                    {[
                        { label: 'Info Dasar', check: formData.tentang_saya?.length > 20 },
                        { label: 'Keahlian', check: skills.length > 0 },
                        { label: 'Pengalaman', check: experiences.length > 0 },
                        { label: 'Pendidikan', check: education.length > 0 },
                        { label: 'Portofolio', check: portfolio.length > 0 },
                        { label: 'Prestasi', check: achievements.length > 0 },
                        { label: 'Organisasi', check: organizations.length > 0 },
                        { label: 'Galeri', check: gallery.length > 0 }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-default">
                            <span>{item.label}</span>
                            {item.check ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-orange-400" />}
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* Right Column: Tabbed Forms */}
        <div className="lg:col-span-8">
            <div className="-mx-4 px-4 md:mx-0 md:px-0 mb-8 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                <div className="bg-slate-100/50 p-1.5 rounded-2xl flex min-w-max md:min-w-0 gap-1 border border-slate-200/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap snap-start duration-300",
                                activeTab === tab.id 
                                    ? "bg-white text-blue-600 shadow-sm shadow-slate-200/50 ring-1 ring-black/5" 
                                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-blue-600" : "text-slate-400")} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT RENDERING */}
            {activeTab === 'info' && (
                <InfoDasar 
                    formData={formData} 
                    setFormData={setFormData}
                    handleSmartKarirClick={handleSmartKarirClick}
                    isProUser={isProUser}
                />
            )}

            {activeTab === 'skills' && (
                <KeahlianCV skills={skills} setSkills={setSkills} />
            )}

            {activeTab === 'experience' && (
                <PengalamanCV experiences={experiences} setExperiences={setExperiences} />
            )}

            {activeTab === 'education' && (
                <PendidikanCV education={education} setEducation={setEducation} />
            )}

            {activeTab === 'portfolio' && (
                <PortofolioCV portfolio={portfolio} setPortfolio={setPortfolio} />
            )}

            {(activeTab === 'achievements') && (
                <PrestasiCV achievements={achievements} setAchievements={setAchievements} />
            )}

            {(activeTab === 'organizations') && (
                <OrganisasiCV organizations={organizations} setOrganizations={setOrganizations} />
            )}

            {activeTab === 'gallery' && (
                <GaleriCV gallery={gallery} setGallery={setGallery} />
            )}
        </div>
      </div>

      {/* SmartKarir AI Modal */}
      <Modal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} title="SmartKarir AI Assistant">
          <div className="text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Generate Professional Bio</h3>
              <p className="text-slate-500 mb-8">AI akan menganalisis data profil Anda untuk membuat ringkasan profesional yang menarik.</p>
              
              <Button 
                onClick={generateAIBio} 
                isLoading={aiGenerating} 
                className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                  {aiGenerating ? 'Generating...' : 'Start Generating'}
              </Button>
          </div>
      </Modal>
    </div>
  );
};
