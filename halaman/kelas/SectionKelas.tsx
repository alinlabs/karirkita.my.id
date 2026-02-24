import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Calendar, Clock, Users, Star, ArrowRight, PlayCircle } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { Kelas } from '../../types';

export const SectionKelas = () => {
    const [classes, setClasses] = useState<Kelas[]>([]);

    useEffect(() => {
        routingData.getKelas().then(data => {
            if (data && data.kelas) {
                setClasses(data.kelas);
            }
        });
    }, []);

    return (
        <section>
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <PlayCircle className="w-6 h-6 text-blue-600" /> Kelas Terbaru
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Tingkatkan kompetensi dengan materi terupdate.</p>
                </div>
                <Link to="/kelas/semua">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {classes.map((item) => (
                    <Link key={item.id} to={`/kelas/${item.slug}`} className="group">
                        <Card className="h-full overflow-hidden border-slate-200 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={item.gambar} 
                                    alt={item.judul} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-900 shadow-sm">
                                    {item.kategori}
                                </div>
                                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {item.rating}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.tanggal}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.waktu}</span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.judul}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">oleh <span className="font-semibold text-slate-700">{item.mentor}</span></p>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${
                                                    ['bg-blue-500', 'bg-purple-500', 'bg-green-500'][i-1]
                                                }`}>
                                                    {String.fromCharCode(64 + i)}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <span className="font-bold text-slate-900">{item.peserta}+</span> Terdaftar
                                        </div>
                                    </div>
                                    {/* Price hidden on card, visible on detail page */}
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
};
