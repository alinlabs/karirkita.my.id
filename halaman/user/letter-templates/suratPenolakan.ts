
import { LetterData, GeneratedLetter } from './types';

export const generatePenolakan = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Dengan hormat,\n\nTerima kasih banyak atas tawaran kerja untuk posisi ${data.positionApplied || '[Posisi]'} di ${data.companyName || '[Nama Perusahaan]'}. Saya sangat menghargai waktu dan kesempatan yang telah Bapak/Ibu berikan kepada saya selama proses rekrutmen berlangsung.`,
        showBiodata: false,
        body: `Setelah mempertimbangkan dengan matang, saya mohon maaf harus menyampaikan bahwa saya belum dapat menerima tawaran tersebut saat ini. Keputusan ini dikarenakan ${data.reason || 'saya telah menerima tawaran lain yang lebih sesuai dengan tujuan karir saya saat ini'}.`,
        closing: `Saya berharap kita dapat menjalin hubungan profesional di masa depan. Sukses selalu untuk Bapak/Ibu dan seluruh tim ${data.companyName || 'perusahaan'}.\n\nDemikian surat ini saya sampaikan. Terima kasih.`
    };
};
