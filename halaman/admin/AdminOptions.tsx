import React, { useState, useEffect } from 'react';
import { Card } from '../../komponen/ui/Card';
import { Button } from '../../komponen/ui/Button';
import { Input } from '../../komponen/ui/Input';
import { Save, Settings, Plus, Trash2, ChevronDown, ChevronRight, Layers, List } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Toast } from '../../komponen/ui/Toast';
import { routingData } from '../../services/routingData';

interface OptionItem {
  label: string;
  nilai: string;
  kode?: string;
  subkategori?: OptionItem[];
  detail?: OptionItem[];
}

export const AdminOptions = () => {
  const { toast, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
      routingData.get('options').then(res => { 
          if(res) {
               const optionsData = Array.isArray(res) ? (res[0] || {}) : res;
               setData(optionsData);
          }
      });
  }, []);

  const handleSave = () => {
      setLoading(true);
      routingData.save('options', data).then(() => {
          setLoading(false);
          showToast({ message: 'Opsi Pilihan berhasil diperbarui', type: 'success' });
      }).catch(() => {
          setLoading(false);
          showToast({ message: 'Gagal menyimpan data', type: 'error' });
      });
  };

  const toggleExpand = (id: string) => {
      setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- GENERIC LIST EDITOR (Label + Nilai) ---
  const SimpleListEditor = ({ 
      title, 
      items = [], 
      onChange, 
      hasCode = false 
  }: { 
      title: string, 
      items: OptionItem[], 
      onChange: (items: OptionItem[]) => void,
      hasCode?: boolean
  }) => {
      const [newItem, setNewItem] = useState<OptionItem>({ label: '', nilai: '', kode: '' });

      const handleAdd = () => {
          if (newItem.label && newItem.nilai) {
              onChange([...items, newItem]);
              setNewItem({ label: '', nilai: '', kode: '' });
          }
      };

      const handleRemove = (index: number) => {
          onChange(items.filter((_, i) => i !== index));
      };

      const handleUpdate = (index: number, field: keyof OptionItem, value: string) => {
          const newItems = [...items];
          newItems[index] = { ...newItems[index], [field]: value };
          onChange(newItems);
      };

      return (
          <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm h-full flex flex-col">
              <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                  <List className="w-4 h-4 text-slate-400" /> {title}
              </h3>
              
              <div className="flex gap-2 mb-4">
                  <Input 
                      placeholder="Label (Tampilan)" 
                      value={newItem.label} 
                      onChange={e => setNewItem({...newItem, label: e.target.value})} 
                  />
                  <Input 
                      placeholder="Nilai (System)" 
                      value={newItem.nilai} 
                      onChange={e => setNewItem({...newItem, nilai: e.target.value})} 
                  />
                  {hasCode && (
                      <Input 
                          placeholder="Kode (ID/EN)" 
                          value={newItem.kode} 
                          onChange={e => setNewItem({...newItem, kode: e.target.value})} 
                          className="w-24"
                      />
                  )}
                  <Button onClick={handleAdd} className="shrink-0 bg-blue-600 hover:bg-blue-700 w-10 h-10 p-0 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                  </Button>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-60 pr-2 flex-1">
                  {items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center p-2 bg-slate-50 rounded-lg border border-slate-100 group">
                          <input 
                              className="flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none border-b border-transparent focus:border-blue-300"
                              value={item.label}
                              onChange={e => handleUpdate(idx, 'label', e.target.value)}
                          />
                          <input 
                              className="flex-1 bg-transparent text-xs text-slate-500 font-mono outline-none border-b border-transparent focus:border-blue-300"
                              value={item.nilai}
                              onChange={e => handleUpdate(idx, 'nilai', e.target.value)}
                          />
                          {hasCode && (
                              <input 
                                  className="w-16 bg-transparent text-xs text-slate-500 font-mono outline-none border-b border-transparent focus:border-blue-300"
                                  value={item.kode || ''}
                                  onChange={e => handleUpdate(idx, 'kode', e.target.value)}
                              />
                          )}
                          <button onClick={() => handleRemove(idx)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
              </div>
          </Card>
      );
  };

  // --- COMPLEX INDUSTRY EDITOR ---
  const IndustryEditor = ({ items = [], onChange }: { items: OptionItem[], onChange: (items: OptionItem[]) => void }) => {
      const updateItem = (index: number, newItem: OptionItem) => {
          const newItems = [...items];
          newItems[index] = newItem;
          onChange(newItems);
      };

      const addItem = () => {
          onChange([...items, { label: 'Industri Baru', nilai: 'New', subkategori: [] }]);
      };

      const removeItem = (index: number) => {
          if(window.confirm("Hapus kategori industri ini?")) {
              onChange(items.filter((_, i) => i !== index));
          }
      };

      return (
          <Card className="p-6 rounded-[2rem] border-slate-200 shadow-sm md:col-span-2">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-600" /> Daftar Industri (Hierarki)
                  </h3>
                  <Button onClick={addItem} size="sm" variant="outline"><Plus className="w-4 h-4 mr-2" /> Tambah Kategori</Button>
              </div>

              <div className="space-y-4">
                  {items.map((cat, catIdx) => (
                      <div key={catIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                          {/* Level 1: Category */}
                          <div className="bg-slate-50 p-3 flex items-center gap-3">
                              <button onClick={() => toggleExpand(`cat-${catIdx}`)} className="p-1 hover:bg-slate-200 rounded">
                                  {expandedItems[`cat-${catIdx}`] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                              <div className="flex-1 grid grid-cols-2 gap-4">
                                  <Input 
                                      value={cat.label} 
                                      onChange={e => updateItem(catIdx, { ...cat, label: e.target.value })} 
                                      className="bg-white h-9"
                                      placeholder="Nama Kategori"
                                  />
                                  <Input 
                                      value={cat.nilai} 
                                      onChange={e => updateItem(catIdx, { ...cat, nilai: e.target.value })} 
                                      className="bg-white h-9 font-mono text-xs"
                                      placeholder="Nilai System"
                                  />
                              </div>
                              <button onClick={() => removeItem(catIdx)} className="p-2 text-slate-400 hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                              </button>
                          </div>

                          {/* Level 2: Subcategory */}
                          {expandedItems[`cat-${catIdx}`] && (
                              <div className="p-4 bg-white border-t border-slate-100 space-y-3 pl-10">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-bold text-slate-400 uppercase">Subkategori</span>
                                      <Button 
                                          size="sm" 
                                          variant="ghost" 
                                          className="h-6 text-xs"
                                          onClick={() => {
                                              const newSubs = [...(cat.subkategori || []), { label: '', nilai: '', detail: [] }];
                                              updateItem(catIdx, { ...cat, subkategori: newSubs });
                                          }}
                                      >
                                          <Plus className="w-3 h-3 mr-1" /> Tambah
                                      </Button>
                                  </div>
                                  
                                  {(cat.subkategori || []).map((sub, subIdx) => (
                                      <div key={subIdx} className="space-y-2">
                                          <div className="flex items-center gap-2">
                                              <button onClick={() => toggleExpand(`sub-${catIdx}-${subIdx}`)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                                                  {expandedItems[`sub-${catIdx}-${subIdx}`] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                              </button>
                                              <Input 
                                                  value={sub.label} 
                                                  onChange={e => {
                                                      const newSubs = [...(cat.subkategori || [])];
                                                      newSubs[subIdx] = { ...sub, label: e.target.value };
                                                      updateItem(catIdx, { ...cat, subkategori: newSubs });
                                                  }}
                                                  className="h-8 text-sm"
                                                  placeholder="Nama Subkategori"
                                              />
                                              <Input 
                                                  value={sub.nilai} 
                                                  onChange={e => {
                                                      const newSubs = [...(cat.subkategori || [])];
                                                      newSubs[subIdx] = { ...sub, nilai: e.target.value };
                                                      updateItem(catIdx, { ...cat, subkategori: newSubs });
                                                  }}
                                                  className="h-8 text-xs font-mono"
                                                  placeholder="Nilai"
                                              />
                                              <button 
                                                  onClick={() => {
                                                      const newSubs = (cat.subkategori || []).filter((_, i) => i !== subIdx);
                                                      updateItem(catIdx, { ...cat, subkategori: newSubs });
                                                  }}
                                                  className="p-1 text-slate-300 hover:text-red-500"
                                              >
                                                  <Trash2 className="w-3 h-3" />
                                              </button>
                                          </div>

                                          {/* Level 3: Detail */}
                                          {expandedItems[`sub-${catIdx}-${subIdx}`] && (
                                              <div className="pl-8 pr-2 py-2 bg-slate-50/50 rounded-lg border border-slate-100">
                                                  <div className="flex flex-wrap gap-2">
                                                      {(sub.detail || []).map((det, detIdx) => (
                                                          <div key={detIdx} className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-1">
                                                              <input 
                                                                  className="w-24 bg-transparent text-xs outline-none"
                                                                  value={det.label}
                                                                  onChange={e => {
                                                                      const newSubs = [...(cat.subkategori || [])];
                                                                      const newDetails = [...(sub.detail || [])];
                                                                      newDetails[detIdx] = { ...det, label: e.target.value, nilai: e.target.value }; // Auto sync value for simplicity
                                                                      newSubs[subIdx] = { ...sub, detail: newDetails };
                                                                      updateItem(catIdx, { ...cat, subkategori: newSubs });
                                                                  }}
                                                              />
                                                              <button 
                                                                  onClick={() => {
                                                                      const newSubs = [...(cat.subkategori || [])];
                                                                      const newDetails = (sub.detail || []).filter((_, i) => i !== detIdx);
                                                                      newSubs[subIdx] = { ...sub, detail: newDetails };
                                                                      updateItem(catIdx, { ...cat, subkategori: newSubs });
                                                                  }}
                                                                  className="text-slate-300 hover:text-red-500"
                                                              >
                                                                  <Trash2 className="w-3 h-3" />
                                                              </button>
                                                          </div>
                                                      ))}
                                                      <button 
                                                          onClick={() => {
                                                              const newSubs = [...(cat.subkategori || [])];
                                                              const newDetails = [...(sub.detail || []), { label: 'Detail', nilai: 'Detail' }];
                                                              newSubs[subIdx] = { ...sub, detail: newDetails };
                                                              updateItem(catIdx, { ...cat, subkategori: newSubs });
                                                          }}
                                                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md hover:bg-blue-100"
                                                      >
                                                          + Detail
                                                      </button>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </Card>
      );
  };

  return (
    <div className="pb-20">
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      <div className="flex items-center justify-between mb-8">
          <div>
              <h1 className="text-2xl font-bold text-slate-900">Opsi Pilihan Global</h1>
              <p className="text-slate-500 text-sm">Kelola daftar dropdown dan filter (KV: options).</p>
          </div>
          <Button onClick={handleSave} isLoading={loading} className="shadow-lg shadow-blue-600/20">
              <Save className="w-4 h-4 mr-2" /> Simpan Perubahan
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Industry Editor */}
          <IndustryEditor items={data.industri || []} onChange={items => setData({...data, industri: items})} />

          {/* Simple Editors */}
          <SimpleListEditor 
              title="Ukuran Perusahaan" 
              items={data.ukuranPerusahaan} 
              onChange={items => setData({...data, ukuranPerusahaan: items})} 
          />
          <SimpleListEditor 
              title="Tipe Pekerjaan" 
              items={data.tipePekerjaan} 
              onChange={items => setData({...data, tipePekerjaan: items})} 
          />
          <SimpleListEditor 
              title="Level Pekerjaan" 
              items={data.levelPekerjaan} 
              onChange={items => setData({...data, levelPekerjaan: items})} 
          />
          <SimpleListEditor 
              title="Mode Kerja" 
              items={data.modeKerja} 
              onChange={items => setData({...data, modeKerja: items})} 
          />
          <SimpleListEditor 
              title="Bahasa" 
              items={data.bahasa} 
              onChange={items => setData({...data, bahasa: items})} 
              hasCode={true}
          />
          <SimpleListEditor 
              title="Font Surat" 
              items={data.fontSurat} 
              onChange={items => setData({...data, fontSurat: items})} 
          />
          <SimpleListEditor 
              title="Gaya Surat" 
              items={data.gayaSurat} 
              onChange={items => setData({...data, gayaSurat: items})} 
          />
      </div>
    </div>
  );
};
