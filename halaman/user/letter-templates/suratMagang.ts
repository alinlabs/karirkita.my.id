
import { LetterData, GeneratedLetter } from './types';

export const generateMagang = (data: LetterData): GeneratedLetter => {
    return {
        opening: `Dengan hormat,\n\nSaya yang bertanda tangan di bawah ini bermaksud untuk mengajukan permohonan kerja praktik / magang (internship) di ${data.companyName || '[Nama Perusahaan]'} untuk posisi ${data.positionApplied || '[Posisi]'}.\n\nBerikut adalah data diri singkat saya:`,
        showBiodata: true,
        body: `Saya memiliki ketertarikan besar di bidang tersebut dan memiliki kemampuan dasar berupa ${data.skills || '[Skill Utama]'}. Saya ingin belajar, berkembang, dan berkontribusi langsung dalam lingkungan kerja profesional di perusahaan Bapak/Ibu sebagai bentuk implementasi ilmu yang telah saya pelajari.`,
        closing: `Besar harapan saya agar permohonan ini dapat dipertimbangkan dan saya dapat bergabung dalam program magang di perusahaan Bapak/Ibu.\n\nDemikian surat permohonan ini saya sampaikan. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.`
    };
};
