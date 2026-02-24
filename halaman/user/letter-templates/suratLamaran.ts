
import { LetterData, GeneratedLetter } from './types';

export const generateLamaran = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Dengan hormat,\n\nBerdasarkan informasi yang saya peroleh, saya bermaksud untuk melamar pekerjaan sebagai ${data.positionApplied || '[Posisi]'} di ${data.companyName || '[Nama Perusahaan]'}.\n\nAdapun data diri saya adalah sebagai berikut:`,
        showBiodata: true,
        body: `Saya memiliki pengalaman di bidang ${data.experience || '[Bidang Pengalaman]'} dan menguasai keahlian seperti ${data.skills || '[Skill Utama]'}. Saya adalah pribadi yang disiplin, pekerja keras, dan mampu bekerja dalam tim maupun individu. Saya sangat antusias untuk dapat berkontribusi bagi perusahaan Bapak/Ibu.`,
        closing: `Besar harapan saya untuk dapat diberikan kesempatan wawancara guna menjelaskan potensi diri saya lebih lanjut.\n\nDemikian surat lamaran ini saya buat. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.`
    };
};
