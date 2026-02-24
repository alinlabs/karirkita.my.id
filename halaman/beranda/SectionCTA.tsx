
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../komponen/ui/Button';
import { Text } from '../../komponen/ui/Text';

export const SectionCTA = () => {
  return (
    <section className="py-12 md:py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6"><Text>Siap Memulai Karir Barumu?</Text></h2>
        <p className="text-slate-400 text-sm md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto">
          <Text>Bergabung dengan ribuan profesional lainnya yang telah menemukan karir impian mereka melalui KarirKita.</Text>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link to="/register">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto h-12"><Text>Buat Akun Gratis</Text></Button>
          </Link>
          <Link to="/pekerjaan">
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 w-full sm:w-auto h-12"><Text>Cari Pekerjaan</Text></Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
