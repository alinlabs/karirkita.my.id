
export interface LetterData {
    // Basic Info
    recipientName: string;
    recipientPosition: string; // Bisa jabatan HRD (Pencari Kerja) atau "Calon Karyawan" (Perusahaan)
    companyName: string;
    companyAddress: string;
    
    // Pencari Kerja Specific
    positionApplied?: string;
    resignationDate?: string;
    reason?: string;
    skills?: string;
    experience?: string;

    // Perusahaan Specific (New)
    interviewDate?: string;
    interviewTime?: string;
    interviewLocation?: string;
    contactPerson?: string;
    startDate?: string;     // Tanggal Mulai Kerja
    salaryOffer?: string;   // Penawaran Gaji
    benefit?: string;       // Benefit tambahan
    probationPeriod?: string; // Masa percobaan
    deadlineResponse?: string; // Batas waktu konfirmasi
}

export interface GeneratedLetter {
    opening: string; // Salam pembuka & paragraf 1
    showBiodata: boolean;
    body: string; // Paragraf inti (promosi diri / alasan)
    closing: string; // Paragraf penutup (Demikian...)
}
