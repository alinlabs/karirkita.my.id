
import { LetterData, GeneratedLetter } from './types';

export const generateResign = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Dengan hormat,\n\nMelalui surat ini, saya bermaksud untuk mengajukan permohonan pengunduran diri dari posisi saya di ${data.companyName || '[Nama Perusahaan]'}, efektif terhitung mulai tanggal ${data.resignationDate || '[Tanggal Terakhir]'}.`,
        showBiodata: false,
        body: `Keputusan ini saya ambil karena ${data.reason || 'alasan pribadi untuk pengembangan karir selanjutnya'}.\n\nSaya ingin mengucapkan terima kasih yang sebesar-besarnya atas kesempatan, bimbingan, dan dukungan yang telah diberikan selama saya bekerja di sini. Saya mendapatkan banyak pengalaman berharga yang akan sangat berguna bagi karir saya ke depan. Saya akan menyelesaikan seluruh tanggung jawab saya sebelum tanggal efektif pengunduran diri dan membantu proses transisi sebaik mungkin.`,
        closing: `Mohon maaf apabila terdapat kesalahan yang saya lakukan selama bekerja. Semoga ${data.companyName || 'perusahaan'} semakin sukses dan berkembang di masa depan.\n\nDemikian surat pengunduran diri ini saya buat. Terima kasih.`
    };
};
