import React from 'react';
import { Card } from '../../komponen/ui/Card';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

interface RingkasanPembayaranProps {
  item: any;
  type: string;
}

export const RingkasanPembayaran: React.FC<RingkasanPembayaranProps> = ({ item, type }) => {
  const formatPrice = (price: string) => {
    if (!price) return 'Gratis';
    const num = parseInt(price.replace(/\D/g, ''));
    if (isNaN(num)) return price;
    return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
  };

  const price = item.harga || item.price || '0';
  const formattedPrice = formatPrice(price);
  const adminFee = 0;
  const total = parseInt(price.replace(/\D/g, '')) + adminFee;

  return (
    <div className="space-y-6">
      <Card className="p-6 border-slate-200 shadow-md sticky top-24">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-600" /> Ringkasan Pesanan
        </h3>
        
        <div className="flex gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0">
            <img 
              src={item.gambar || item.image || 'https://placehold.co/100'} 
              alt={item.judul || item.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase mb-1">{type}</div>
            <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{item.judul || item.title || item.nama}</h4>
            {item.mentor && <p className="text-xs text-slate-500 mt-1">Mentor: {item.mentor}</p>}
          </div>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between text-slate-600">
            <span>Harga Item</span>
            <span>{formattedPrice}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Biaya Admin</span>
            <span>Rp {adminFee}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 pt-3 border-t border-slate-100 text-lg">
            <span>Total Bayar</span>
            <span className="text-blue-600">Rp {new Intl.NumberFormat('id-ID').format(total)}</span>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg flex items-start gap-2 text-xs text-green-700 border border-green-100">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <p>Pembayaran aman & terverifikasi. Akses akan diberikan setelah konfirmasi.</p>
        </div>
      </Card>
    </div>
  );
};
