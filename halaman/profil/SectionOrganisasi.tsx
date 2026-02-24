
import React from 'react';
import { Users } from 'lucide-react';
import { Organisasi } from '../../types';

export const SectionOrganisasi = ({ organizations }: { organizations: Organisasi[] }) => {
    if (!organizations || organizations.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-500" /> Riwayat Organisasi
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {organizations.map((org) => (
                    <div key={org.id} className="bg-white rounded-[2rem] p-4 md:p-6 border border-slate-100 shadow-sm flex flex-row gap-4 md:gap-6 items-start">
                        <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100">
                            <img src={org.logo_url || "https://placehold.co/100x100"} alt={org.nama_organisasi} className="w-full h-full object-contain rounded-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1 gap-1">
                                <h4 className="text-base md:text-lg font-bold text-slate-900 truncate">{org.nama_organisasi}</h4>
                                <span className="text-[10px] md:text-xs font-bold bg-purple-50 text-purple-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full whitespace-nowrap w-fit">
                                    {org.tanggal_mulai} - {org.tanggal_selesai}
                                </span>
                            </div>
                            <p className="text-purple-600 font-medium text-xs md:text-sm mb-2">{org.peran}</p>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2">{org.deskripsi}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
