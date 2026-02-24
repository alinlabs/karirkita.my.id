import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormPembayaran } from './FormPembayaran';
import { RingkasanPembayaran } from './RingkasanPembayaran';
import { DetailPembayaran } from './DetailPembayaran';
import { SEO } from '../../komponen/umum/SEO';
import { routingData } from '../../services/routingData';

export const Container = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'detail'>('form');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [rekeningList, setRekeningList] = useState<any[]>([]);

  // Data item yang dibeli (dari state navigasi)
  const item = location.state?.item;
  const type = location.state?.type; // 'kelas' | 'promosi' | 'layanan'

  useEffect(() => {
    if (!item) {
      navigate('/'); // Redirect jika tidak ada data item
      return;
    }

    // Fetch rekening data from KV (karirkita key)
    routingData.getIdentity().then((data: any) => {
      if (data && data.rekening) {
        setRekeningList(data.rekening);
      }
    });
  }, [item, navigate]);

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
    setStep('detail');
    window.scrollTo(0, 0);
  };

  if (!item) return null;

  return (
    <>
      <SEO title="Pembayaran - KarirKita" description="Selesaikan pembayaran Anda di KarirKita." />
      <div className="min-h-screen bg-slate-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">Pembayaran</h1>
            <p className="text-slate-600 mt-2">Selesaikan transaksi Anda untuk memulai.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {step === 'form' ? (
              <>
                <div className="lg:col-span-2">
                  <FormPembayaran 
                    onSubmit={handlePaymentSubmit} 
                    rekeningList={rekeningList} 
                  />
                </div>
                <div className="lg:col-span-1">
                  <RingkasanPembayaran item={item} type={type} />
                </div>
              </>
            ) : (
              <div className="lg:col-span-3">
                <DetailPembayaran 
                  paymentData={paymentData} 
                  item={item} 
                  rekeningList={rekeningList} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
