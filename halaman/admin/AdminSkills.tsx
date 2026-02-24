import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { Save, Zap, ChevronDown, ChevronRight, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { routingData } from '../../services/routingData';

interface SkillItem {
    keahlian: string;
    gambar: string;
}

export const AdminSkills = () => {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
      routingData.get('skill').then(res => { 
          if(res) {
              const skillData = Array.isArray(res) ? (res[0] || {}) : res;
              setData(skillData);
          }
      });
  }, []);

  const toggleSection = (key: string) => {
      setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to extract skill items from the complex object structure
  const getSkillItems = (categoryData: any): SkillItem[] => {
      if (!categoryData) return [];
      if (Array.isArray(categoryData)) return categoryData.map((item: any) => ({
          keahlian: item.keahlian || (typeof item === 'string' ? item : ''),
          gambar: item.gambar || ''
      }));
      if (categoryData.daftar && Array.isArray(categoryData.daftar)) {
          return categoryData.daftar.map((item: any) => ({
              keahlian: item.keahlian || '',
              gambar: item.gambar || ''
          }));
      }
      return [];
  };

  // Helper to update the complex object structure
  const updateSkillItems = (path: string[], newItems: SkillItem[]) => {
      setData((prev: any) => {
          const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
          let current = newData;
          
          // Navigate to the parent object
          for (let i = 0; i < path.length - 1; i++) {
              if (!current[path[i]]) current[path[i]] = {};
              current = current[path[i]];
          }

          const lastKey = path[path.length - 1];
          
          // Handle different structures based on existing data
          if (Array.isArray(current[lastKey])) {
              current[lastKey] = newItems;
          } else if (current[lastKey] && current[lastKey].daftar) {
              current[lastKey].daftar = newItems;
          } else {
              // Fallback
               current[lastKey] = {
                   deskripsi: current[lastKey]?.deskripsi || lastKey,
                   daftar: newItems
               };
          }
          
          return newData;
      });
  };

  const handleSave = () => {
      setLoading(true);
      routingData.save('skill', data).then(() => {
          setLoading(false);
          showToast({ message: 'Daftar Skill berhasil diperbarui', type: 'success' });
      }).catch(() => {
          setLoading(false);
          showToast({ message: 'Gagal menyimpan data', type: 'error' });
      });
  };

  // Custom Editor for Skill List with Images
  const SkillListEditor = ({ label, items, onChange }: { label: string, items: SkillItem[], onChange: (items: SkillItem[]) => void }) => {
      const [newItem, setNewItem] = useState<SkillItem>({ keahlian: '', gambar: '' });

      const handleAdd = () => {
          if (newItem.keahlian.trim()) {
              onChange([...items, { ...newItem, gambar: newItem.gambar || `https://placehold.co/100x100/2563eb/ffffff?text=${newItem.keahlian.substring(0,3).toUpperCase()}` }]);
              setNewItem({ keahlian: '', gambar: '' });
          }
      };

      const handleRemove = (index: number) => {
          const newItems = items.filter((_, i) => i !== index);
          onChange(newItems);
      };

      const handleUpdateItem = (index: number, field: keyof SkillItem, value: string) => {
          const newItems = [...items];
          newItems[index] = { ...newItems[index], [field]: value };
          onChange(newItems);
      };

      return (
          <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">{label}</label>
              
              {/* Add New Item */}
              <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                      <Input 
                          placeholder="Nama Keahlian (Contoh: React)" 
                          value={newItem.keahlian}
                          onChange={(e) => setNewItem({...newItem, keahlian: e.target.value})}
                      />
                      <Input 
                          placeholder="URL Gambar Icon (Opsional)" 
                          value={newItem.gambar}
                          onChange={(e) => setNewItem({...newItem, gambar: e.target.value})}
                          className="text-xs font-mono text-slate-500"
                      />
                  </div>
                  <Button onClick={handleAdd} className="h-[88px] w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-5 h-5" />
                  </Button>
              </div>

              {/* List Items */}
              <div className="space-y-2 mt-4 max-h-96 overflow-y-auto pr-2">
                  {items.map((item, index) => (
                      <div key={index} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-200 group">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                              {item.gambar ? (
                                  <img src={item.gambar} alt={item.keahlian} className="w-full h-full object-cover" />
                              ) : (
                                  <ImageIcon className="w-5 h-5 text-slate-300" />
                              )}
                          </div>
                          <div className="flex-1 space-y-1">
                              <input 
                                  className="w-full bg-transparent font-medium text-slate-900 outline-none border-b border-transparent focus:border-blue-300 transition-colors text-sm"
                                  value={item.keahlian}
                                  onChange={(e) => handleUpdateItem(index, 'keahlian', e.target.value)}
                              />
                              <input 
                                  className="w-full bg-transparent text-xs text-slate-400 font-mono outline-none border-b border-transparent focus:border-blue-300 transition-colors"
                                  value={item.gambar}
                                  onChange={(e) => handleUpdateItem(index, 'gambar', e.target.value)}
                                  placeholder="URL Gambar..."
                              />
                          </div>
                          <button 
                              onClick={() => handleRemove(index)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  // Recursive renderer for the skill structure
  const renderSkillEditor = (obj: any, path: string[] = []) => {
      if (!obj) return null;

      return Object.keys(obj).map((key) => {
          const currentPath = [...path, key];
          const value = obj[key];
          const isLeaf = Array.isArray(value) || (value && value.daftar && Array.isArray(value.daftar));
          const sectionKey = currentPath.join('.');

          if (isLeaf) {
              const items = getSkillItems(value);
              const label = value.deskripsi || key.replace(/_/g, ' ').toUpperCase();
              
              return (
                  <div key={sectionKey} className="mb-8 pl-4 border-l-2 border-slate-100">
                      <SkillListEditor 
                          label={label}
                          items={items}
                          onChange={(newItems) => updateSkillItems(currentPath, newItems)}
                      />
                  </div>
              );
          } else if (typeof value === 'object') {
              return (
                  <div key={sectionKey} className="mb-4 border border-slate-100 rounded-xl overflow-hidden">
                      <button 
                          onClick={() => toggleSection(sectionKey)}
                          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                          <span className="font-bold text-slate-700 capitalize flex items-center gap-2">
                              {key.replace(/_/g, ' ')}
                          </span>
                          {expandedSections[sectionKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      
                      {expandedSections[sectionKey] && (
                          <div className="p-4 bg-white">
                              {renderSkillEditor(value, currentPath)}
                          </div>
                      )}
                  </div>
              );
          }
          return null;
      });
  };

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-2xl font-bold text-slate-900">Master Skill</h1>
              <p className="text-slate-500 text-sm">Kelola database skill untuk autocomplete (KV: skill).</p>
          </div>
          <Button onClick={handleSave} isLoading={loading} className="shadow-lg shadow-blue-600/20">
              <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
          </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
          <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" /> Kategori Skill
              </h3>
              {/* Start rendering from root keys (hard_skills, soft_skills) */}
              {renderSkillEditor(data)}
          </Card>
      </div>
    </div>
  );
};
