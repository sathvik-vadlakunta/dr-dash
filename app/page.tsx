'use client';

import { useEffect, useState, useCallback } from 'react';
import Sidebar, { COLORS } from '@/components/Sidebar';
import TransformPanel from '@/components/TransformPanel';
import DrChart from '@/components/DrChart';
import LessonsPanel from '@/components/LessonsPanel';
import Landing from '@/components/Landing';
import { ActiveSeries, ChartDataPoint, SeriesKey, TransformType, YearData } from '@/types';
import { applyTransform } from '@/lib/transforms';
import { BookOpen, BarChart2, PlusCircle } from 'lucide-react';

type DataMap = Record<string, YearData>;

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [rawData, setRawData] = useState<DataMap>({});
  const [activeSeries, setActiveSeries] = useState<ActiveSeries[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1929, 2024]);
  const [tab, setTab] = useState<'chart' | 'lessons'>('chart');
  const [colorIndex, setColorIndex] = useState(0);
  const [dataSource, setDataSource] = useState<'loading' | 'live' | 'static'>('loading');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = (url: string) =>
      fetch(url)
        .then(r => { if (!r.ok) throw new Error(r.status.toString()); return r.json(); })
        .then((d: DataMap) => {
          const years = Object.keys(d).map(Number).filter(n => !isNaN(n) && n >= 1900).sort((a, b) => a - b);
          if (years.length === 0) throw new Error('no valid years');
          setRawData(d);
          setYearRange([years[0], years[years.length - 1]]);
        });

    load('/api/macro-data')
      .then(() => setDataSource('live'))
      .catch(() =>
        load('/statsbook_data.json')
          .then(() => setDataSource('static'))
      );
  }, []);

  const rebuildChartData = useCallback((data: DataMap, series: ActiveSeries[]) => {
    if (!Object.keys(data).length) return;
    const years = Object.keys(data).map(Number).sort((a, b) => a - b);
    const points: ChartDataPoint[] = years.map(year => {
      const point: ChartDataPoint = { year };
      series.forEach(s => {
        const key = `${s.key}_${s.transform}`;
        const transformed = applyTransform(data, s.key, s.transform, s.denominator);
        const found = transformed.find(t => t.year === year);
        point[key] = found?.value ?? null;
      });
      return point;
    });
    setChartData(points);
  }, []);

  useEffect(() => {
    rebuildChartData(rawData, activeSeries);
  }, [rawData, activeSeries, rebuildChartData]);

  const addSeries = useCallback((key: SeriesKey, color: string) => {
    setActiveSeries(prev => {
      if (prev.find(s => s.key === key)) return prev;
      return [...prev, { key, transform: 'level', color }];
    });
    setColorIndex(i => (i + 1) % COLORS.length);
  }, []);

  const removeSeries = useCallback((key: SeriesKey) => {
    setActiveSeries(prev => prev.filter(s => s.key !== key));
  }, []);

  const changeTransform = useCallback((key: SeriesKey, transform: TransformType) => {
    setActiveSeries(prev => prev.map(s => s.key === key ? { ...s, transform } : s));
  }, []);

  const changeDenominator = useCallback((key: SeriesKey, denom: SeriesKey) => {
    setActiveSeries(prev => prev.map(s => s.key === key ? { ...s, denominator: denom } : s));
  }, []);

  const transformAll = useCallback((transform: TransformType) => {
    setActiveSeries(prev => prev.map(s => ({ ...s, transform })));
  }, []);

  // Lessons can replace the active chart series entirely
  const setChartSeries = useCallback((series: ActiveSeries[]) => {
    setActiveSeries(series);
    setColorIndex(series.length % COLORS.length);
  }, []);

  if (showLanding) {
    return (
      <Landing
        onEnterApp={() => setShowLanding(false)}
        onGoToLessons={() => { setShowLanding(false); setTab('lessons'); }}
      />
    );
  }

  const tabBtn = (id: 'chart' | 'lessons', icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setTab(id)}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all"
      style={{
        background: tab === id ? 'var(--coral)' : 'transparent',
        color: tab === id ? 'white' : 'var(--navy)',
        opacity: tab === id ? 1 : 0.5,
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--cream)', color: 'var(--navy)' }}>
      {/* Header */}
      <header className="shrink-0 px-3 md:px-6 py-3 flex items-center justify-between border-b gap-2" style={{ background: 'white', borderColor: 'var(--cream-dark)' }}>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--coral)' }}>
            <BarChart2 size={17} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none" style={{ color: 'var(--navy)' }}>
              Dr.<span style={{ color: 'var(--coral)' }}>Dash</span>
            </h1>
            <p className="text-[11px] leading-none mt-0.5 hidden sm:block" style={{ color: 'var(--navy)', opacity: 0.45 }}>U.S. Macroeconomic Data · 1929–2024</p>
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-2xl border" style={{ background: 'var(--cream)', borderColor: 'var(--cream-dark)' }}>
          {tabBtn('chart', <BarChart2 size={14} />, 'Explore')}
          {tabBtn('lessons', <BookOpen size={14} />, 'Lessons')}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile: open sidebar button (chart tab only) */}
          {tab === 'chart' && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold"
              style={{ background: 'var(--coral)', color: 'white' }}
            >
              <PlusCircle size={14} /> Series
            </button>
          )}
          {/* Data source indicator */}
          {dataSource === 'loading' && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold animate-pulse" style={{ background: 'var(--cream-dark)', color: 'var(--navy)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--navy)', opacity: 0.3 }} />
              <span className="hidden sm:inline">Loading…</span>
            </div>
          )}
          {dataSource === 'live' && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(91,168,154,0.12)', color: 'var(--teal)' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--teal)' }} />
              <span className="hidden sm:inline">Live · FRED API</span>
            </div>
          )}
          {dataSource === 'static' && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold" style={{ background: 'rgba(212,160,32,0.12)', color: '#A07800' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#D4A020' }} />
              <span className="hidden sm:inline">Statsbook 2025</span>
            </div>
          )}
          <button
            onClick={() => setShowLanding(true)}
            className="text-[11px] italic transition-opacity hover:opacity-70 hidden md:block"
            style={{ color: 'var(--navy)', opacity: 0.35 }}
          >
            Pingle, <em>U.S. Macroeconomic Statistics</em>, 29th ed. (2025)
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {tab === 'chart' ? (
          <>
            <Sidebar
              onAdd={addSeries}
              activeKeys={activeSeries.map(s => s.key)}
              nextColor={COLORS[colorIndex % COLORS.length]}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <div className="flex-1 flex flex-col min-w-0">
              <TransformPanel
                series={activeSeries}
                onTransformChange={changeTransform}
                onDenominatorChange={changeDenominator}
                onRemove={removeSeries}
                onTransformAll={transformAll}
              />
              <DrChart
                data={chartData}
                series={activeSeries}
                yearRange={yearRange}
                onYearRangeChange={setYearRange}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 min-h-0">
            {/* Lessons panel — full width on mobile, fixed width on desktop */}
            <div className="w-full md:w-[420px] shrink-0 md:border-r overflow-hidden flex flex-col" style={{ borderColor: 'var(--cream-dark)', background: 'var(--cream)' }}>
              <LessonsPanel
                onSetChartSeries={setChartSeries}
                activeSeries={activeSeries}
              />
            </div>
            {/* Live chart — hidden on mobile, visible on desktop */}
            <div className="hidden md:flex flex-1 flex-col min-w-0" style={{ background: 'white' }}>
              <TransformPanel
                series={activeSeries}
                onTransformChange={changeTransform}
                onDenominatorChange={changeDenominator}
                onRemove={removeSeries}
                onTransformAll={transformAll}
              />
              <DrChart
                data={chartData}
                series={activeSeries}
                yearRange={yearRange}
                onYearRangeChange={setYearRange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="shrink-0 px-4 md:px-6 py-2 border-t hidden sm:flex gap-4 md:gap-6 items-center" style={{ background: 'white', borderColor: 'var(--cream-dark)' }}>
        {[
          ['96', 'years (1929–2024)'],
          ['36', 'data series'],
          ['7', 'transformations'],
          ['5', 'lessons'],
        ].map(([n, label]) => (
          <span key={label} className="text-xs" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            <strong style={{ color: 'var(--coral)', opacity: 1 }}>{n}</strong> {label}
          </span>
        ))}
        {activeSeries.length > 0 && (
          <span className="ml-auto text-xs font-bold" style={{ color: 'var(--coral)' }}>
            {activeSeries.length} series plotted
          </span>
        )}
      </footer>
    </div>
  );
}
