import React, { useEffect, useState } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { CheckCircle2, Copy, Clock, ArrowRight, MessageCircle } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';

interface DetailPembayaranProps {
  paymentData: any;
  item: any;
  rekeningList: any[];
}

export const DetailPembayaran: React.FC<DetailPembayaranProps> = ({ paymentData, item, rekeningList }) => {
  const { toast, showToast } = useToast();
  const [timeLeft, setTimeLeft] = useState(3600 * 24); // 24 hours in seconds

  const selectedBank = rekeningList.find(r => r.bank === paymentData.metodePembayaran);
  const rawPrice = (item.harga || item.price || '0').toString().replace(/\D/g, '');
  const totalAmount = rawPrice ? parseInt(rawPrice) : 0;
  const finalAmount = totalAmount; // No unique code, fixed amount

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({ message: 'Disalin ke clipboard!', type: 'success' });
  };

  const handleConfirmWhatsapp = () => {
    showToast({ message: 'Terima Kasih! Mengalihkan ke WhatsApp...', type: 'success' });
    
    setTimeout(() => {
        const message = `Halo Admin KarirKita, saya sudah melakukan pembayaran.\n\nNama: ${paymentData.nama}\nItem: ${item.judul || item.title}\nNominal: Rp ${new Intl.NumberFormat('id-ID').format(finalAmount)}\nBank Tujuan: ${selectedBank?.bank}\n\nMohon segera diproses. Terima kasih.`;
        window.open(`https://wa.me/6281807000054?text=${encodeURIComponent(message)}`, '_blank');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Menunggu Pembayaran</h2>
        <p className="text-slate-600 mt-2">Selesaikan pembayaran dalam <span className="font-bold text-red-500">{formatTime(timeLeft)}</span></p>
      </div>

      <Card className="p-6 md:p-8 border-slate-200 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="text-center md:text-left">
                <p className="text-sm text-slate-500 mb-1">Total Pembayaran</p>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 flex items-center gap-2">
                    Rp {new Intl.NumberFormat('id-ID').format(finalAmount)}
                    <button onClick={() => handleCopy(finalAmount.toString())} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Copy className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>
            
            {selectedBank && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[200px]">
                    <p className="text-xs text-slate-500 mb-2">Bank Tujuan</p>
                    {selectedBank.logo ? (
                        <img src={selectedBank.logo} alt={selectedBank.bank} className="h-8 mx-auto mb-2 object-contain" />
                    ) : (
                        <div className="font-bold text-lg text-slate-800 mb-1">{selectedBank.bank}</div>
                    )}
                    <div className="font-mono font-bold text-lg text-slate-800 tracking-wider mb-1">{selectedBank.nomor}</div>
                    <p className="text-xs text-slate-500">a.n {selectedBank.atas_nama}</p>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="mt-2 w-full text-blue-600 hover:bg-blue-50 h-8 text-xs"
                        onClick={() => handleCopy(selectedBank.nomor)}
                    >
                        <Copy className="w-3 h-3 mr-1" /> Salin Nomor Rekening
                    </Button>
                </div>
            )}
        </div>

        <div className="space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">Cara Pembayaran</h3>
            
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Transfer ke Rekening Diatas</h4>
                        <p className="text-sm text-slate-600 mt-1">Lakukan transfer melalui ATM, Mobile Banking, atau Internet Banking ke nomor rekening yang tertera.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Pastikan Nominal Sesuai</h4>
                        <p className="text-sm text-slate-600 mt-1">Transfer dengan nominal tepat <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(finalAmount)}</span> agar verifikasi berjalan lancar.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">3</div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Konfirmasi Pembayaran</h4>
                        <p className="text-sm text-slate-600 mt-1">Setelah transfer berhasil, klik tombol konfirmasi di bawah ini untuk mengirim bukti ke WhatsApp admin.</p>
                    </div>
                </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
                <Button 
                    onClick={handleConfirmWhatsapp}
                    className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                >
                    <MessageCircle className="w-5 h-5 mr-2" /> Konfirmasi
                </Button>
                <p className="text-center text-xs text-slate-500 mt-4">
                    Butuh bantuan? <a href="/contact" className="text-blue-600 hover:underline">Hubungi Support</a>
                </p>
            </div>
        </div>
      </Card>
    </div>
  );
};
