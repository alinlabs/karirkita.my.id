import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Monitor, Image as ImageIcon, Type } from 'lucide-react';
import { routingData } from '../../services/routingData';

interface PageContent {
  hero: string;
  judul: string;
  deskripsi: string;
}

interface LottieContent {
  kiri?: string;
  kanan?: string;
  ponsel?: string;
}

interface PageData {
  lottie?: LottieContent;
  desktop: PageContent;
  mobile: PageContent;
}

interface PagesConfig {
  [key: string]: PageData;
}

export const AdminPages: React.FC = () => {
  const [pagesData, setPagesData] = useState<PagesConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activePage, setActivePage] = useState<string>('beranda');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await routingData.getPageData();
      if (data) {
        setPagesData(data);
        if (Object.keys(data).length > 0) {
            setActivePage(Object.keys(data)[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching pages data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save as array to match structure
      await routingData.save('halaman', [pagesData]);
      alert('Data halaman berhasil disimpan!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePageData = (pageKey: string, device: 'desktop' | 'mobile', field: keyof PageContent, value: string) => {
    setPagesData(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [device]: {
          ...prev[pageKey][device],
          [field]: value
        }
      }
    }));
  };

  const updateLottieData = (pageKey: string, field: keyof LottieContent, value: string) => {
     setPagesData(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        lottie: {
          ...prev[pageKey].lottie,
          [field]: value
        }
      }
    }));
  };

  const pageKeys = Object.keys(pagesData);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <p className="text-slate-500 text-sm">Atur tampilan hero, judul, dan deskripsi untuk setiap halaman.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation for Pages */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
              {pageKeys.map(key => (
                <button
                  key={key}
                  onClick={() => setActivePage(key)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all capitalize flex items-center justify-between ${
                    activePage === key
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {key.replace(/_/g, ' ')}
                  {activePage === key && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3 space-y-6">
            {activePage && pagesData[activePage] && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-xl font-bold text-slate-800 capitalize flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-600" />
                    Halaman: {activePage.replace(/_/g, ' ')}
                  </h2>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Lottie Section (if exists) */}
                  {pagesData[activePage].lottie && (
                      <div className="space-y-4 border-b border-slate-100 pb-6">
                          <h3 className="font-bold text-slate-700 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" /> Konfigurasi Lottie Animation
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {Object.keys(pagesData[activePage].lottie!).map((key) => (
                                  <div key={key}>
                                      <label className="block text-xs font-semibold text-slate-500 mb-1 capitalize">{key}</label>
                                      <input
                                          type="text"
                                          value={(pagesData[activePage].lottie as any)[key] || ''}
                                          onChange={(e) => updateLottieData(activePage, key as keyof LottieContent, e.target.value)}
                                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                          placeholder={`File lottie ${key}`}
                                      />
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Desktop Configuration */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      <Monitor className="w-4 h-4" /> Tampilan Desktop
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Hero Image / Lottie</label>
                        <input
                          type="text"
                          value={pagesData[activePage].desktop.hero || ''}
                          onChange={(e) => updatePageData(activePage, 'desktop', 'hero', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          placeholder="URL Gambar atau Nama File Lottie"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Masukkan URL gambar (https://...) atau nama file .lottie</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Judul Utama</label>
                        <input
                          type="text"
                          value={pagesData[activePage].desktop.judul}
                          onChange={(e) => updatePageData(activePage, 'desktop', 'judul', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi</label>
                        <textarea
                          value={pagesData[activePage].desktop.deskripsi}
                          onChange={(e) => updatePageData(activePage, 'desktop', 'deskripsi', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile Configuration */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" /> Tampilan Mobile
                    </h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Hero Image / Lottie</label>
                        <input
                          type="text"
                          value={pagesData[activePage].mobile.hero || ''}
                          onChange={(e) => updatePageData(activePage, 'mobile', 'hero', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                          placeholder="URL Gambar atau Nama File Lottie"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Judul Utama</label>
                        <input
                          type="text"
                          value={pagesData[activePage].mobile.judul}
                          onChange={(e) => updatePageData(activePage, 'mobile', 'judul', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Deskripsi</label>
                        <textarea
                          value={pagesData[activePage].mobile.deskripsi}
                          onChange={(e) => updatePageData(activePage, 'mobile', 'deskripsi', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
