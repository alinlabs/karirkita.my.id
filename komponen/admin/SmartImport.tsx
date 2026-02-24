import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, Loader2, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { analyzeCompanyImage, analyzeJobImage, fileToGenerativePart } from '../../services/aiService';
import { useToast } from '../../hooks/useToast';

interface SmartImportProps {
  type: 'company' | 'job';
  onAnalyze: (data: any) => void;
  className?: string;
}

export const SmartImport: React.FC<SmartImportProps> = ({ type, onAnalyze, className }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { showToast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64Data = await fileToGenerativePart(file);
      let result;

      if (type === 'company') {
        result = await analyzeCompanyImage(base64Data, prompt);
      } else {
        result = await analyzeJobImage(base64Data, prompt);
      }

      onAnalyze(result);
      showToast({ message: 'Analisis berhasil! Data telah diisi otomatis.', type: 'success' });
    } catch (error) {
      console.error("Analysis failed:", error);
      showToast({ message: 'Gagal menganalisis gambar. Silakan coba lagi.', type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={cn("bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900">AI Smart Import</h3>
          <p className="text-xs text-indigo-600">Upload poster/brosur untuk isi data otomatis</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dropzone */}
        <div>
          {!file ? (
            <div 
              {...getRootProps()} 
              className={cn(
                "border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/50 hover:bg-white/80",
                isDragActive ? "border-indigo-500 bg-indigo-50" : "border-indigo-200"
              )}
            >
              <input {...getInputProps()} />
              <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-indigo-900">Drag & Drop atau Klik</p>
              <p className="text-xs text-indigo-500 mt-1">Format: JPG, PNG, WEBP</p>
            </div>
          ) : (
            <div className="relative h-48 rounded-xl overflow-hidden border border-indigo-200 group bg-white">
              <img src={preview!} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Prompt Input */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Instruksi Tambahan (Opsional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Ambil info gaji jika ada, abaikan tanggal kadaluarsa..."
            className="flex-1 w-full rounded-xl border-indigo-200 bg-white/80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm p-3 resize-none mb-4"
          />
          
          <Button 
            onClick={handleAnalyze} 
            disabled={!file || isAnalyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menganalisis...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" /> Analisis & Isi Data
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
