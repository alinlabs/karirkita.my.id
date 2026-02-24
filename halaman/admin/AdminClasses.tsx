import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit2, BookOpen, Users } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { Kelas, Mentor } from '../../types';

export const AdminClasses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'classes' | 'mentors'>('classes');
  const [classes, setClasses] = useState<Kelas[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await routingData.getKelas();
      if (data) {
        // Clean price data on fetch to ensure it's just numbers
        const cleanedClasses = (data.kelas || []).map((c: Kelas) => ({
          ...c,
          harga: c.harga.toLowerCase() === 'gratis' ? '0' : c.harga.replace(/\D/g, '')
        }));
        setClasses(cleanedClasses);
        
        // Clean mentor service prices
        const cleanedMentors = (data.mentors || []).map((m: Mentor) => ({
          ...m,
          layanan: (m.layanan || []).map(l => ({
            ...l,
            harga: l.harga.toLowerCase() === 'gratis' ? '0' : l.harga.replace(/\D/g, '')
          }))
        }));
        setMentors(cleanedMentors);
      }
    } catch (error) {
      console.error('Error fetching classes data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPriceDisplay = (value: string) => {
    if (!value) return '';
    const num = parseInt(value);
    if (isNaN(num)) return value;
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const handlePriceChange = (id: number, value: string) => {
    // Remove non-digits to store raw number
    const rawValue = value.replace(/\D/g, '');
    updateClass(id, 'harga', rawValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
        kelas: classes,
        mentors: mentors
      };
      
      await routingData.save('kelas', dataToSave);
      
      alert('Data berhasil disimpan!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClass = () => {
    const newClass: Kelas = {
      id: Date.now(),
      slug: `new-class-${Date.now()}`,
      judul: 'Judul Kelas Baru',
      mentor: '',
      peran: '',
      tanggal: '',
      waktu: '',
      harga: '',
      gambar: '',
      sampul_gambar: '',
      sampul_video: '',
      kategori: '',
      tingkat: '',
      rating: 0,
      peserta: 0,
      deskripsi: '',
      kurikulum: [],
      manfaat: []
    };
    setClasses([...classes, newClass]);
  };

  const handleAddMentor = () => {
    const newMentor: Mentor = {
      id: Date.now(),
      slug: `new-mentor-${Date.now()}`,
      nama: 'Nama Mentor Baru',
      peran: '',
      perusahaan: '',
      lokasi: '',
      gambar: '',
      sampul_gambar: '',
      sampul_video: '',
      keahlian: [],
      sesi: 0,
      rating: 0,
      tentang: '',
      pengalaman: [],
      ulasan: 0,
      layanan: []
    };
    setMentors([...mentors, newMentor]);
  };

  const handleDeleteClass = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  const handleDeleteMentor = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus mentor ini?')) {
      setMentors(mentors.filter(m => m.id !== id));
    }
  };

  const updateClass = (id: number, field: keyof Kelas, value: any) => {
    setClasses(classes.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateMentor = (id: number, field: keyof Mentor, value: any) => {
    setMentors(mentors.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'classes'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Daftar Kelas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('mentors')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'mentors'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Daftar Mentor
              </div>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500">Memuat data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'classes' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={handleAddClass}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Kelas
                  </button>
                </div>
                
                <div className="grid gap-6">
                  {classes.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-slate-800">#{item.id} - {item.judul}</h3>
                        <button
                          onClick={() => handleDeleteClass(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Judul Kelas</label>
                          <input
                            type="text"
                            value={item.judul}
                            onChange={(e) => updateClass(item.id, 'judul', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Slug</label>
                          <input
                            type="text"
                            value={item.slug}
                            onChange={(e) => updateClass(item.id, 'slug', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Mentor</label>
                          <input
                            type="text"
                            value={item.mentor}
                            onChange={(e) => updateClass(item.id, 'mentor', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Harga (IDR)</label>
                          <input
                            type="text"
                            value={formatPriceDisplay(item.harga)}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi</label>
                          <textarea
                            value={item.deskripsi}
                            onChange={(e) => updateClass(item.id, 'deskripsi', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        {/* Add more fields as needed */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mentors' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={handleAddMentor}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Mentor
                  </button>
                </div>

                <div className="grid gap-6">
                  {mentors.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-slate-800">#{item.id} - {item.nama}</h3>
                        <button
                          onClick={() => handleDeleteMentor(item.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Mentor</label>
                          <input
                            type="text"
                            value={item.nama}
                            onChange={(e) => updateMentor(item.id, 'nama', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Peran</label>
                          <input
                            type="text"
                            value={item.peran}
                            onChange={(e) => updateMentor(item.id, 'peran', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Perusahaan</label>
                          <input
                            type="text"
                            value={item.perusahaan}
                            onChange={(e) => updateMentor(item.id, 'perusahaan', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Tentang</label>
                          <textarea
                            value={item.tentang}
                            onChange={(e) => updateMentor(item.id, 'tentang', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
