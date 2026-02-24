
import React from 'react';
import { UserPlus, Search, Send, Briefcase, LucideIcon } from 'lucide-react';
import { Text } from '../../komponen/ui/Text';
import { StepItem } from '../../types';

export const SectionStepCaraKerja = () => {
  // Hardcoded steps as requested
  const steps: StepItem[] = [
    {
      judul: "Buat Akun",
      deskripsi: "Daftar sebagai pencari kerja dan lengkapi profil profesional Anda."
    },
    {
      judul: "Cari Lowongan",
      deskripsi: "Telusuri ribuan lowongan kerja yang sesuai dengan keahlian Anda."
    },
    {
      judul: "Kirim Lamaran",
      deskripsi: "Lamar pekerjaan impian Anda dengan satu klik mudah."
    },
    {
      judul: "Diterima Kerja",
      deskripsi: "Jadwalkan wawancara dan mulai karir baru Anda."
    }
  ];

  // Map icons by index as JSON no longer carries icon identifiers
  const ICONS: LucideIcon[] = [UserPlus, Search, Send, Briefcase];

  return (
    <section className="py-8 md:py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 md:mb-4"><Text>Cara Kerja KarirKita</Text></h2>
          <p className="text-sm md:text-base text-slate-600"><Text>Langkah mudah menuju karir impianmu</Text></p>
        </div>

        {/* Updated Grid: grid-cols-2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-0 transform -translate-y-1/2">
             {/* Animated Progress Line */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 to-transparent w-1/2 animate-[shimmer_2s_infinite]"></div>
          </div>
          
          {steps.map((step, idx) => {
            const Icon = ICONS[idx] || Briefcase; // Default fallback
            return (
              <div key={idx} className="group relative z-10 text-center flex flex-col items-center cursor-default">
                
                {/* Icon Container with Dynamic Animation */}
                <div className="w-14 h-14 md:w-24 md:h-24 mx-auto bg-white rounded-full border-4 border-blue-50 flex items-center justify-center mb-3 md:mb-6 shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-200 group-hover:shadow-xl group-hover:shadow-blue-200">
                  <Icon className="w-5 h-5 md:w-8 md:h-8 text-blue-600 transition-all duration-500 group-hover:text-white group-hover:rotate-6 group-hover:scale-110" />
                </div>
                
                {/* Text Content */}
                <h3 className="text-sm md:text-lg font-bold text-slate-900 mb-1 md:mb-2 transition-colors duration-300 group-hover:text-blue-600">
                  <Text>{step.judul}</Text>
                </h3>
                <p className="text-[10px] md:text-sm text-slate-600 px-1 md:px-4 transition-colors duration-300 group-hover:text-slate-800">
                  <Text>{step.deskripsi}</Text>
                </p>

                {/* Step Number Badge (Optional decoration) */}
                <div className="absolute top-0 right-1/4 -mt-2 -mr-2 w-6 h-6 bg-blue-100 rounded-full text-[10px] font-bold text-blue-600 flex items-center justify-center border-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Custom Keyframe for Shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
};
