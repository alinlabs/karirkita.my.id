
import React, { useState, useEffect } from 'react';
import { Card } from '../../../komponen/ui/Card';
import { Button } from '../../../komponen/ui/Button';
import { Combobox } from '../../../komponen/ui/Combobox';
import { SkillItem } from '../../../types';
import { Trash2, Plus, Code2, MessageCircle, Languages, Star, Percent, Tag } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { routingData } from '../../../services/routingData';

interface KeahlianProps {
    skills: SkillItem[];
    setSkills: (data: SkillItem[]) => void;
}

export const KeahlianCV: React.FC<KeahlianProps> = ({ skills = [], setSkills }) => {
    const [activeTab, setActiveTab] = useState<'hard_skill' | 'soft_skill' | 'language'>('hard_skill');
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState(50); 
    const [displayMode, setDisplayMode] = useState<'percent' | 'label'>('percent');
    
    // Options state for Combobox
    const [skillOptions, setSkillOptions] = useState<{label: string, value: string, image?: string}[]>([]);

    useEffect(() => {
        if (activeTab === 'language') {
            // Load Languages from Master Options
            routingData.getMasterOptions().then(data => {
                if(data.bahasa) {
                    const opts = data.bahasa.map((l:any) => ({
                        label: l.label,
                        value: l.nilai, // Using 'nilai' from JSON
                        image: `https://flagcdn.com/w40/${l.kode}.png`
                    }));
                    setSkillOptions(opts);
                }
            });
        } else {
            // Load Hard/Soft Skills from JSON
            routingData.getSkills().then(data => {
                const categoryKey = activeTab === 'hard_skill' ? 'hard_skills' : 'soft_skills';
                const opts: {label: string, value: string, image?: string}[] = [];
                
                const traverse = (obj: any) => {
                    if (Array.isArray(obj)) {
                        obj.forEach((item: any) => {
                            if (item.keahlian) {
                                opts.push({ label: item.keahlian, value: item.keahlian, image: item.gambar });
                            }
                        });
                    } else if (typeof obj === 'object') {
                        if (obj.keahlian) {
                            opts.push({ label: obj.keahlian, value: obj.keahlian, image: obj.gambar });
                        }
                        Object.values(obj).forEach(val => traverse(val));
                    }
                };

                if (data[categoryKey]) {
                    traverse(data[categoryKey]);
                }
                
                // Sort alphabetically
                setSkillOptions(opts.sort((a, b) => a.label.localeCompare(b.label)));
            });
        }
    }, [activeTab]);

    // Helper to get category label
    const getCategoryLabel = (cat: string) => {
        switch(cat) {
            case 'hard_skill': return 'Hard Skills';
            case 'soft_skill': return 'Soft Skills';
            case 'language': return 'Bahasa';
            default: return '';
        }
    };

    // Helper to interpret percentage to text
    const getLevelLabel = (level: number) => {
        if (level <= 20) return 'Pemula (Beginner)';
        if (level <= 40) return 'Dasar (Elementary)';
        if (level <= 60) return 'Menengah (Intermediate)';
        if (level <= 80) return 'Lanjutan (Advanced)';
        return 'Sangat Mahir (Expert/Native)';
    };

    const handleAddSkill = () => {
        if (!newSkillName.trim()) return;
        
        // Find if selected skill has an image in our options
        const selectedOpt = skillOptions.find(opt => opt.value === newSkillName);

        const newSkill: SkillItem = {
            name: newSkillName,
            level: newSkillLevel,
            category: activeTab,
            displayMode: displayMode,
            // Store image URL specifically for languages or if needed to persist
            image: activeTab === 'language' ? selectedOpt?.image : undefined 
        };

        setSkills([...skills, newSkill]);
        setNewSkillName('');
        setNewSkillLevel(50);
    };

    const removeSkill = (index: number) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    // Filter skills for display based on active tab
    const filteredSkills = skills.filter(s => s.category === activeTab);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <Card className="p-6 md:p-8 rounded-[2rem] border-none shadow-xl shadow-slate-200/40">
                <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <h2 className="text-xl font-bold text-slate-900">Keahlian & Kompetensi</h2>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'hard_skill', label: 'Hard Skills', icon: Code2 },
                        { id: 'soft_skill', label: 'Soft Skills', icon: MessageCircle },
                        { id: 'language', label: 'Bahasa', icon: Languages },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                setNewSkillName(''); // Reset input on tab change
                            }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                                activeTab === tab.id 
                                    ? "bg-white text-blue-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                    <h4 className="text-sm font-bold text-slate-700 mb-4">Tambah {getCategoryLabel(activeTab)} Baru</h4>
                    
                    <div className="grid md:grid-cols-12 gap-6 items-end">
                        
                        {/* 1. Skill Name Input (Combobox) */}
                        <div className="md:col-span-12">
                            <Combobox 
                                label={activeTab === 'language' ? "Pilih Bahasa" : "Cari / Tulis Keahlian"}
                                placeholder={activeTab === 'language' ? "Contoh: English" : "Contoh: React.js, Public Speaking..."}
                                value={newSkillName}
                                onChange={setNewSkillName}
                                options={skillOptions}
                                className="bg-transparent" // Transparent Background as requested
                            />
                        </div>

                        {/* 2. Level Slider with Dynamic Value */}
                        <div className="md:col-span-7 space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">Tingkat Penguasaan</label>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                    {getLevelLabel(newSkillLevel)}
                                </span>
                            </div>
                            
                            <div className="relative pt-2">
                                {/* Dynamic Percentage Bubble */}
                                <div 
                                    className="absolute -top-3 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm transition-all"
                                    style={{ left: `${newSkillLevel}%` }}
                                >
                                    {newSkillLevel}%
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-800"></div>
                                </div>

                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    step="5"
                                    value={newSkillLevel} 
                                    onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                />
                            </div>
                            
                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                <span>Pemula</span>
                                <span>Native / Expert</span>
                            </div>
                        </div>

                        {/* 3. Display Mode Toggle */}
                        <div className="md:col-span-5 space-y-2">
                            <label className="block text-sm font-bold text-slate-700">Tampilkan Sebagai</label>
                            <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
                                <button
                                    onClick={() => setDisplayMode('percent')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                                        displayMode === 'percent' ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <Percent className="w-3.5 h-3.5" /> Angka
                                </button>
                                <button
                                    onClick={() => setDisplayMode('label')}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all",
                                        displayMode === 'label' ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <Tag className="w-3.5 h-3.5" /> Label
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-12 pt-2">
                            <Button onClick={handleAddSkill} disabled={!newSkillName} className="w-full h-12 rounded-xl font-bold gap-2">
                                <Plus className="w-5 h-5" /> Tambahkan ke Daftar
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Skill List */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        Daftar {getCategoryLabel(activeTab)} Anda
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{filteredSkills.length}</span>
                    </h4>
                    
                    {filteredSkills.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                            <p className="text-slate-400 text-sm font-medium">Belum ada data untuk kategori ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {skills.map((skill, idx) => {
                                if (skill.category !== activeTab) return null;
                                
                                // Attempt to find image in options if not explicitly stored
                                const opt = skillOptions.find(o => o.value === skill.name);
                                const imageSrc = skill.image || opt?.image;

                                return (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-blue-300 transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                {imageSrc ? (
                                                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0">
                                                        <img src={imageSrc} alt={skill.name} className="w-full h-full object-contain" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                                        {skill.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <h5 className="font-bold text-slate-800 truncate">{skill.name}</h5>
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                                                        {skill.displayMode === 'percent' ? 'Format Angka' : 'Format Label'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => removeSkill(idx)} 
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                                            {skill.displayMode === 'percent' ? (
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-slate-600">Penguasaan</span>
                                                        <span className="text-blue-600">{skill.level}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                                                            style={{ width: `${skill.level}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-slate-500">Tingkat</span>
                                                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-lg">
                                                        {getLevelLabel(skill.level)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </Card>
        </div>
    );
};
