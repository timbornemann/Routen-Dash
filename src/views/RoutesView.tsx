import React, { useState } from 'react';
import { BikeRoute, RouteType, Difficulty } from '../types';
import { ROUTE_TYPES, DIFFICULTIES } from '../lib/constants';
import { Plus, Trash2, Route, Mountain, Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RoutesViewProps {
  routes: BikeRoute[];
  addRoute: (route: Omit<BikeRoute, 'id'>) => void;
  deleteRoute: (id: string) => void;
  updateRoute: (route: BikeRoute) => void;
}

export function RoutesView({ routes, addRoute, deleteRoute, updateRoute }: RoutesViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  
  // Add Form State
  const [name, setName] = useState('');
  const [distance, setDistance] = useState<number | ''>('');
  const [type, setType] = useState<RouteType>('Road');
  const [difficulty, setDifficulty] = useState<Difficulty>('Mittel');

  // Edit Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDistance, setEditDistance] = useState<number | ''>('');
  const [editType, setEditType] = useState<RouteType>('Road');
  const [editDifficulty, setEditDifficulty] = useState<Difficulty>('Mittel');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addRoute({
      name: name.trim(),
      distance: distance === '' ? '' : Number(distance),
      type,
      difficulty
    });

    // Reset
    setName('');
    setDistance('');
    setType('Road');
    setDifficulty('Mittel');
    setIsAdding(false);
  };

  const startEdit = (route: BikeRoute) => {
    setEditingId(route.id);
    setEditName(route.name);
    setEditDistance(route.distance);
    setEditType(route.type);
    setEditDifficulty(route.difficulty);
    setIsAdding(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editingId) return;

    updateRoute({
      id: editingId,
      name: editName.trim(),
      distance: editDistance === '' ? '' : Number(editDistance),
      type: editType,
      difficulty: editDifficulty
    });

    setEditingId(null);
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col h-full overflow-hidden">
      
      {/* Fixed Header section */}
      <div className="flex justify-between items-center mb-2 pt-6 px-6 shrink-0">
        <h1 className="text-2xl font-bold text-brand-text">Meine Routen</h1>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-accent/10 text-brand-accent p-2 rounded-full hover:bg-brand-accent/20 transition-colors"
        >
          <Plus className={`transform transition-transform ${isAdding ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Scrollable Context section */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-4" style={{ touchAction: 'pan-y' }}>
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <form onSubmit={handleAddSubmit} className="bg-brand-light rounded-[16px] p-5">
                <h3 className="text-base font-semibold mb-4 text-brand-accent">Tour hinzufügen</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Name der Route *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px] outline-none focus:border-brand-accent text-brand-text text-[14px] transition-colors"
                      placeholder="z.B. Feierabendrunde"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Distanz (km)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px] outline-none focus:border-brand-accent text-brand-text text-[14px] transition-colors"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Fahrrad-Typ</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as RouteType)}
                        className="w-full bg-brand-light border border-brand-border rounded-[8px] p-[10px] outline-none focus:border-brand-accent text-brand-text text-[14px] transition-colors"
                      >
                        {ROUTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Schwierigkeit</label>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={`flex-1 py-1.5 px-3 rounded-[20px] text-[10px] uppercase font-bold transition-all ${
                            difficulty === d 
                              ? 'bg-brand-accent/20 text-brand-accent opacity-100 border border-brand-accent/50' 
                              : 'bg-brand-accent/5 text-brand-accent opacity-50 hover:bg-brand-accent/10 border border-transparent'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-light text-brand-text border border-brand-accent font-semibold p-3 rounded-[12px] mt-5 hover:bg-brand-surface transition-colors"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 pt-2">
          {routes.length === 0 ? (
            <div className="text-center py-12 text-brand-dim">
              <Route size={48} className="mx-auto mb-4 opacity-20" />
              <p>Keine Routen gespeichert.</p>
              <p className="text-sm">Füge eine neue Route hinzu, um das Roulette zu starten!</p>
            </div>
          ) : (
            <AnimatePresence>
              {routes.map(route => {
                if (editingId === route.id) {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={`edit-${route.id}`}
                      className="bg-brand-light rounded-[16px] p-5 w-full border border-brand-accent/30 shadow-lg"
                    >
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-base font-semibold text-brand-accent">Tour bearbeiten</h3>
                          <button type="button" onClick={() => setEditingId(null)} className="text-brand-dim hover:text-brand-text">
                            <X size={20} />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Name der Route *</label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-brand-surface border border-brand-border rounded-[8px] p-[10px] outline-none focus:border-brand-accent text-brand-text text-[14px] transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Distanz (km)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={editDistance}
                              onChange={(e) => setEditDistance(e.target.value ? Number(e.target.value) : '')}
                              className="w-full bg-brand-surface border border-brand-border rounded-[8px] p-[10px] outline-none focus:border-brand-accent text-brand-text text-[14px] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Fahrrad-Typ</label>
                            <select
                              value={editType}
                              onChange={(e) => setEditType(e.target.value as RouteType)}
                              className="w-full bg-brand-surface border border-brand-border rounded-[8px] p-[10px] outline-none focus:border-brand-accent text-brand-text text-[14px] transition-colors"
                            >
                              {ROUTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-brand-dim mb-[6px]">Schwierigkeit</label>
                          <div className="flex gap-2">
                            {DIFFICULTIES.map(d => (
                              <button
                                key={`edit-diff-${d}`}
                                type="button"
                                onClick={() => setEditDifficulty(d)}
                                className={`flex-1 py-1.5 px-3 rounded-[20px] text-[10px] uppercase font-bold transition-all ${
                                  editDifficulty === d 
                                    ? 'bg-brand-accent/20 text-brand-accent opacity-100 border border-brand-accent/50' 
                                    : 'bg-brand-accent/5 text-brand-accent opacity-50 hover:bg-brand-accent/10 border border-transparent'
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand-accent text-black font-semibold p-3 rounded-[12px] mt-2 hover:opacity-90 transition-opacity"
                        >
                          Änderungen speichern
                        </button>
                      </form>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    key={route.id}
                    className="bg-brand-light p-[12px] px-[16px] rounded-[12px] border-l-[3px] border-brand-accent flex items-center justify-between group"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-[10px] py-[4px] rounded-[20px] text-brand-accent bg-brand-accent/10">
                          {route.type}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-[10px] py-[4px] rounded-[20px] text-brand-dim bg-brand-surface border border-brand-border">
                          {route.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-brand-text text-[14px] leading-tight mb-1">{route.name}</h3>
                      {route.distance && (
                        <p className="text-[11px] text-brand-dim flex items-center gap-1">
                          <Route size={12} /> {route.distance} km
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(route)}
                        className="p-2 text-brand-dim hover:text-brand-accent rounded-full transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteRoute(route.id)}
                        className="p-2 text-brand-dim hover:text-red-400 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
