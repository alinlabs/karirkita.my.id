import React from 'react';
import { Button } from '../../komponen/ui/Button';
import { ServerCrash, RefreshCw } from 'lucide-react';

export const ServerError = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative w-20 h-20 md:w-28 md:h-28 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center -rotate-6 transition-transform hover:rotate-0 duration-500">
            <ServerCrash className="w-10 h-10 md:w-14 md:h-14 text-red-500" />
          </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">500 - Server Error</h1>
      <p className="text-slate-500 mb-8 max-w-xs md:max-w-md text-sm md:text-base leading-relaxed">
        Oops! Terjadi kesalahan pada sistem kami. Tim teknis kami sedang bekerja untuk memperbaikinya.
      </p>
      
      <Button onClick={() => window.location.reload()} className="rounded-xl shadow-lg h-12 px-8 bg-slate-900 hover:bg-slate-800">
        <RefreshCw className="w-4 h-4 mr-2" /> Coba Lagi
      </Button>
    </div>
  );
};