
import React, { useEffect, useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { routingData } from '../../services/routingData';
import { SkillItem } from '../../types'; 
import { cn } from '../../utils/cn';

interface SectionProfesionalSkillProps {
    skills: string[] | SkillItem[]; // Support both legacy and new structure
}

export const SectionProfesionalSkill = ({ skills }: SectionProfesionalSkillProps) => {
    const [skillImages, setSkillImages] = useState<Record<string, string>>({});

    // Normalize skills to SkillItem[] for consistent rendering
    const normalizedSkills: SkillItem[] = skills.map((s) => {
        if (typeof s === 'string') {
            return { name: s, level: 50, category: 'hard_skill', displayMode: 'label' };
        }
        return s;
    });

    useEffect(() => {
        routingData.getSkills().then(data => {
            const mapping: Record<string, string> = {};
            const traverse = (obj: any) => {
                if (!obj) return;
                if (Array.isArray(obj)) {
                    obj.forEach(item => traverse(item));
                } else if (typeof obj === 'object') {
                    // Match keys from public/data/skill.json: "keahlian" and "gambar"
                    if (obj.keahlian && obj.gambar) {
                        mapping[obj.keahlian.toLowerCase()] = obj.gambar;
                    }
                    // Fallback for English keys if schema changes
                    else if (obj.skill && obj.image) {
                        mapping[obj.skill.toLowerCase()] = obj.image;
                    }
                    Object.values(obj).forEach(val => traverse(val));
                }
            };
            traverse(data);
            setSkillImages(mapping);
        }).catch(err => console.error("Failed to load skill icons", err));
    }, []);

    // Helper to get text label based on percentage
    const getLevelText = (level: number) => {
        if (level <= 20) return 'Beginner';
        if (level <= 40) return 'Elementary';
        if (level <= 60) return 'Intermediate';
        if (level <= 80) return 'Advanced';
        return 'Expert';
    };

    // Helper to get image (Flag or Tech Logo)
    const getSkillImage = (skill: SkillItem) => {
        // If specific image stored (e.g. flag for language), use it
        if (skill.category === 'language') {
             const commonFlags: Record<string, string> = {
                 "bahasa indonesia": "id", "english": "gb", "mandarin": "cn", "japanese": "jp",
                 "korean": "kr", "german": "de", "french": "fr", "arabic": "sa", "spanish": "es"
             };
             const code = commonFlags[skill.name.toLowerCase()];
             if(code) return `https://flagcdn.com/w40/${code}.png`;
        }
        
        // Try exact match first, then check common naming conventions
        const key = skill.name.toLowerCase();
        return skillImages[key] || skill.image;
    };

    return (
        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mt-10">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600 fill-blue-600" /> Professional Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {normalizedSkills.map((skill, i) => {
                    const imgUrl = getSkillImage(skill);
                    
                    return (
                        <div key={i} className="group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shadow-sm shrink-0 overflow-hidden">
                                    {imgUrl ? (
                                        <img src={imgUrl} alt={skill.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-slate-700 text-sm">{skill.name}</h4>
                                        {skill.displayMode === 'percent' ? (
                                            <span className="text-xs font-bold text-blue-600">{skill.level}%</span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded">
                                                {getLevelText(skill.level)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Render Progress Bar only if mode is percent */}
                            {skill.displayMode === 'percent' && (
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out group-hover:bg-blue-500"
                                        style={{ width: `${skill.level}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
