
import { LetterData, GeneratedLetter } from './types';

export const generatePanggilan = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Dengan hormat,\n\nSehubungan dengan lamaran pekerjaan yang telah Saudara/i kirimkan ke ${data.companyName || '[Nama Perusahaan]'} untuk posisi ${data.positionApplied || '[Posisi]'}, kami bermaksud mengundang Saudara/i untuk mengikuti tahapan seleksi wawancara (interview).`,
        showBiodata: false,
        body: `Adapun jadwal wawancara tersebut akan dilaksanakan pada:\n\nHari, Tanggal : ${data.interviewDate || '[Hari, Tanggal]'}\nWaktu : ${data.interviewTime || '[Jam]'}\nLokasi/Link : ${data.interviewLocation || '[Alamat Kantor / Link Zoom]'}\nBertemu : ${data.contactPerson || '[Nama Pewawancara]'}\n\nMohon untuk membawa CV terbaru dan alat tulis (jika offline) atau bersiap 10 menit sebelum jadwal (jika online).`,
        closing: `Mohon konfirmasikan kehadiran Saudara/i melalui balasan email atau pesan ini sebelum jadwal yang ditentukan.\n\nDemikian surat undangan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.`
    };
};
