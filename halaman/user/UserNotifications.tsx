
import React, { useState, useEffect } from 'react';
import { Button } from '../../komponen/ui/Button';
import { Bell, Briefcase, CheckCircle2, AlertCircle, Clock, Info, Trash2, MailOpen, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Card } from '../../komponen/ui/Card';
import { routingData } from '../../services/routingData';
import { Notifikasi } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

// Helper to calculate relative time from numeric timestamp
const getTimeAgo = (timestamp: number) => {
    // Ensure we handle potential legacy strings by casting, though type says number
    const date = new Date(Number(timestamp));
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "Baru saja";
};

// Helper to group by date from numeric timestamp
const getDateGroup = (timestamp: number) => {
    const date = new Date(Number(timestamp));
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Hari Ini";
    if (date.toDateString() === yesterday.toDateString()) return "Kemarin";
    
    // Check if within this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (date > oneWeekAgo) return "Minggu Ini";

    return "Lebih Lama";
};

export const UserNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<(Notifikasi & { read: boolean, timeAgo: string, dateGroup: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    routingData.getNotifications()
      .then(data => {
        // 1. Filter: "kepada" matches user id OR it's null (system broadcast)
        // Adjust filter logic to use 'kepada' instead of 'user_id'
        const myNotifications = data.filter(n => !n.kepada || (user && n.kepada === user.id));
        
        // 2. Read Status
        const readIds = JSON.parse(localStorage.getItem('read_notifications') || '[]');

        // 3. Transform Data using new number-based helpers
        const processed = myNotifications.map(n => ({
            ...n,
            read: readIds.includes(n.id),
            timeAgo: getTimeAgo(n.created_at),
            dateGroup: getDateGroup(n.created_at)
        }));

        // Sort by newest first
        processed.sort((a, b) => b.created_at - a.created_at);

        setNotifications(processed);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch notifications", err);
        setLoading(false);
      });
  }, [user]);

  const markAllRead = () => {
    const newNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(newNotifications);
    
    const allIds = newNotifications.map(n => n.id);
    localStorage.setItem('read_notifications', JSON.stringify(allIds));
  };

  const deleteNotification = async (id: number) => {
      try {
          await routingData.deleteNotification(id);
          setNotifications(notifications.filter(n => n.id !== id));
      } catch (e) {
          console.error("Failed to delete notification", e);
      }
  }

  const getIcon = (type: string) => {
    switch (type) {
        case 'success': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        case 'warning': return <AlertCircle className="w-5 h-5 text-orange-600" />;
        case 'info': return <Briefcase className="w-5 h-5 text-blue-600" />;
        default: return <Info className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
        case 'success': return 'bg-green-100/50 border-green-100 text-green-700';
        case 'warning': return 'bg-orange-100/50 border-orange-100 text-orange-700';
        case 'info': return 'bg-blue-100/50 border-blue-100 text-blue-700';
        default: return 'bg-slate-100/50 border-slate-100 text-slate-700';
    }
  };

  const grouped = notifications.reduce((acc: Record<string, any[]>, curr) => {
      (acc[curr.dateGroup] = acc[curr.dateGroup] || []).push(curr);
      return acc;
  }, {});

  const groupOrder = ["Hari Ini", "Kemarin", "Minggu Ini", "Lebih Lama"];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                    <Bell className="w-6 h-6 text-blue-600" />
                </div>
                Pusat Notifikasi
           </h1>
           <p className="text-slate-500 mt-2 font-medium ml-1">Pantau semua aktivitas akun dan pembaruan lowongan Anda.</p>
        </div>
        <Button variant="outline" onClick={markAllRead} className="rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
            <MailOpen className="w-4 h-4 mr-2" /> Tandai semua dibaca
        </Button>
      </div>

      <div className="space-y-10">
         {Object.keys(grouped).length === 0 && (
             <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-200">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Bell className="w-6 h-6 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Tidak ada notifikasi</h3>
                 <p className="text-slate-500 mt-1">Anda sudah melihat semua pembaruan.</p>
             </div>
         )}

         {groupOrder.map((group) => {
             if (!grouped[group]) return null;
             return (
                 <div key={group} className="animate-fade-in-up">
                     <div className="flex items-center gap-4 mb-5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap px-4 py-1 bg-slate-100 rounded-full">{group}</h3>
                        <div className="h-px w-full bg-slate-100"></div>
                     </div>
                     
                     <div className="grid gap-4">
                        {grouped[group].map((item: Notifikasi & { read: boolean, timeAgo: string }) => (
                            <Card 
                                key={item.id} 
                                className={cn(
                                    "p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 group border-none rounded-3xl",
                                    item.read ? "bg-white opacity-80 hover:opacity-100" : "bg-white ring-1 ring-blue-100 shadow-md shadow-blue-100/20"
                                )}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="p-6 md:p-6 flex items-start gap-6 flex-1">
                                        <div className={cn("p-3.5 rounded-2xl shrink-0 shadow-sm border", getStyles(item.type))}>
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <div className="flex flex-col">
                                                    {item.dari && (
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide mb-1">
                                                            Dari: {item.dari === 'c1' ? 'TechNova' : item.dari}
                                                        </span>
                                                    )}
                                                    <h3 className={cn("font-bold text-lg leading-tight", item.read ? "text-slate-600" : "text-slate-900")}>
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                {!item.read && (
                                                    <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-blue-600 text-white shadow-sm shadow-blue-200 ml-2">
                                                        Baru
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-slate-500 leading-relaxed text-sm font-medium mb-3">
                                                {item.message}
                                            </p>
                                            
                                            {/* Action Button Section */}
                                            {item.tombol_ajakan && item.hyperlink && (
                                                <div className="mt-4 mb-2 flex items-center gap-3">
                                                    <Link to={item.hyperlink}>
                                                        <Button size="sm" className="rounded-xl px-5 text-xs font-bold h-9">
                                                            {item.tombol_ajakan || 'Lihat Detail'} <ArrowRight className="w-3 h-3 ml-2" />
                                                        </Button>
                                                    </Link>
                                                    {item.deskripsi_ajakan && (
                                                        <span className="text-xs text-slate-400 italic hidden sm:inline-block">
                                                            {item.deskripsi_ajakan}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md">
                                                    <Clock className="w-3 h-3" /> {item.timeAgo}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-100 p-2 flex md:flex-col items-center justify-center">
                                        <button 
                                            className="w-full md:w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
                                            onClick={() => deleteNotification(item.id)}
                                            title="Hapus Notifikasi"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                     </div>
                 </div>
             );
         })}
      </div>
    </div>
  );
};
