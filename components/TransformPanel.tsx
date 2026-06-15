'use client';

import { TransformType, ActiveSeries, SeriesKey } from '@/types';
import { getSeriesMeta, SERIES_META } from '@/lib/seriesMeta';
import { getTransformLabel } from '@/lib/transforms';
import { X } from 'lucide-react';

const TRANSFORMS: TransformType[] = ['level', 'growth_rate', 'per_capita', 'real', 'real_growth', 'pc_real', 'pct_of'];

const TRANSFORM_SHORT: Record<TransformType, string> = {
  level: 'Level',
  growth_rate: 'Growth %',
  per_capita: 'Per Capita',
  real: 'Real',
  real_growth: 'Real Growth',
  pc_real: 'PC Real',
  pct_of: '% of…',
};

interface Props {
  series: ActiveSeries[];
  onTransformChange: (key: SeriesKey, transform: TransformType) => void;
  onDenominatorChange: (key: SeriesKey, denom: SeriesKey) => void;
  onRemove: (key: SeriesKey) => void;
  onTransformAll: (transform: TransformType) => void;
}

export default function TransformPanel({ series, onTransformChange, onDenominatorChange, onRemove, onTransformAll }: Props) {
  if (series.length === 0) {
    return (
      <div className="border-b px-6 py-3" style={{ borderColor: 'var(--cream-dark)', background: 'var(--cream)' }}>
        <p className="text-xs italic" style={{ color: 'var(--navy)', opacity: 0.4 }}>Select a series from the sidebar to start plotting.</p>
      </div>
    );
  }

  return (
    <div className="border-b" style={{ borderColor: 'var(--cream-dark)', background: 'white' }}>
      {/* Transform All */}
      <div className="px-4 py-2 border-b flex items-center gap-2 flex-wrap" style={{ borderColor: 'var(--cream-dark)', background: 'var(--cream)' }}>
        <span className="text-[10px] font-black uppercase tracking-widest shrink-0" style={{ color: 'var(--navy)', opacity: 0.5 }}>Transform All:</span>
        {TRANSFORMS.filter(t => t !== 'pct_of').map(t => (
          <button
            key={t}
            onClick={() => onTransformAll(t)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all hover:opacity-80"
            style={{ background: 'white', borderColor: 'var(--cream-dark)', color: 'var(--navy)' }}
          >
            {TRANSFORM_SHORT[t]}
          </button>
        ))}
      </div>

      {/* Per-series rows */}
      <div className="divide-y" style={{ borderColor: 'var(--cream-dark)' }}>
        {series.map(s => {
          const meta = getSeriesMeta(s.key);
          return (
            <div key={s.key} className="px-4 py-2 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 min-w-[140px]">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-xs font-semibold truncate" style={{ color: 'var(--navy)' }}>{meta?.label ?? s.key}</span>
              </div>
              <div className="flex gap-1 flex-wrap flex-1">
                {TRANSFORMS.map(t => (
                  <button
                    key={t}
                    onClick={() => onTransformChange(s.key, t)}
                    className="px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={{
                      background: s.transform === t ? s.color : 'var(--cream)',
                      color: s.transform === t ? 'white' : 'var(--navy)',
                      opacity: s.transform === t ? 1 : 0.6,
                    }}
                  >
                    {TRANSFORM_SHORT[t]}
                  </button>
                ))}
              </div>
              {s.transform === 'pct_of' && (
                <select
                  className="text-xs border rounded-lg px-2 py-0.5"
                  style={{ borderColor: 'var(--cream-dark)', background: 'white', color: 'var(--navy)' }}
                  value={s.denominator ?? ''}
                  onChange={e => onDenominatorChange(s.key, e.target.value as SeriesKey)}
                >
                  <option value="">Select denominator…</option>
                  {SERIES_META.filter(m => m.key !== s.key).map(m => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
              )}
              <button onClick={() => onRemove(s.key)} className="ml-auto transition-opacity hover:opacity-100 opacity-30" style={{ color: 'var(--coral)' }}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
