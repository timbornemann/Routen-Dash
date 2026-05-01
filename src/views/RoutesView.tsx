import React, { useRef, useState } from 'react';
import { BikeRoute, RouteType, Difficulty } from '../types';
import { ROUTE_TYPES, DIFFICULTIES } from '../lib/constants';
import { Plus, Trash2, Route, Pencil, X, Timer, Upload, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoutesViewProps {
  routes: BikeRoute[];
  addRoute: (route: Omit<BikeRoute, 'id'>) => void;
  deleteRoute: (id: string) => void;
  updateRoute: (route: BikeRoute) => void;
  importRoutes: (routes: BikeRoute[]) => void;
}

export function RoutesView({ routes, addRoute, deleteRoute, updateRoute, importRoutes }: RoutesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [type, setType] = useState<RouteType>('Road');
  const [difficulty, setDifficulty] = useState<Difficulty>('Mittel');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDistance, setEditDistance] = useState<number | ''>('');
  const [editDuration, setEditDuration] = useState<number | ''>('');
  const [editType, setEditType] = useState<RouteType>('Road');
  const [editDifficulty, setEditDifficulty] = useState<Difficulty>('Mittel');

  const exportRoutes = () => {
    const blob = new Blob([JSON.stringify(routes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routen-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as BikeRoute[];
      if (!Array.isArray(parsed)) throw new Error('Ungültige Datei');
      const sanitized = parsed.filter(route =>
        route && typeof route.id === 'string' && typeof route.name === 'string' &&
        typeof route.distance === 'number' && typeof route.duration === 'number' &&
        typeof route.type === 'string' && typeof route.difficulty === 'string'
      );
      if (sanitized.length === 0) throw new Error('Keine gültigen Routen gefunden');
      importRoutes(sanitized);
    } catch {
      alert('Import fehlgeschlagen. Bitte eine gültige JSON-Datei verwenden.');
    } finally {
      event.target.value = '';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || distance === '' || duration === '') return;
    addRoute({ name: name.trim(), distance: Number(distance), duration: Number(duration), type, difficulty });
    setName(''); setDistance(''); setDuration(''); setType('Road'); setDifficulty('Mittel'); setIsAdding(false);
  };

  const startEdit = (route: BikeRoute) => {
    setEditingId(route.id); setEditName(route.name); setEditDistance(route.distance); setEditDuration(route.duration);
    setEditType(route.type); setEditDifficulty(route.difficulty); setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editingId || editDistance === '' || editDuration === '') return;
    updateRoute({ id: editingId, name: editName.trim(), distance: Number(editDistance), duration: Number(editDuration), type: editType, difficulty: editDifficulty });
    setEditingId(null);
  };

  return <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col h-full overflow-hidden">
    <div className="flex justify-between items-center mb-2 pt-6 px-6 shrink-0">
      <h1 className="text-2xl font-bold text-brand-text">Meine Routen</h1>
      <div className="flex items-center gap-2">
        <button onClick={exportRoutes} className="bg-brand-accent/10 text-brand-accent p-2 rounded-full hover:bg-brand-accent/20 transition-colors"><Download size={18} /></button>
        <button onClick={() => fileInputRef.current?.click()} className="bg-brand-accent/10 text-brand-accent p-2 rounded-full hover:bg-brand-accent/20 transition-colors"><Upload size={18} /></button>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-brand-accent/10 text-brand-accent p-2 rounded-full hover:bg-brand-accent/20 transition-colors"><Plus className={`transform transition-transform ${isAdding ? 'rotate-45' : ''}`} /></button>
      </div>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
    </div>
    <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4" style={{ touchAction: 'pan-y' }}>
      <AnimatePresence>{isAdding && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6"><form onSubmit={handleAddSubmit} className="bg-brand-light rounded-[16px] p-5"><h3 className="text-base font-semibold mb-4 text-brand-accent">Tour hinzufügen</h3><div className="space-y-4"><input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px]" placeholder="Name der Route *" />
      <div className="grid grid-cols-2 gap-4"><input required type="number" min="0" step="0.1" value={distance} onChange={(e)=>setDistance(e.target.value?Number(e.target.value):'')} className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px]" placeholder="Distanz (km) *" />
      <input required type="number" min="1" step="1" value={duration} onChange={(e)=>setDuration(e.target.value?Number(e.target.value):'')} className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px]" placeholder="Zeit (Min) *" /></div>
      <div className="grid grid-cols-2 gap-4"><select value={type} onChange={(e)=>setType(e.target.value as RouteType)} className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px]"><option value="" disabled>Typ auswählen</option>{ROUTE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select>
      <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value as Difficulty)} className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px]"><option value="" disabled>Schwierigkeit auswählen</option>{DIFFICULTIES.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
      <button type="submit" className="w-full bg-brand-light text-brand-text border border-brand-accent font-semibold p-3 rounded-[12px] mt-5">Speichern</button></div></form></motion.div>}</AnimatePresence>
      <div className="space-y-3 pt-2">{routes.map(route => editingId===route.id ? <motion.div key={`edit-${route.id}`} className="bg-brand-light rounded-[16px] p-5 w-full border border-brand-accent/30"><form onSubmit={handleEditSubmit} className="space-y-3"><div className="flex justify-between"><h3 className="text-base font-semibold text-brand-accent">Tour bearbeiten</h3><button type="button" onClick={()=>setEditingId(null)}><X size={20}/></button></div><div><label className="text-xs font-semibold text-brand-dim block mb-1">Routenname</label><input required value={editName} onChange={e=>setEditName(e.target.value)} className="w-full bg-brand-surface border rounded-[8px] p-[10px]" /></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-semibold text-brand-dim block mb-1">Distanz (km)</label><input required type="number" min="0" step="0.1" value={editDistance} onChange={e=>setEditDistance(e.target.value?Number(e.target.value):'')} className="w-full bg-brand-surface border rounded-[8px] p-[10px]" /></div><div><label className="text-xs font-semibold text-brand-dim block mb-1">Zeit (Min)</label><input required type="number" min="1" step="1" value={editDuration} onChange={e=>setEditDuration(e.target.value?Number(e.target.value):'')} className="w-full bg-brand-surface border rounded-[8px] p-[10px]" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-semibold text-brand-dim block mb-1">Typ</label><select value={editType} onChange={e=>setEditType(e.target.value as RouteType)} className="w-full bg-brand-surface border rounded-[8px] p-[10px]">{ROUTE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div><div><label className="text-xs font-semibold text-brand-dim block mb-1">Schwierigkeit</label><select value={editDifficulty} onChange={e=>setEditDifficulty(e.target.value as Difficulty)} className="w-full bg-brand-surface border rounded-[8px] p-[10px]">{DIFFICULTIES.map(d=><option key={d} value={d}>{d}</option>)}</select></div></div><button type="submit" className="w-full bg-brand-accent text-black font-semibold p-3 rounded-[12px]">Änderungen speichern</button></form></motion.div> : <motion.div key={route.id} className="bg-brand-light p-[12px] px-[16px] rounded-[12px] border-l-[3px] border-brand-accent flex items-center justify-between"><div><div className="flex gap-2 mb-1"><span className="text-[10px] font-bold uppercase px-[10px] py-[4px] rounded-[20px] text-brand-accent bg-brand-accent/10">{route.type}</span><span className="text-[10px] font-bold uppercase px-[10px] py-[4px] rounded-[20px] text-brand-dim bg-brand-surface border">{route.difficulty}</span></div><h3 className="font-semibold text-[14px] mb-1">{route.name}</h3><p className="text-[11px] text-brand-dim flex items-center gap-3"><span className="flex items-center gap-1"><Route size={12} /> {route.distance} km</span><span className="flex items-center gap-1"><Timer size={12} /> {route.duration} min</span></p></div><div className="flex"><button onClick={()=>startEdit(route)} className="p-2"><Pencil size={18}/></button><button onClick={()=>deleteRoute(route.id)} className="p-2"><Trash2 size={18}/></button></div></motion.div>)}</div>
    </div>
  </div>;
}
