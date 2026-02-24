
import React from 'react';
import { Layout, Youtube, Layers, ShoppingBag, Tag, CheckCircle2, BarChart3, PieChart, Table as TableIcon, Code2 } from 'lucide-react';
import { Proyek, Layanan, MetrikProyek } from '../../types';
import { Button } from '../../komponen/ui/Button';
import { Chart, ChartDataPoint } from '../../komponen/ui/Chart';
import { cn } from '../../utils/cn';

// --- HELPER COMPONENTS ---

export const MetricVisualizer = ({ metric }: { metric: MetrikProyek }) => {
    if (!metric) return null;

    // Transform Data for Chart Component
    const chartData: ChartDataPoint[] = metric.data.map(d => ({
        label: d.label,
        value: typeof d.nilai === 'number' ? d.nilai : parseInt(d.nilai.toString().replace(/\D/g,'')) || 0,
        suffix: typeof d.nilai === 'string' && d.nilai.includes('%') ? '%' : '',
        description: d.deskripsi
    }));

    return (
        <div className="h-full p-3 md:p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center min-h-[80px]">
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                {metric.tipe === 'bar' && <BarChart3 className="w-3.5 h-3.5" />}
                {metric.tipe === 'circle' && <PieChart className="w-3.5 h-3.5" />}
                {metric.tipe === 'table' && <TableIcon className="w-3.5 h-3.5" />}
                <span className="truncate">{metric.judul}</span>
            </h5>

            {/* CHART RENDERER */}
            {(metric.tipe === 'bar' || metric.tipe === 'circle') && (
                <Chart type={metric.tipe} data={chartData} />
            )}

            {/* TABLE TYPE FALLBACK (Simple Table) */}
            {metric.tipe === 'table' && (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <table className="w-full text-[10px] text-left">
                        <tbody className="divide-y divide-slate-100">
                            {metric.data.slice(0, 2).map((item, idx) => (
                                <tr key={idx} className="bg-white">
                                    <td className="p-2 font-medium text-slate-600 truncate">{item.label}</td>
                                    <td className="p-2 font-bold text-slate-900 text-right">{item.nilai}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

interface ProjectCardProps {
    project: Proyek;
    onClick: (p: Proyek) => void;
    className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className }) => {
    const displayImage = project.banner_custom_url || project.gambar_url;
    const isVideo = !!project.video_url;
    const hasGallery = project.galeri_url && project.galeri_url.length > 0;

    return (
        <div 
          onClick={() => onClick(project)}
          className={cn(
            "group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col cursor-pointer w-full",
            className
          )}
        >
            {/* Media Container - 16:9 Aspect Ratio */}
            <div className="aspect-[16/9] w-full overflow-hidden relative bg-slate-100 shrink-0">
                <img 
                    src={displayImage} 
                    alt={project.judul} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Floating Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {hasGallery && (
                        <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-sm border border-white/10">
                            <Layers className="w-3 h-3" /> {project.galeri_url!.length + 1}
                        </span>
                    )}
                    {isVideo ? (
                        <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-sm border border-white/10">
                            <Youtube className="w-3 h-3" /> Video
                        </span>
                    ) : (
                        <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-sm border border-white/10">
                            <Layout className="w-3 h-3" /> Project
                        </span>
                    )}
                </div>
            </div>
            
            {/* Content - Compact & Consistent */}
            <div className="p-4 md:p-5 flex flex-col gap-4 flex-1">
                <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5 line-clamp-1 leading-tight">
                        {project.judul}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {project.deskripsi}
                    </p>
                </div>
                
                {/* Horizontal Metrics Grid */}
                {project.metrik && project.metrik.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-slate-100 border-dashed">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {project.metrik.slice(0, 2).map((metric, idx) => (
                              <div key={idx} className="h-full">
                                  <MetricVisualizer metric={metric} />
                              </div>
                          ))}
                      </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ServiceCardProps {
    service: Layanan;
    onClick: (s: Layanan) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => (
    <div 
      onClick={() => onClick(service)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
        {/* Media Container - 16:9 Aspect Ratio for Consistency */}
        <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-100 shrink-0">
            <img 
                src={service.thumbnail_url || "https://placehold.co/400x300/e2e8f0/64748b?text=Service"} 
                alt={service.judul} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {service.harga_coret && (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-[9px] md:text-[10px] font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
                    <Tag className="w-3 h-3" /> Promo
                </div>
            )}
        </div>
        
        {/* Content */}
        <div className="p-3 md:p-5 flex-1 flex flex-col gap-3 md:gap-4">
            <div className="mb-1">
                <h3 className="text-sm md:text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {service.judul}
                </h3>
                <p className="text-slate-500 text-[10px] md:text-sm leading-relaxed line-clamp-2">
                    {service.deskripsi}
                </p>
            </div>
            
            <div className="mt-auto">
                <div className="mb-3 md:mb-4">
                    {service.harga_coret ? (
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs text-slate-400 font-medium line-through decoration-red-500">{service.harga_coret}</span>
                            <span className="text-base md:text-xl font-black text-slate-900 tracking-tight">{service.harga}</span>
                        </div>
                    ) : (
                        <span className="text-base md:text-xl font-black text-slate-900 tracking-tight">{service.harga}</span>
                    )}
                </div>

                {service.fitur && (
                    <div className="space-y-1 mb-4 md:mb-5">
                        {service.fitur.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-sm font-medium text-slate-600 truncate">
                                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-green-500 shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>
                )}

                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/10 h-9 md:h-11 text-[10px] md:text-sm font-bold px-2">
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" /> Pesan
                </Button>
            </div>
        </div>
    </div>
);

// --- MAIN SECTIONS ---

interface SectionPortofolioProps {
    projects: Proyek[];
    onSelect: (p: Proyek) => void;
}

export const SectionPortofolio = ({ projects, onSelect }: SectionPortofolioProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project.id} project={project} onClick={onSelect} className="h-full" />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                        <Code2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Belum ada project</h3>
                        <p className="text-slate-500">Portfolio akan ditampilkan di sini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface SectionLayananProps {
    services: Layanan[];
    onSelect: (s: Layanan) => void;
}

export const SectionLayanan = ({ services, onSelect }: SectionLayananProps) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {services && services.length > 0 ? (
                    services.map((service) => (
                        <ServiceCard key={service.id} service={service} onClick={onSelect} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Belum ada layanan</h3>
                        <p className="text-slate-500">User ini belum menambahkan produk atau jasa.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
