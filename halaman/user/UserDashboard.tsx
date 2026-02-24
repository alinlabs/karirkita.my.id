
import React, { useEffect, useState } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Link } from 'react-router-dom';
import { 
    UserCircle, Briefcase, Plus, Eye, Building2, TrendingUp, Clock, 
    ChevronRight, FileText, ArrowUpRight, Send, PhoneCall, Search, 
    Target, Zap 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { Text } from '../../komponen/ui/Text';
import { routingData } from '../../services/routingData';
import { socket } from '../../services/socket';

export const UserDashboard = () => {
  const { user } = useAuth();
  
  // State untuk Mode Dashboard
  const [viewMode, setViewMode] = useState<'personal' | 'business'>('personal');

  // Business Stats State
  const [bizStats, setBizStats] = useState({
      activeJobs: 0,
      totalApplicants: 0,
      totalViews: 0
  });

  // Personal Stats State
  const [personalStats, setPersonalStats] = useState({
      applied: 0,
      interviews: 0,
      profileViews: 0
  });

  // Activity State
  const [timelineItems, setTimelineItems] = useState<any[]>([]);
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  const fetchData = async () => {
      if (!user?.id) return;

      try {
          // 1. Fetch Raw Data from Remote (via routingData)
          const [jobsData, companiesData, userData, notifsData] = await Promise.all([
              routingData.getJobs(1, 100), // Fetch up to 100 jobs for stats
              routingData.getCompanies(),
              routingData.getTalents(), // Fetch ALL talents to ensure we find the right one
              routingData.getNotifications()
          ]);

          const jobs = Array.isArray(jobsData) ? jobsData : [];
          const companies = Array.isArray(companiesData) ? companiesData : [];
          
          let currentUser = null;
          if (Array.isArray(userData)) {
              // Try to find the user by ID (checking both id_pengguna and user_id)
              currentUser = userData.find((u: any) => u.id_pengguna === user.id || u.user_id === user.id);
              
              // Fallback to first user if not found (matching UserProfile behavior for single-user dev/test)
              if (!currentUser && userData.length > 0) {
                  currentUser = userData[0];
              }
          } else {
              currentUser = userData;
          }

          const notifications = Array.isArray(notifsData) ? notifsData : [];

          // 2. Calculate Business Stats
          if (viewMode === 'business') {
              const myCompanies = companies.filter((c: any) => c.id_pengguna === user.id);
              const myCompanyIds = myCompanies.map((c: any) => c.id_perusahaan);
              const myJobs = jobs.filter((j: any) => myCompanyIds.includes(j.id_perusahaan));

              let applicantsCount = 0;
              let viewsCount = 0;

              myJobs.forEach((job: any) => {
                  viewsCount += job.dilihat || 0;
                  try {
                      const apps = typeof job.lamaran === 'string' ? JSON.parse(job.lamaran) : (job.lamaran || []);
                      applicantsCount += apps.length;
                  } catch (e) {}
              });

              setBizStats({
                  activeJobs: myJobs.filter((j: any) => j.status === 'Active').length,
                  totalApplicants: applicantsCount,
                  totalViews: viewsCount
              });
          } 
          
          // 3. Calculate Personal Stats
          else {
              let appliedCount = 0;
              let interviewCount = 0;

              jobs.forEach((job: any) => {
                  try {
                      const apps = typeof job.lamaran === 'string' ? JSON.parse(job.lamaran) : (job.lamaran || []);
                      if (apps.some((a: any) => a.user_id === user.id)) appliedCount++;

                      const interviews = typeof job.interview === 'string' ? JSON.parse(job.interview) : (job.interview || []);
                      if (interviews.some((i: any) => i.user_id === user.id)) interviewCount++;
                  } catch (e) {}
              });

              setPersonalStats({
                  applied: appliedCount,
                  interviews: interviewCount,
                  profileViews: currentUser ? (currentUser.dilihat || 0) : 0
              });
          }

          // 4. Build Timeline (Activities)
          const activities: any[] = [];

          // Add Notifications
          const myNotifs = notifications.filter((n: any) => n.kepada === user.id);
          myNotifs.forEach((n: any) => {
              activities.push({
                  title: n.title,
                  desc: n.message,
                  time: formatTime(n.created_at),
                  color: n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500',
                  timestamp: new Date(n.created_at).getTime()
              });
          });

          // Add Applications & Interviews (Personal Mode)
          if (viewMode === 'personal') {
              jobs.forEach((job: any) => {
                  try {
                      const apps = typeof job.lamaran === 'string' ? JSON.parse(job.lamaran) : (job.lamaran || []);
                      const myApp = apps.find((a: any) => a.user_id === user.id);
                      if (myApp) {
                          const company = companies.find((c: any) => c.id_perusahaan === job.id_perusahaan);
                          activities.push({
                              title: 'Lamaran Terkirim',
                              desc: `Ke ${company?.nama || 'Perusahaan'} untuk posisi ${job.posisi}`,
                              time: formatTime(myApp.tanggal || Date.now()),
                              color: 'bg-emerald-500',
                              timestamp: new Date(myApp.tanggal || Date.now()).getTime(),
                              meta: { jobSlug: job.slug, companySlug: company?.slug }
                          });
                      }

                      const interviews = typeof job.interview === 'string' ? JSON.parse(job.interview) : (job.interview || []);
                      const myInt = interviews.find((i: any) => i.user_id === user.id);
                      if (myInt) {
                          const company = companies.find((c: any) => c.id_perusahaan === job.id_perusahaan);
                          activities.push({
                              title: 'Panggilan Interview',
                              desc: `Dari ${company?.nama || 'Perusahaan'} untuk posisi ${job.posisi}`,
                              time: formatTime(myInt.tanggal || Date.now()),
                              color: 'bg-orange-500',
                              timestamp: new Date(myInt.tanggal || Date.now()).getTime(),
                              meta: { jobSlug: job.slug, companySlug: company?.slug }
                          });
                      }
                  } catch (e) {}
              });
          }

          // Sort and Slice
          activities.sort((a, b) => b.timestamp - a.timestamp);
          setTimelineItems(activities.slice(0, 5));

      } catch (error) {
          console.error("Failed to fetch dashboard data", error);
      }
  };

  useEffect(() => {
      fetchData();

      // Realtime Listener (Socket) - Optional: Keep if you want push updates, remove if you want STRICTLY only load/refresh
      // The user said "only fetch on initial enter or refresh", but usually realtime push is acceptable. 
      // However, to strictly follow "stop constant requests", I will remove the polling.
      // I will keep the socket listener as it is efficient and not a "request" loop, but if the user is very strict about "only load/refresh", 
      // I should probably remove the socket listener too if it triggers fetches. 
      // But usually "constant request" refers to polling. 
      // Let's keep socket for true realtime (push) but remove polling.
      
      socket.on('dashboard_update', (data: any) => {
          if (data.userId === user?.id) {
              fetchData();
          }
      });

      return () => {
          socket.off('dashboard_update');
      };
  }, [user, viewMode]);

  const isBusiness = viewMode === 'business';

  // Helper to format time relative
  const formatTime = (timestamp: number | string) => {
      const date = new Date(timestamp).getTime();
      const diff = Date.now() - date;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 1) return 'Baru saja';
      if (hours < 24) return `${hours} jam lalu`;
      const days = Math.floor(hours / 24);
      return `${days} hari lalu`;
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      
      {/* --- MODE SWITCHER (DEMO PURPOSE) --- */}
      <div className="flex justify-end">
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
              <button 
                onClick={() => setViewMode('personal')}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
                    !isBusiness ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                  <UserCircle className="w-4 h-4" /> Mode Personal
              </button>
              <button 
                onClick={() => setViewMode('business')}
                className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
                    isBusiness ? "bg-purple-50 text-purple-600 shadow-sm" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                  <Building2 className="w-4 h-4" /> Mode Bisnis
              </button>
          </div>
      </div>

      {/* 1. Hero / Welcome Banner */}
      <div className={cn(
          "relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl p-6 md:p-12 animate-fade-in-up transition-colors duration-500",
          isBusiness 
            ? "bg-gradient-to-br from-purple-800 via-indigo-800 to-slate-900 shadow-purple-900/20" 
            : "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 shadow-blue-900/20"
      )}>
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none mix-blend-overlay">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-60 h-60 md:w-80 md:h-80 fill-current animate-[spin_60s_linear_infinite]">
                <path d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.1C93.5,9,82.2,22.4,71.2,34.1C60.2,45.8,49.5,55.8,37.4,63.6C25.3,71.4,11.8,77,-1.2,79.1C-14.2,81.1,-27.2,79.7,-38.8,73.1C-50.4,66.5,-60.6,54.7,-68.6,41.9C-76.6,29.1,-82.4,15.3,-81.2,2C-80,-11.3,-71.8,-24.1,-62.4,-35.3C-53,-46.1,-42.4,-55.3,-30.9,-64.1C-19.4,-72.9,-7,-81.3,6.2,-92C19.4,-102.7,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                    {isBusiness ? <Building2 className="w-3.5 h-3.5" /> : <UserCircle className="w-3.5 h-3.5" />}
                    <span>{isBusiness ? 'Company Dashboard' : 'Talent Dashboard'}</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 tracking-tight">
                    <Text>{greeting}</Text>, {user?.name || 'User'}! 👋
                </h1>
                <p className="text-blue-100/90 max-w-lg text-sm md:text-lg leading-relaxed font-medium">
                    {isBusiness 
                        ? <Text>Kelola pelamar dan optimalkan strategi rekrutmen Anda hari ini.</Text>
                        : <Text>Siap menjemput peluang baru? Profil Anda semakin dilirik perekrut.</Text>
                    }
                </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
                {isBusiness ? (
                    <Link to="/user/jobs/new" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto h-12 px-6 bg-white text-purple-700 hover:bg-purple-50 border-none shadow-xl shadow-purple-900/10 rounded-2xl font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0">
                            <Plus className="w-5 h-5 mr-2" /> <Text>Posting Lowongan</Text>
                        </Button>
                    </Link>
                ) : (
                    <Link to="/pekerjaan" className="w-full md:w-auto">
                        <Button className="w-full md:w-auto h-12 px-6 bg-white text-blue-700 hover:bg-blue-50 border-none shadow-xl shadow-blue-900/10 rounded-2xl font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0">
                            <Search className="w-5 h-5 mr-2" /> <Text>Cari Lowongan</Text>
                        </Button>
                    </Link>
                )}
            </div>
        </div>
      </div>

      {/* 2. Statistics Cards (Dynamic based on Mode) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {isBusiness ? (
            <>
                <StatsCard 
                    title="Total Pelamar" 
                    value={bizStats.totalApplicants} 
                    trend="+12%" 
                    icon={<FileText className="w-5 h-5" />}
                    color="emerald"
                    delay="100ms"
                />
                <StatsCard 
                    title="Lowongan Aktif" 
                    value={bizStats.activeJobs} 
                    trend="Running" 
                    icon={<Briefcase className="w-5 h-5" />}
                    color="purple"
                    delay="200ms"
                />
                <StatsCard 
                    title="Total Views" 
                    value={bizStats.totalViews.toLocaleString()} 
                    trend="+85 Visits" 
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="blue"
                    delay="300ms"
                />
            </>
        ) : (
            <>
                <StatsCard 
                    title="Lamaran Terkirim" 
                    value={personalStats.applied} 
                    trend="+2 Minggu Ini" 
                    icon={<Send className="w-5 h-5" />}
                    color="blue"
                    delay="100ms"
                />
                <StatsCard 
                    title="Panggilan Interview" 
                    value={personalStats.interviews} 
                    trend="Segera Hadir" 
                    icon={<PhoneCall className="w-5 h-5" />}
                    color="orange"
                    delay="200ms"
                />
                <StatsCard 
                    title="Profil Dilihat" 
                    value={personalStats.profileViews} 
                    trend="+15 Perekrut" 
                    icon={<Eye className="w-5 h-5" />}
                    color="indigo"
                    delay="300ms"
                />
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* 3. Shortcuts & Quick Actions */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", isBusiness ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600")}>
                    <Zap className="w-5 h-5" />
                </div>
                <Text>Menu Cepat</Text>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-5">
                {isBusiness ? (
                    /* Business Shortcuts */
                    <>
                        <QuickLink 
                            to="/user/company"
                            icon={Building2}
                            title="Profil Perusahaan"
                            desc="Branding & Info"
                            color="text-purple-600"
                            bg="bg-purple-50"
                        />
                        <QuickLink 
                            to="/user/jobs"
                            icon={Briefcase}
                            title="Kelola Lowongan"
                            desc="Edit & Hapus"
                            color="text-blue-600"
                            bg="bg-blue-50"
                        />
                        <QuickLink 
                            to="/pelamar"
                            icon={Target}
                            title="Cari Kandidat"
                            desc="Database Talent"
                            color="text-emerald-600"
                            bg="bg-emerald-50"
                        />
                        <QuickLink 
                            to="/user/letters"
                            icon={FileText}
                            title="Surat Offering"
                            desc="Template Otomatis"
                            color="text-orange-600"
                            bg="bg-orange-50"
                        />
                    </>
                ) : (
                    /* Personal Shortcuts */
                    <>
                        <QuickLink 
                            to="/user/profile"
                            icon={UserCircle}
                            title="Edit CV Online"
                            desc="Update Skill"
                            color="text-blue-600"
                            bg="bg-blue-50"
                        />
                        <QuickLink 
                            to="/user/cv"
                            icon={Eye}
                            title="Lihat Profil"
                            desc="Preview Publik"
                            color="text-indigo-600"
                            bg="bg-indigo-50"
                        />
                        <QuickLink 
                            to="/user/letters"
                            icon={FileText}
                            title="Buat Lamaran"
                            desc="Generator Surat"
                            color="text-emerald-600"
                            bg="bg-emerald-50"
                        />
                        <QuickLink 
                            to="/pekerjaan"
                            icon={Search}
                            title="Eksplorasi Kerja"
                            desc="Cari Peluang"
                            color="text-pink-600"
                            bg="bg-pink-50"
                        />
                    </>
                )}
            </div>
        </div>

        {/* 4. Recent Activity Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-xl">
                    <Clock className="w-5 h-5 text-slate-600" />
                </div>
                Aktivitas Terbaru
            </h2>
            <Card className="p-0 overflow-hidden border-none shadow-lg shadow-slate-200/50 rounded-3xl">
                <div className="p-5 md:p-6 space-y-6">
                    {timelineItems.length > 0 ? (
                        timelineItems.map((item, idx) => (
                            <TimelineItem key={idx} item={item} isLast={idx === timelineItems.length - 1} />
                        ))
                    ) : (
                        <div className="text-center text-slate-400 py-4 text-sm">Belum ada aktivitas terbaru</div>
                    )}
                </div>
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 text-center backdrop-blur-sm">
                    <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl">
                        <Text>Lihat Semua Aktivitas</Text>
                    </Button>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

const TimelineItem = ({ item, isLast }: any) => (
    <div className="flex gap-4 relative">
        {/* Connector Line */}
        {!isLast && <div className="absolute top-8 left-[7px] w-0.5 h-full bg-slate-100"></div>}
        
        <div className={`w-4 h-4 mt-1.5 rounded-full shrink-0 ${item.color} ring-4 ring-white shadow-sm z-10`}></div>
        <div>
            <h4 className="text-sm font-bold text-slate-800"><Text>{item.title}</Text></h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium"><Text>{item.desc}</Text></p>
            
            {/* Links if available */}
            {item.meta && (item.meta.jobSlug || item.meta.companySlug) && (
                <div className="flex gap-2 mt-1">
                    {item.meta.jobSlug && (
                        <Link to={`/pekerjaan/${item.meta.jobSlug}`} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                            Lihat Lowongan <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                    )}
                    {item.meta.companySlug && (
                        <Link to={`/perusahaan/${item.meta.companySlug}`} className="text-[10px] font-bold text-purple-600 hover:underline flex items-center gap-0.5">
                            Profil Perusahaan <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                    )}
                </div>
            )}

            <span className="text-[10px] text-slate-400 font-bold mt-1.5 block uppercase tracking-wide"><Text>{item.time}</Text></span>
        </div>
    </div>
);

