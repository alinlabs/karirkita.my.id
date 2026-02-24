
import { LetterData, GeneratedLetter } from './types';

export const generatePenawaran = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Dengan hormat,\n\nKami dari ${data.companyName || '[Nama Perusahaan]'} sangat terkesan dengan kualifikasi dan pengalaman Saudara/i. Oleh karena itu, kami ingin menawarkan kesempatan karir sebagai ${data.positionApplied || '[Posisi]'} di perusahaan kami.`,
        showBiodata: false,
        body: `Berikut adalah ringkasan penawaran kerja (Offering) yang kami ajukan:\n\nGaji Pokok : ${data.salaryOffer || 'Rp ...'}\nMasa Percobaan : ${data.probationPeriod || '3 Bulan'}\nFasilitas/Benefit : ${data.benefit || 'BPJS, Tunjangan Makan, Transport'}\nTanggal Mulai : ${data.startDate || '[Tanggal]'}\n\nDetail lengkap mengenai hak dan kewajiban akan tertuang dalam Perjanjian Kerja yang akan ditandatangani pada hari pertama.`,
        closing: `Penawaran ini berlaku hingga ${data.deadlineResponse || '[Tanggal Batas]'}. Mohon konfirmasikan penerimaan tawaran ini dengan menandatangani surat ini atau membalas email konfirmasi.\n\nKami berharap dapat segera bekerja sama dengan Saudara/i.`
    };
};
