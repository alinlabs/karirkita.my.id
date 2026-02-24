import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../komponen/ui/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative w-20 h-20 md:w-28 md:h-28 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center rotate-12 transition-transform hover:rotate-0 duration-500">
            <FileQuestion className="w-10 h-10 md:w-14 md:h-14 text-blue-600" />
          </div>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Halaman Hilang</h1>
      <p className="text-slate-500 mb-8 max-w-xs md:max-w-md text-sm md:text-base leading-relaxed">
        Maaf, halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
      </p>
      
      <Link to="/">
        <Button size="lg" className="rounded-xl shadow-lg shadow-blue-600/20 h-12 px-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Button>
      </Link>
    </div>
  );
};