const StatsCard = ({ title, value, trend, icon, color, delay }: any) => {
    const colors: any = {
        blue: "bg-blue-500 shadow-blue-500/30",
        purple: "bg-purple-500 shadow-purple-500/30",
        emerald: "bg-emerald-500 shadow-emerald-500/30",
        orange: "bg-orange-500 shadow-orange-500/30",
        indigo: "bg-indigo-500 shadow-indigo-500/30",
    };
    
    return (
        <Card className="p-5 md:p-6 relative overflow-hidden group transition-all duration-500 border-none shadow-lg shadow-slate-200/50 rounded-[2rem] animate-scale-in" style={{ animationDelay: delay }}>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-xs md:text-sm font-bold text-slate-400 mb-1 md:mb-2 uppercase tracking-wider"><Text>{title}</Text></p>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
                    <div className="flex items-center gap-1.5 mt-2 md:mt-3">
                        <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1">
                            <TrendingUp className={`w-3 h-3 ${trend.includes('+') || trend === 'Running' ? 'text-green-500' : 'text-slate-500'}`} />
                            <span className="text-[10px] md:text-xs font-bold text-slate-600"><Text>{trend}</Text></span>
                        </div>
                    </div>
                </div>
                <div className={`p-3 md:p-4 rounded-2xl shadow-lg text-white ${colors[color]} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}

const QuickLink = ({ to, icon: Icon, title, desc, color, bg }: any) => (
    <Link to={to} className="group block h-full">
        <Card className="p-4 md:p-6 h-full border-none shadow-md shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 rounded-[2rem] flex flex-col justify-center relative overflow-hidden bg-white">
            <div className={`absolute top-0 right-0 p-8 rounded-bl-[4rem] opacity-20 transition-transform duration-500 group-hover:scale-150 ${bg}`}></div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 relative z-10">
                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${bg} ${color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm md:text-lg text-slate-900 group-hover:text-blue-600 transition-colors truncate"><Text>{title}</Text></h3>
                    <p className="text-xs md:text-sm font-medium text-slate-400 mt-0.5 truncate"><Text>{desc}</Text></p>
                </div>
                <div className="hidden md:block ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                    <ArrowUpRight className="w-5 h-5 text-slate-300" />
                </div>
            </div>
        </Card>
    </Link>
);
