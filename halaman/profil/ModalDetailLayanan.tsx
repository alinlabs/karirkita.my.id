import React from 'react';
import { X } from 'lucide-react';
import { Layanan } from '../../types';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MobileBottomSheet } from '../../komponen/ui/MobileBottomSheet';

interface ModalDetailLayananProps {
    service: Layanan;
    onClose: () => void;
}

export const ModalDetailLayanan: React.FC<ModalDetailLayananProps> = ({ service, onClose }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const Content = () => (
        <div className="p-6 md:p-8 flex-1">
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-slate-900 leading-tight pr-8">{service.judul}</h2>
                {!isMobile && (
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                )}
            </div>
            <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{service.deskripsi}</p>
        </div>
    );

    if (isMobile) {
        return (
            <MobileBottomSheet isOpen={true} onClose={onClose} contentClassName="p-0">
                <Content />
            </MobileBottomSheet>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4" onClick={onClose}>
            <div 
                className="bg-white w-full max-w-4xl max-h-[95vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-10 zoom-in-95 duration-300" 
                onClick={(e) => e.stopPropagation()}
            >
                <Content />
            </div>
        </div>
    );
};
