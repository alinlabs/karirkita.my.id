
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencariKerja } from '../../types';
import { cn } from '../../utils/cn';
import { Text } from '../../komponen/ui/Text';
import { routingData } from '../../services/routingData';

interface CardPelamarProps {
  talent: PencariKerja;
}

export const CardPelamar: React.FC<CardPelamarProps> = ({ talent }) => {
  const [verifiedIcon, setVerifiedIcon] = useState<string>('');

  useEffect(() => {
    routingData.getIcons().then((icons: any) => {
        if (icons && icons.verifikasi) {
            setVerifiedIcon(icons.verifikasi);
        }
    });
  }, []);
  
  const calculateExperience = () => {
    if (!talent.pengalaman_kerja || !Array.isArray(talent.pengalaman_kerja) || talent.pengalaman_kerja.length === 0) return "Fresh Grad";
    
    let totalYears = 0;
    const currentYear = new Date().getFullYear();
    
    // Simple calculation based on array length or dummy logic if dates are strings
    // Ideally parse dates, but for now let's just count entries as years for simplicity or use existing logic
    // The existing logic seems to try parsing, let's keep it but safeguard
    try {
        talent.pengalaman_kerja.forEach(exp => {
          const start = parseInt(exp.tanggal_mulai);
          const end = exp.tanggal_selesai === 'Present' ? currentYear : parseInt(exp.tanggal_selesai);
          
          if (!isNaN(start) && !isNaN(end)) {
            let diff = end - start;
            if (diff === 0) diff = 1;
            totalYears += diff;
          }
        });
    } catch (e) { return "Fresh Grad"; }

    if (totalYears === 0) return "Fresh Grad";
    return `${totalYears} Thn`;
  };

  const experience = calculateExperience();
  const isFreshGrad = experience === "Fresh Grad";
  
  const hardSkills = Array.isArray(talent.keahlian) ? talent.keahlian.length : 0;
  const softSkills = Math.floor(hardSkills * 0.8) + 2;

  // Use new property names: banner and foto_profil
  const coverImage = talent.banner || `https://placehold.co/600x200/1e293b/ffffff?text=Talent+${talent.user_id}`;
  const profileImage = talent.foto_profil || `https://placehold.co/400x400/2563eb/ffffff?text=${talent.nama_lengkap.charAt(0)}`;

  // Construct readable domicile from address parts if domisili field is gone, or use kota/provinsi
  const displayLocation = talent.kota ? `${talent.kota}, ${talent.provinsi}` : 'Indonesia';

  return (
    <Link 
      to={`/profil/${talent.username}`}
      className="group relative bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-200 flex flex-col h-full hover:shadow-lg transition-all duration-300"
    >
      
      {/* 1. Header with Image */}
      <div className="h-14 md:h-24 relative overflow-hidden shrink-0">
        <img 
          src={coverImage} 
          alt="Cover" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-purple-900/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        {talent.status_saja && (
          <div className="absolute top-2 right-2 px-2 py-0.5 md:px-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center gap-1 shadow-sm z-10">
            <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-green-400"></span>
            </span>
            <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider"><Text>Open</Text></span>
          </div>
        )}
      </div>

      {/* 2. Avatar Center & Circular */}
      <div className="px-2 md:px-5 relative shrink-0 flex justify-center">
        <div className="w-12 h-12 md:w-24 md:h-24 -mt-6 md:-mt-12 rounded-full p-1 bg-white shadow-lg relative z-10">
          <img 
            src={profileImage} 
            alt={talent.nama_lengkap} 
            className="w-full h-full object-cover rounded-full bg-slate-100"
          />
        </div>
      </div>

      {/* 3. Content Body - Centered */}
      <div className="px-2 md:px-5 pt-2 md:pt-3 pb-2 md:pb-4 flex-1 flex flex-col text-center">
        <div className="mb-2 md:mb-3">
            <div className="flex items-center justify-center gap-1">
                <h3 className="text-xs md:text-xl font-bold text-slate-900 transition-colors line-clamp-2 max-w-[90%] md:max-w-[80%]">{talent.nama_lengkap}</h3>
                {talent.verifikasi === 'disetujui' && verifiedIcon && (
                    <img src={verifiedIcon} alt="Verified" className="w-3 h-3 md:w-5 md:h-5" title="Terverifikasi" />
                )}
            </div>
            <p className="text-[10px] md:text-sm font-medium text-slate-500 truncate"><Text>{talent.headline}</Text></p>
            <div className="text-[9px] md:text-xs text-slate-400 mt-0.5 md:mt-1 truncate">
                <Text>{displayLocation}</Text>
            </div>
        </div>

        {/* 4. Statistics Row */}
        <div className="grid grid-cols-3 border-t border-slate-100 mt-auto divide-x divide-slate-100 pt-2 md:pt-3">
            {/* Soft Skills */}
            <div className="flex flex-col items-center justify-center px-1">
                <p className="text-xs md:text-base font-bold text-slate-900">{softSkills}</p>
                <div className="flex flex-col items-center gap-0.5">
                    <p className="text-[7px] md:text-[9px] text-slate-400 uppercase font-bold tracking-wider"><Text>Soft</Text></p>
                </div>
            </div>

            {/* Hard Skills */}
            <div className="flex flex-col items-center justify-center px-1">
                <p className="text-xs md:text-base font-bold text-slate-900">{hardSkills}</p>
                <div className="flex flex-col items-center gap-0.5">
                    <p className="text-[7px] md:text-[9px] text-slate-400 uppercase font-bold tracking-wider"><Text>Hard</Text></p>
                </div>
            </div>

            {/* Experience */}
            <div className="flex flex-col items-center justify-center px-1">
                <p className={cn(
                    "font-bold text-slate-900 flex items-center justify-center",
                    isFreshGrad ? "text-[8px] md:text-[10px] leading-3 text-center text-blue-600 px-1" : "text-xs md:text-base"
                )}>
                    {isFreshGrad ? <Text>Fresh Grad</Text> : experience.replace('Thn', '')} {experience.includes('Thn') && <Text>Thn</Text>}
                </p>
                <div className="flex flex-col items-center gap-0.5">
                    <p className="text-[7px] md:text-[9px] text-slate-400 uppercase font-bold tracking-wider"><Text>Exp</Text></p>
                </div>
            </div>
        </div>
      </div>
    </Link>
  );
};
