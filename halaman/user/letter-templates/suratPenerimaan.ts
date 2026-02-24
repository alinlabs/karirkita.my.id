
import { LetterData, GeneratedLetter } from './types';

export const generatePenerimaan = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Selamat!\n\nBerdasarkan hasil seleksi wawancara dan tes yang telah Saudara/i jalani, dengan ini kami dari ${data.companyName || '[Nama Perusahaan]'} dengan senang hati memberitahukan bahwa Saudara/i DITERIMA untuk bergabung bersama kami.`,
        showBiodata: false,
        body: `Saudara/i akan menempati posisi sebagai ${data.positionApplied || '[Posisi]'} dan diharapkan dapat mulai bekerja (First Day) pada:\n\nTanggal Mulai : ${data.startDate || '[Tanggal Mulai]'}\nLokasi : ${data.companyAddress || '[Alamat Kantor]'}\n\nHarap mempersiapkan dokumen administrasi seperti KTP, NPWP, dan Ijazah asli untuk verifikasi pada hari pertama.`,
        closing: `Kami sangat antusias menyambut Saudara/i sebagai bagian dari tim ${data.companyName || 'kami'}. Semoga kita dapat bekerja sama dengan baik dan memberikan kontribusi positif.\n\nSelamat bergabung!`
    };
};
