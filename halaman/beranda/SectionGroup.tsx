import React, { useEffect, useState } from 'react';
import { routingData } from '../../services/routingData';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { MessageCircle, Send, Users, ArrowRight, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Group {
  nama_group: string;
  deskripsi: string;
  anggota: number;
  platform: string;
  link: string;
  logo?: string;
}

export const SectionGroup = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Helper for random avatar colors
  const avatarColors = ['1e293b', 'dc2626', 'd97706', '16a34a', '2563eb', '7c3aed', 'db2777'];
  const getAvatarUrl = (char: string, index: number) => {
      const color = avatarColors[index % avatarColors.length];
      return `https://placehold.co/50x50/${color}/ffffff?text=${char}`;
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await routingData.getGroups();
        setGroups(data || []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (groups.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 md:mb-4">
            Gabung Komunitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Pencari Kerja</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            Dapatkan informasi lowongan kerja terbaru langsung di smartphone Anda. Bergabunglah dengan ribuan pencari kerja lainnya.
          </p>
        </div>

                        {/* --- MOBILE: HORIZONTAL SCROLL --- */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-hide">
            {groups.map((group, index) => (
                <div 
                    key={`mob-${index}`} 
                    className="snap-center shrink-0 w-[85vw] max-w-[320px]"
                    onClick={() => setSelectedGroup(group)}
                >
                    <Card className="p-5 rounded-2xl border-slate-200 shadow-sm active:scale-95 transition-transform h-full flex flex-col gap-4 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${group.platform.toLowerCase() === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}></div>

                        <div className="flex items-start gap-4">
                            {/* Logo */}
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-2 shrink-0">
                                <img 
                                    src={group.logo || (group.platform.toLowerCase() === 'whatsapp' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png")} 
                                    alt="Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1 min-w-0">
                                <h3 className="font-bold text-slate-900 line-clamp-1 text-lg">{group.nama_group}</h3>
                                
                                <div className="flex items-center gap-2 mt-1">
                                     {/* Avatars */}
                                     <div className="flex items-center -space-x-2">
                                         {[1,2,3].map((i, idx) => (
                                             <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-200 overflow-hidden">
                                                 <img 
                                                    src={getAvatarUrl(String.fromCharCode(65 + (index + idx) % 26), index + idx)} 
                                                    alt="User" 
                                                    className="w-full h-full object-cover" 
                                                 />
                                             </div>
                                         ))}
                                     </div>
                                     <span className="text-[10px] text-slate-500 font-medium truncate">
                                         <span className="font-bold text-slate-900">{group.anggota.toLocaleString()}+</span> Telah Bergabung
                                     </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                            {group.deskripsi}
                        </p>
                    </Card>
                </div>
            ))}
        </div>

        {/* --- DESKTOP: GRID --- */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group, index) => (
            <Card 
                key={index} 
                onClick={() => setSelectedGroup(group)}
                className="p-6 rounded-2xl border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden flex flex-col h-full cursor-pointer hover:-translate-y-1"
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 -translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight className="w-5 h-5 text-slate-400" />
              </div>

              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${group.platform.toLowerCase() === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
              
              <div className="relative z-10 flex flex-col h-full">
                {/* Header: Logo & Title Side-by-Side */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 p-2 shrink-0 flex items-center justify-center">
                    <img 
                        src={group.logo || (group.platform.toLowerCase() === 'whatsapp' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png")} 
                        alt="Logo" 
                        className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight min-w-0 group-hover:text-blue-600 transition-colors">
                    {group.nama_group}
                  </h3>
                </div>

                {/* Stats Row (Below Logo) */}
                <div className="flex items-center gap-3 mb-5 pl-1">
                    <div className="flex items-center -space-x-2">
                        {[1,2,3].map((i, idx) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                <img 
                                    src={getAvatarUrl(String.fromCharCode(65 + (index + idx) % 26), index + idx)} 
                                    alt="User" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        ))}
                    </div>
                    <span className="text-xs text-slate-500 font-medium truncate">
                        <span className="font-bold text-slate-900">{group.anggota.toLocaleString()}+</span> Telah Bergabung
                    </span>
                </div>

                <p className="text-slate-500 text-sm line-clamp-3 flex-1">{group.deskripsi}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* --- MODAL / BOTTOM SHEET --- */}
      <AnimatePresence>
        {selectedGroup && (
            <>
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedGroup(null)}
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                />
                
                {/* Mobile Bottom Sheet */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[70] md:hidden p-6 pb-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)]"
                >
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                    
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 p-2 shadow-sm">
                                <img 
                                    src={selectedGroup.logo || (selectedGroup.platform.toLowerCase() === 'whatsapp' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png")} 
                                    alt="Logo" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{selectedGroup.nama_group}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                    <span className={cn("px-2 py-0.5 rounded text-xs font-bold", selectedGroup.platform.toLowerCase() === 'whatsapp' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>
                                        {selectedGroup.platform}
                                    </span>
                                    <span>• {selectedGroup.anggota.toLocaleString()}+ Anggota</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedGroup(null)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-900 mb-2">Tentang Komunitas</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {selectedGroup.deskripsi}
                        </p>
                    </div>

                    <a href={selectedGroup.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button 
                            size="lg"
                            className={`w-full justify-center text-base font-bold py-6 rounded-xl shadow-xl ${
                            selectedGroup.platform.toLowerCase() === 'whatsapp' 
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                            }`}
                        >
                            Gabung Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </a>
                </motion.div>

                {/* Desktop Popup Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                    animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                    exit={{ opacity: 0, scale: 0.95, y: "-50%", x: "-50%" }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-1/2 left-1/2 w-full max-w-lg bg-white rounded-3xl z-[70] hidden md:block p-8 shadow-2xl"
                >
                    <button onClick={() => setSelectedGroup(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-100 p-4 shadow-sm mb-4">
                            <img 
                                src={selectedGroup.logo || (selectedGroup.platform.toLowerCase() === 'whatsapp' ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png")} 
                                alt="Logo" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{selectedGroup.nama_group}</h3>
                        <div className="flex items-center justify-center gap-3">
                             <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", selectedGroup.platform.toLowerCase() === 'whatsapp' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700")}>
                                {selectedGroup.platform}
                            </span>
                            <span className="text-slate-500 font-medium text-sm">{selectedGroup.anggota.toLocaleString()}+ Anggota</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
                        <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Deskripsi Group</h4>
                        <p className="text-slate-600 leading-relaxed">
                            {selectedGroup.deskripsi}
                        </p>
                    </div>

                    <a href={selectedGroup.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button 
                            size="lg"
                            className={`w-full justify-center text-lg font-bold py-6 rounded-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all ${
                            selectedGroup.platform.toLowerCase() === 'whatsapp' 
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-200' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                            }`}
                        >
                            Gabung Group Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </a>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </section>
  );
};
