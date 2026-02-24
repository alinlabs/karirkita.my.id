
import React, { useEffect, useState } from 'react';
import { Heart, Mail, MapPin, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { routingData } from '../../services/routingData';
import { Text } from '../ui/Text';
import { Identitas } from '../../types';
import { SocialIcon } from '../ui/SocialIcon';

// Helper Components
const SocialLink = ({ name, href }: { name: string, href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-slate-400">
    <SocialIcon name={name} className="w-5 h-5" />
  </a>
);

const FooterLink = ({ to, children }: { to: string, children?: any }) => (
  <li>
    <Link to={to} className="text-slate-400 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
      <Text>{children}</Text>
    </Link>
  </li>
);

export const Footer = () => {
  const [identity, setIdentity] = useState<Partial<Identitas>>({
    nama: 'KarirKita',
    deskripsi: 'Platform karir modern.',
    logoUrl: 'https://raw.githubusercontent.com/alinlabs/karirkita.my.id/refs/heads/main/public/logo/logo.png',
    kontak: {
      alamat: 'Purwakarta, Jawa Barat',
      email: 'hrd@karirkita.my.id',
      telepon: ''
    },
    sosialMedia: {
      linkedin: '',
      instagram: '',
      twitter: '',
      facebook: ''
    },
    hakCipta: 'KarirKita Indonesia'
  });

  useEffect(() => {
    routingData.getIdentity()
      .then(data => {
         // Override if fetch successful, otherwise keep default
         if (data) setIdentity(prev => ({...prev, ...data}));
      })
      .catch(err => console.error("Failed to fetch identity for footer", err));
  }, []);

  return (
    <footer className="hidden md:block bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: 2 Columns on Mobile, 4/5 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Section - Full width on mobile (col-span-2) */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
               {/* Use Single Logo (Icon) */}
               <img 
                 src={identity.logoUrl} 
                 alt={identity.nama} 
                 className="h-9 w-9 object-contain rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" 
               />
               <span className="text-xl font-bold text-white tracking-tight">{identity.nama}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              <Text>{identity.deskripsi || ''}</Text>
            </p>
            
            <div className="space-y-4 mb-6">
               {identity.kontak?.alamat && (
                   <div className="flex items-start gap-3 text-sm text-slate-400">
                      <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{identity.kontak.alamat}</span>
                   </div>
               )}
               {identity.kontak?.email && (
                   <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                      <span>{identity.kontak.email}</span>
                   </div>
               )}
            </div>

            <div className="flex gap-3">
              {identity.sosialMedia?.linkedin && <SocialLink name="linkedin" href={identity.sosialMedia.linkedin} />}
              {identity.sosialMedia?.instagram && <SocialLink name="instagram" href={identity.sosialMedia.instagram} />}
              {identity.sosialMedia?.twitter && <SocialLink name="twitter" href={identity.sosialMedia.twitter} />}
              {identity.sosialMedia?.facebook && <SocialLink name="facebook" href={identity.sosialMedia.facebook} />}
            </div>
          </div>
          
          {/* Platform Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider"><Text>Platform</Text></h3>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/pekerjaan">Cari Lowongan</FooterLink>
              <FooterLink to="/pelamar">Cari Talent</FooterLink>
              <FooterLink to="/perusahaan">Daftar Perusahaan</FooterLink>
              <FooterLink to="/login">Masuk Akun</FooterLink>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider"><Text>Dukungan</Text></h3>
            <ul className="space-y-4 text-sm">
              <FooterLink to="/faq">Pusat Bantuan</FooterLink>
              <FooterLink to="/privacy">Kebijakan Privasi</FooterLink>
              <FooterLink to="/terms">Syarat & Ketentuan</FooterLink>
              <FooterLink to="/contact">Hubungi Kami</FooterLink>
            </ul>
          </div>

          {/* Extra / Callout */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mt-4 lg:mt-0">
             <div className="mb-6">
                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider"><Text>Promosi</Text></h3>
                <Link to="/penawaran" className="group flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-600 hover:bg-slate-800 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Pasang Iklan</div>
                        <div className="text-[10px] text-slate-500">Mulai Rp 150rb</div>
                    </div>
                </Link>
             </div>

             <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-white font-bold mb-2 text-sm"><Text>Newsletter</Text></h3>
                <p className="text-xs text-slate-400 leading-relaxed"><Text>Dapatkan info loker Purwakarta terbaru langsung di inbox Anda.</Text></p>
             </div>
          </div>

        </div>
        
        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {identity.hakCipta}. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span><Text>Dibuat dengan</Text></span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span><Text>di Purwakarta</Text></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
