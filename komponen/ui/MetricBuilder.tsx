
import React from 'react';
import { MetrikProyek } from '../../types';
import { Input } from './Input';
import { Button } from './Button';
import { Combobox } from './Combobox';
import { Plus, X, BarChart3, PieChart, List, Table } from 'lucide-react';

interface MetricBuilderProps {
    metrics: MetrikProyek[];
    onChange: (m: MetrikProyek[]) => void;
}

export const MetricBuilder: React.FC<MetricBuilderProps> = ({ metrics, onChange }) => {
    const addMetric = () => {
        onChange([...metrics, { tipe: 'list', judul: '', data: [{ label: '', nilai: '' }] }]);
    };

    const removeMetric = (index: number) => {
        onChange(metrics.filter((_, i) => i !== index));
    };

    const updateMetric = (index: number, field: string, value: any) => {
        const newMetrics = [...metrics];
        (newMetrics[index] as any)[field] = value;
        
        // Reset data structure if type changes
        if (field === 'tipe') {
            if (value === 'bar') newMetrics[index].data = [{ label: 'Sebelum', nilai: 0 }, { label: 'Sesudah', nilai: 0 }];
            if (value === 'circle') newMetrics[index].data = [{ label: 'Pencapaian', nilai: 0, deskripsi: '' }];
            if (value === 'table' || value === 'list') newMetrics[index].data = [{ label: '', nilai: '' }];
        }
        onChange(newMetrics);
    };

    const updateMetricData = (mIndex: number, dIndex: number, field: string, value: any) => {
        const newMetrics = [...metrics];
        (newMetrics[mIndex].data[dIndex] as any)[field] = value;
        onChange(newMetrics);
    };

    const addListData = (mIndex: number) => {
        const newMetrics = [...metrics];
        newMetrics[mIndex].data.push({ label: '', nilai: '' });
        onChange(newMetrics);
    };

    const removeListData = (mIndex: number, dIndex: number) => {
        const newMetrics = [...metrics];
        newMetrics[mIndex].data = newMetrics[mIndex].data.filter((_, i) => i !== dIndex);
        onChange(newMetrics);
    };

    const typeOptions = [
        { value: 'list', label: 'List Bullet (Daftar)' },
        { value: 'circle', label: 'Meteran (Circle Chart)' },
        { value: 'bar', label: 'Perbandingan (Bar Chart)' }
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-700">Visualisasi Pencapaian</label>
                <Button variant="ghost" size="sm" onClick={addMetric} className="text-blue-600 hover:bg-blue-50 h-8">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Metrik
                </Button>
            </div>
            
            {metrics.map((metric, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative animate-in fade-in zoom-in-95 duration-200 group">
                    <button 
                        onClick={() => removeMetric(idx)} 
                        className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input 
                            label="Judul Metrik" 
                            placeholder="Contoh: Kenaikan Sales" 
                            value={metric.judul} 
                            onChange={(e) => updateMetric(idx, 'judul', e.target.value)} 
                        />
                        <Combobox 
                            label="Tipe Visual"
                            options={typeOptions}
                            value={metric.tipe}
                            onChange={(val) => updateMetric(idx, 'tipe', val)}
                            placeholder="Pilih Tipe Visual"
                        />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        {metric.tipe === 'circle' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Label Data" value={metric.data[0].label} onChange={(e) => updateMetricData(idx, 0, 'label', e.target.value)} placeholder="Mis: Kepuasan" />
                                
                                {/* Value Slider for Circle */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-bold text-slate-700">Nilai (Persen)</label>
                                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 rounded">{metric.data[0].nilai}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" step="1"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        value={metric.data[0].nilai} 
                                        onChange={(e) => updateMetricData(idx, 0, 'nilai', parseInt(e.target.value))} 
                                    />
                                </div>

                                <Input label="Keterangan Tambahan" className="md:col-span-2" value={metric.data[0].deskripsi} onChange={(e) => updateMetricData(idx, 0, 'deskripsi', e.target.value)} placeholder="Mis: Meningkat 20% dari tahun lalu" />
                            </div>
                        )}
                        
                        {metric.tipe === 'bar' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <Input label="Label A (Kiri)" value={metric.data[0]?.label} onChange={(e) => updateMetricData(idx, 0, 'label', e.target.value)} placeholder="Sebelum" />
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-bold text-slate-700">Nilai A</label>
                                            <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 rounded">{metric.data[0]?.nilai}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" step="1"
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
                                            value={metric.data[0]?.nilai} 
                                            onChange={(e) => updateMetricData(idx, 0, 'nilai', parseInt(e.target.value))} 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    <Input label="Label B (Kanan)" value={metric.data[1]?.label} onChange={(e) => updateMetricData(idx, 1, 'label', e.target.value)} placeholder="Sesudah" />
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-bold text-slate-700">Nilai B</label>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 rounded">{metric.data[1]?.nilai}</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="100" step="1"
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            value={metric.data[1]?.nilai} 
                                            onChange={(e) => updateMetricData(idx, 1, 'nilai', parseInt(e.target.value))} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {metric.tipe === 'list' && (
                            <div className="space-y-3">
                                {metric.data.map((d, dIdx) => (
                                    <div key={dIdx} className="flex gap-3 items-start">
                                        <div className="mt-4 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></div>
                                        <Input 
                                            className="flex-1" 
                                            placeholder="Poin pencapaian..." 
                                            value={d.label} 
                                            onChange={(e) => updateMetricData(idx, dIdx, 'label', e.target.value)} 
                                        />
                                        <Input 
                                            className="w-24 shrink-0" 
                                            placeholder="Nilai" 
                                            value={d.nilai} 
                                            onChange={(e) => updateMetricData(idx, dIdx, 'nilai', e.target.value)} 
                                        />
                                        <button onClick={() => removeListData(idx, dIdx)} className="mt-3 p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                            <X className="w-4 h-4"/>
                                        </button>
                                    </div>
                                ))}
                                <Button variant="ghost" size="sm" onClick={() => addListData(idx)} className="text-blue-600 font-bold">
                                    + Tambah Baris
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            
            {metrics.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <p className="text-slate-500 text-sm mb-3">Belum ada visualisasi data.</p>
                    <Button variant="outline" onClick={addMetric}>Buat Visualisasi</Button>
                </div>
            )}
        </div>
    );
};
