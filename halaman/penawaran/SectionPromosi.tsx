import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Zap, Users, MessageCircle, Star, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '../../komponen/ui/Button';
import { Card } from '../../komponen/ui/Card';
import { routingData } from '../../services/routingData';
import { Promosi } from '../../types';

export const SectionPromosi = () => {
    const [packages, setPackages] = useState<Promosi[]>([]);

    useEffect(() => {
        routingData.getPromosi().then(data => {
            if (data) {
                setPackages(data);
            }
        });
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-12 md:mb-20">
                <Card className="p-4 md:p-5 border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">Top Listing</h3>
                    </div>
                    <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed">
                        Tampil di urutan teratas hasil pencarian kandidat.
                    </p>
                </Card>
                
                <Card className="p-4 md:p-5 border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">Broadcast</h3>
                    </div>
                    <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed">
                        Sebar info ke ribuan anggota komunitas aktif.
                    </p>
                </Card>

                <Card className="p-4 md:p-5 border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0">
                            <Users className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">Database</h3>
                    </div>
                    <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed">
                        Akses CV kandidat potensial sesuai kriteria.
                    </p>
                </Card>

                <Card className="p-4 md:p-5 border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">Social Media</h3>
                    </div>
                    <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed">
                        Promosi eksklusif di Instagram & LinkedIn kami.
                    </p>
                </Card>
            </div>

            {/* Pricing Cards */}
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 md:gap-8 pb-8 md:pb-0 -mx-4 px-4 md:mx-auto md:px-0 max-w-6xl scrollbar-hide snap-x snap-mandatory">
                {packages.map((pkg, index) => (
                    <div key={index} className={`relative group min-w-[85%] md:min-w-0 snap-center ${pkg.unggulan ? 'md:-mt-4 md:mb-4' : ''}`}>
                        {pkg.unggulan && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-0.5 md:px-4 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-lg z-10 whitespace-nowrap">
                                Paling Laris
                            </div>
                        )}
                        <Card className={`h-full p-6 md:p-8 rounded-2xl md:rounded-[2rem] flex flex-col relative overflow-hidden transition-all duration-300 ${
                            pkg.unggulan 
                                ? 'border-blue-200 shadow-xl shadow-blue-900/10 scale-100 md:scale-105 z-10 bg-white' 
                                : 'border-slate-200 shadow-sm hover:shadow-md bg-slate-50/50'
                        }`}>
                            <div className="mb-4 md:mb-6">
                                <h3 className={`text-lg md:text-xl font-bold mb-1 md:mb-2 ${pkg.unggulan ? 'text-blue-600' : 'text-slate-900'}`}>
                                    {pkg.nama}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl md:text-4xl font-black text-slate-900">{pkg.harga}</span>
                                    <span className="text-xs md:text-base text-slate-500 font-medium">{pkg.durasi}</span>
                                </div>
                                <p className="text-slate-500 mt-2 md:mt-4 text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
                                    {pkg.deskripsi}
                                </p>
                            </div>

                            <ul className="space-y-2 md:space-y-4 mb-6 md:mb-8 flex-1">
                                {pkg.fitur.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-slate-700">
                                        <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 shrink-0 ${pkg.unggulan ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button 
                                className={`w-full py-3 md:py-6 rounded-xl text-sm md:text-base font-bold shadow-lg transition-all ${
                                    pkg.unggulan 
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25 text-white' 
                                        : 'bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900'
                                }`}
                                as={Link}
                                to="/pembayaran"
                                state={{ item: pkg, type: 'promosi' }}
                            >
                                Pilih Paket
                            </Button>
                        </Card>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-24 bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Siap Merekrut Kandidat Terbaik?</h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Jangan biarkan posisi kosong terlalu lama. Mulai promosikan lowongan Anda sekarang dan temukan talenta yang tepat lebih cepat.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 py-6 px-8 rounded-xl font-bold text-lg">
                            Hubungi Sales
                        </Button>
                        <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 py-6 px-8 rounded-xl font-bold text-lg">
                            Pelajari Lebih Lanjut <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
