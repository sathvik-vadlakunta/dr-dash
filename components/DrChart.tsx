'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { ActiveSeries, ChartDataPoint } from '@/types';
import { getSeriesMeta } from '@/lib/seriesMeta';
import { getTransformLabel, getTransformedUnit } from '@/lib/transforms';

interface Props {
  data: ChartDataPoint[];
  series: ActiveSeries[];
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
}

function formatVal(val: number | null | undefined, unit: string): string {
  if (val == null) return 'N/A';
  if (unit.includes('Billions')) return `$${val.toFixed(1)}B`;
  if (unit.includes('Persons')) return val >= 1e6 ? `${(val / 1e6).toFixed(1)}M` : val.toLocaleString();
  if (unit.includes('$/') || unit.includes('$ /')) return `$${val.toFixed(2)}`;
  if (unit.includes('2024 $') && !unit.includes('Billions')) return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function tickFmt(val: number, unit: string): string {
  if (unit.includes('Billions')) {
    return Math.abs(val) >= 1000 ? `$${(val / 1000).toFixed(0)}T` : `$${val.toFixed(0)}B`;
  }
  if (unit.includes('Persons')) return val >= 1e8 ? `${(val / 1e6).toFixed(0)}M` : `${(val / 1e6).toFixed(1)}M`;
  if (unit.includes('2024 $') && !unit.includes('Billions')) return `$${(val / 1000).toFixed(0)}K`;
  return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label, series }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-lg p-3 text-xs border" style={{ background: 'white', borderColor: 'var(--cream-dark)', color: 'var(--navy)' }}>
      <p className="font-black text-sm mb-2" style={{ color: 'var(--navy)' }}>{label}</p>
      {payload.map((entry: { dataKey: string; value: number | null; color: string }) => {
        const s = series.find((s: ActiveSeries) => `${s.key}_${s.transform}` === entry.dataKey);
        if (!s) return null;
        const meta = getSeriesMeta(s.key);
        const unit = getTransformedUnit(meta?.unit ?? '', s.transform, s.denominator);
        return (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
            <span style={{ opacity: 0.7 }}>{meta?.label}:</span>
            <span className="font-bold ml-auto">{formatVal(entry.value, unit)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default function DrChart({ data, series, yearRange, onYearRangeChange }: Props) {
  const filtered = data.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  const allYears = data.map(d => d.year);
  const minYear = allYears[0] ?? 1929;
  const maxYear = allYears[allYears.length - 1] ?? 2024;

  if (series.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-7xl mb-5">📊</div>
          <p className="text-xl font-black mb-2" style={{ color: 'var(--navy)' }}>Nothing plotted yet</p>
          <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>Pick a series from the sidebar, or start a Lesson</p>
        </div>
      </div>
    );
  }

  const unit0 = series[0]
    ? getTransformedUnit(getSeriesMeta(series[0].key)?.unit ?? '', series[0].transform, series[0].denominator)
    : '';

  return (
    <div className="flex-1 flex flex-col min-h-0 p-5" style={{ background: 'white' }}>
      {/* Year range */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-black uppercase tracking-widest shrink-0" style={{ color: 'var(--navy)', opacity: 0.4 }}>Range</span>
        <span className="text-xs font-bold shrink-0" style={{ color: 'var(--coral)' }}>{yearRange[0]}</span>
        <input type="range" min={minYear} max={maxYear - 1} value={yearRange[0]}
          onChange={e => onYearRangeChange([+e.target.value, yearRange[1]])}
          className="flex-1" style={{ accentColor: 'var(--coral)' }} />
        <input type="range" min={yearRange[0] + 1} max={maxYear} value={yearRange[1]}
          onChange={e => onYearRangeChange([yearRange[0], +e.target.value])}
          className="flex-1" style={{ accentColor: 'var(--coral)' }} />
        <span className="text-xs font-bold shrink-0" style={{ color: 'var(--coral)' }}>{yearRange[1]}</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filtered} margin={{ top: 8, right: 24, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,34,64,0.07)" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--navy)', opacity: 0.5 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: 'var(--navy)', opacity: 0.5 }} width={72} tickFormatter={(v) => tickFmt(v, unit0)} />
          <Tooltip content={<CustomTooltip series={series} />} />
          <Legend
            formatter={(value) => {
              const s = series.find(s => `${s.key}_${s.transform}` === value);
              if (!s) return value;
              const meta = getSeriesMeta(s.key);
              return `${meta?.label ?? s.key} (${getTransformLabel(s.transform, s.denominator)})`;
            }}
            wrapperStyle={{ fontSize: 11 }}
          />
          <ReferenceLine y={0} stroke="rgba(28,34,64,0.15)" strokeDasharray="4 4" />
          {series.map(s => (
            <Line
              key={`${s.key}_${s.transform}`}
              type="monotone"
              dataKey={`${s.key}_${s.transform}`}
              stroke={s.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: s.color, strokeWidth: 2, stroke: 'white' }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
