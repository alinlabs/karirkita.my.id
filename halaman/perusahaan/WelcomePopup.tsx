import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '../../komponen/ui/Button';
import { Perusahaan } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomSheet } from '../../komponen/ui/MobileBottomSheet';

interface WelcomePopupProps {
    isOpen: boolean;
    onClose: () => void;
    company: Perusahaan;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose, company }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!isOpen) return null;

    const Content = () => (
        <>
            {company.ukuran_banner_url && (
                <div className="w-full relative bg-slate-200">
                    <img 
                        src={company.ukuran_banner_url} 
                        alt="Welcome" 
                        className="w-full object-cover"
                        style={{ aspectRatio: company.ukuran_banner_sambutan?.replace(':', '/') || '16/9' }}
                    />
                    {!isMobile && (
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full z-10 backdrop-blur-sm transition-all text-white">
                            <X className="w-5 h-5 shadow-sm" />
                        </button>
                    )}
                </div>
            )}
            
            <div className="p-6 md:p-8 text-center">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">Halo, Selamat Datang! 👋</h3>
                {company.teks_sambutan && (
                    <p className="text-slate-600 mb-6 leading-relaxed">
                        {company.teks_sambutan}
                    </p>
                )}
                
                {company.tombol_ajakan && company.link_ajakan && (
                    <Link to={company.link_ajakan} onClick={onClose}>
                        <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700">
                            {company.tombol_ajakan}
                        </Button>
                    </Link>
                )}
            </div>
        </>
    );

    if (isMobile) {
        return (
            <MobileBottomSheet isOpen={isOpen} onClose={onClose} contentClassName="p-0">
                <Content />
            </MobileBottomSheet>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
                {!company.ukuran_banner_url && (
                     <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full z-10 transition-all text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <Content />
            </div>
        </div>
    );
};
