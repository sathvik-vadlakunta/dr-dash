'use client';

import { useState } from 'react';
import { SeriesKey } from '@/types';
import { SERIES_META, CATEGORIES } from '@/lib/seriesMeta';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';

const COLORS = [
  '#E8715A', '#5BA89A', '#1C2240', '#D4A020', '#7C4DFF',
  '#E91E63', '#00ACC1', '#43A047', '#FF7043', '#5C6BC0',
];

interface Props {
  onAdd: (key: SeriesKey, color: string) => void;
  activeKeys: SeriesKey[];
  nextColor: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ onAdd, activeKeys, nextColor, isOpen, onClose }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Output: true });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={[
          'border-r overflow-y-auto flex flex-col',
          // Mobile: fixed drawer, slides in from left
          'fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-200 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: static inline, always visible
          'md:relative md:translate-x-0 md:w-64 md:flex',
        ].join(' ')}
        style={{ borderColor: 'var(--cream-dark)', background: 'white' }}
      >
        <div className="px-4 pt-4 pb-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--cream-dark)' }}>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--navy)', opacity: 0.5 }}>Data Series</h2>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--navy)', opacity: 0.4 }}>Tap any series to plot it</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg transition-opacity hover:opacity-70"
            style={{ color: 'var(--navy)', opacity: 0.5 }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CATEGORIES.map(cat => (
            <div key={cat}>
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors hover:opacity-80"
                style={{ color: 'var(--navy)', opacity: 0.6 }}
                onClick={() => setExpanded(e => ({ ...e, [cat]: !e[cat] }))}
              >
                <span>{cat}</span>
                {expanded[cat] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              {expanded[cat] && (
                <div className="pb-1">
                  {SERIES_META.filter(s => s.category === cat).map(s => {
                    const isActive = activeKeys.includes(s.key);
                    return (
                      <button
                        key={s.key}
                        onClick={() => { if (!isActive) { onAdd(s.key, nextColor); onClose?.(); } }}
                        title={s.description}
                        className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 transition-all rounded-lg mx-1"
                        style={{
                          width: 'calc(100% - 8px)',
                          color: isActive ? 'var(--coral)' : 'var(--navy)',
                          background: isActive ? 'rgba(232,113,90,0.08)' : 'transparent',
                          fontWeight: isActive ? 600 : 400,
                          opacity: isActive ? 1 : 0.75,
                          cursor: isActive ? 'default' : 'pointer',
                        }}
                      >
                        <Plus
                          size={11}
                          className="shrink-0 transition-opacity"
                          style={{ opacity: isActive ? 0 : 0.4, color: 'var(--coral)' }}
                        />
                        <span className="leading-snug truncate">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mx-4 border-b" style={{ borderColor: 'var(--cream-dark)' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export { COLORS };
