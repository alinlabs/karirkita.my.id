import { GoogleGenAI } from "@google/genai";

// Helper to convert File to Base64 (returns raw base64 string without data URI prefix)
export const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Initialize the client
// Note: In a real production app, this should be proxied through a backend to hide the key.
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const analyzeJobImage = async (base64Data: string, prompt: string = "") => {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const systemPrompt = `Analyze the image (job poster) and extract the following information in JSON format:
    - posisi (Job Title)
    - perusahaan (Company Name - string)
    - lokasi (Location)
    - tipe_pekerjaan (Full Time, Part Time, Contract, Internship)
    - deskripsi_pekerjaan (Summary of the job description)
    - kualifikasi (Array of strings for requirements)
    - fasilitas (Array of strings for benefits)
    - rentang_gaji (Salary range if available)
    
    If the user provided a specific prompt, use it to guide the extraction.
    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-latest",
            contents: {
                role: 'user',
                parts: [
                    { text: systemPrompt + "\n" + (prompt ? `Additional Instruction: ${prompt}` : "") },
                    { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
                ]
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error analyzing job image:", error);
        throw error;
    }
};

export const analyzeCompanyImage = async (base64Data: string, prompt: string = "") => {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const systemPrompt = `Analyze the image (company profile/logo/banner) and extract the following information in JSON format:
    - nama (Company Name)
    - industri (Industry)
    - deskripsi (Company Description)
    - alamat (Address/Location)
    - website_url (Website URL)
    - email_kontak (Contact Email)
    - telepon (Contact Phone)
    - lokasi (City/Location)
    
    If the user provided a specific prompt, use it to guide the extraction.
    Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-latest",
            contents: {
                role: 'user',
                parts: [
                    { text: systemPrompt + "\n" + (prompt ? `Additional Instruction: ${prompt}` : "") },
                    { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
                ]
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error analyzing company image:", error);
        throw error;
    }
};
