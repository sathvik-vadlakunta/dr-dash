'use client';

import { useEffect, useState, useCallback } from 'react';
import Sidebar, { COLORS } from '@/components/Sidebar';
import TransformPanel from '@/components/TransformPanel';
import DrChart from '@/components/DrChart';
import LessonsPanel from '@/components/LessonsPanel';
import Landing from '@/components/Landing';
import { ActiveSeries, ChartDataPoint, SeriesKey, TransformType, YearData } from '@/types';
import { applyTransform } from '@/lib/transforms';
import { BookOpen, BarChart2, PlusCircle, Columns2, Rows2, X as XIcon } from 'lucide-react';

type DataMap = Record<string, YearData>;

function buildPoints(data: DataMap, series: ActiveSeries[]): ChartDataPoint[] {
  if (!Object.keys(data).length) return [];
  const years = Object.keys(data).map(Number).sort((a, b) => a - b);
  return years.map(year => {
    const point: ChartDataPoint = { year };
    series.forEach(s => {
      const transformed = applyTransform(data, s.key, s.transform, s.denominator);
      point[`${s.key}_${s.transform}`] = transformed.find(t => t.year === year)?.value ?? null;
    });
    return point;
  });
}

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [rawData, setRawData] = useState<DataMap>({});
  const [tab, setTab] = useState<'chart' | 'lessons'>('chart');
  const [dataSource, setDataSource] = useState<'loading' | 'live' | 'static'>('loading');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [splitMode, setSplitMode] = useState(false);
  const [splitDir, setSplitDir] = useState<'horizontal' | 'vertical'>('horizontal');
  const [focusedPanel, setFocusedPanel] = useState<0 | 1>(0);

  // Panel 0
  const [activeSeries, setActiveSeries] = useState<ActiveSeries[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1929, 2024]);
  const [colorIndex, setColorIndex] = useState(0);

  // Panel 1
  const [activeSeries2, setActiveSeries2] = useState<ActiveSeries[]>([]);
  const [chartData2, setChartData2] = useState<ChartDataPoint[]>([]);
  const [yearRange2, setYearRange2] = useState<[number, number]>([1929, 2024]);
  const [colorIndex2, setColorIndex2] = useState(0);

  useEffect(() => {
    const load = (url: string) =>
      fetch(url)
        .then(r => { if (!r.ok) throw new Error(r.status.toString()); return r.json(); })
        .then((d: DataMap) => {
          const years = Object.keys(d).map(Number).filter(n => !isNaN(n) && n >= 1900).sort((a, b) => a - b);
          if (years.length === 0) throw new Error('no valid years');
          setRawData(d);
          const range: [number, number] = [years[0], years[years.length - 1]];
          setYearRange(range);
          setYearRange2(range);
        });

    load('/api/macro-data')
      .then(() => setDataSource('live'))
      .catch(() => load('/statsbook_data.json').then(() => setDataSource('static')));
  }, []);

  useEffect(() => { setChartData(buildPoints(rawData, activeSeries)); }, [rawData, activeSeries]);
  useEffect(() => { setChartData2(buildPoints(rawData, activeSeries2)); }, [rawData, activeSeries2]);

  // Panel 0 handlers
  const addToPanel0 = useCallback((key: SeriesKey, color: string) => {
    setActiveSeries(prev => prev.find(s => s.key === key) ? prev : [...prev, { key, transform: 'level', color }]);
    setColorIndex(i => (i + 1) % COLORS.length);
  }, []);
  const removeSeries = useCallback((key: SeriesKey) => setActiveSeries(prev => prev.filter(s => s.key !== key)), []);
  const changeTransform = useCallback((key: SeriesKey, t: TransformType) => setActiveSeries(prev => prev.map(s => s.key === key ? { ...s, transform: t } : s)), []);
  const changeDenominator = useCallback((key: SeriesKey, d: SeriesKey) => setActiveSeries(prev => prev.map(s => s.key === key ? { ...s, denominator: d } : s)), []);
  const transformAll = useCallback((t: TransformType) => setActiveSeries(prev => prev.map(s => ({ ...s, transform: t }))), []);
  const setChartSeries = useCallback((series: ActiveSeries[]) => { setActiveSeries(series); setColorIndex(series.length % COLORS.length); }, []);

  // Panel 1 handlers
  const addToPanel1 = useCallback((key: SeriesKey, color: string) => {
    setActiveSeries2(prev => prev.find(s => s.key === key) ? prev : [...prev, { key, transform: 'level', color }]);
    setColorIndex2(i => (i + 1) % COLORS.length);
  }, []);
  const removeSeries2 = useCallback((key: SeriesKey) => setActiveSeries2(prev => prev.filter(s => s.key !== key)), []);
  const changeTransform2 = useCallback((key: SeriesKey, t: TransformType) => setActiveSeries2(prev => prev.map(s => s.key === key ? { ...s, transform: t } : s)), []);
  const changeDenominator2 = useCallback((key: SeriesKey, d: SeriesKey) => setActiveSeries2(prev => prev.map(s => s.key === key ? { ...s, denominator: d } : s)), []);
  const transformAll2 = useCallback((t: TransformType) => setActiveSeries2(prev => prev.map(s => ({ ...s, transform: t }))), []);

  const addSeries = useCallback((key: SeriesKey, color: string) => {
    if (focusedPanel === 0) addToPanel0(key, color);
    else addToPanel1(key, color);
  }, [focusedPanel, addToPanel0, addToPanel1]);

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

  const nextColor = COLORS[(focusedPanel === 0 ? colorIndex : colorIndex2) % COLORS.length];
  const activeKeysForSidebar = focusedPanel === 0 ? activeSeries.map(s => s.key) : activeSeries2.map(s => s.key);

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
          {/* Split view controls — desktop + chart tab only */}
          {tab === 'chart' && (
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl border" style={{ borderColor: 'var(--cream-dark)', background: splitMode ? 'var(--cream)' : 'transparent' }}>
              <button
                onClick={() => setSplitMode(m => !m)}
                title={splitMode ? 'Exit split view' : 'Split view'}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: splitMode ? 'var(--navy)' : 'transparent',
                  color: splitMode ? 'white' : 'var(--navy)',
                  opacity: splitMode ? 1 : 0.5,
                }}
              >
                <Columns2 size={13} />
                <span>Split</span>
              </button>
              {splitMode && (
                <>
                  <button
                    onClick={() => setSplitDir('horizontal')}
                    title="Side by side"
                    className="p-1.5 rounded-lg transition-all"
                    style={{
                      background: splitDir === 'horizontal' ? 'var(--coral)' : 'transparent',
                      color: splitDir === 'horizontal' ? 'white' : 'var(--navy)',
                      opacity: splitDir === 'horizontal' ? 1 : 0.4,
                    }}
                  >
                    <Columns2 size={13} />
                  </button>
                  <button
                    onClick={() => setSplitDir('vertical')}
                    title="Stacked"
                    className="p-1.5 rounded-lg transition-all"
                    style={{
                      background: splitDir === 'vertical' ? 'var(--coral)' : 'transparent',
                      color: splitDir === 'vertical' ? 'white' : 'var(--navy)',
                      opacity: splitDir === 'vertical' ? 1 : 0.4,
                    }}
                  >
                    <Rows2 size={13} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile: open sidebar button */}
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
              activeKeys={activeKeysForSidebar}
              nextColor={nextColor}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              splitMode={splitMode}
              focusedPanel={focusedPanel}
              onFocusPanel={setFocusedPanel}
            />

            {/* Chart panels */}
            <div className={`flex flex-1 min-w-0 min-h-0 ${splitMode && splitDir === 'vertical' ? 'flex-col' : 'flex-row'}`}>
              {/* Panel 0 */}
              <div
                className="flex flex-col min-w-0 min-h-0"
                style={{
                  flex: 1,
                  borderRight: splitMode && splitDir === 'horizontal' ? '2px solid var(--cream-dark)' : 'none',
                  borderBottom: splitMode && splitDir === 'vertical' ? '2px solid var(--cream-dark)' : 'none',
                  outline: splitMode && focusedPanel === 0 ? '2px solid var(--coral)' : 'none',
                  outlineOffset: '-2px',
                  minHeight: 0,
                }}
              >
                {splitMode && (
                  <button
                    onClick={() => setFocusedPanel(0)}
                    className="shrink-0 px-3 py-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b"
                    style={{
                      background: focusedPanel === 0 ? 'rgba(232,113,90,0.08)' : 'var(--cream)',
                      borderColor: 'var(--cream-dark)',
                      color: focusedPanel === 0 ? 'var(--coral)' : 'var(--navy)',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: focusedPanel === 0 ? 'var(--coral)' : 'var(--cream-dark)' }} />
                    Panel 1 {focusedPanel === 0 && <span style={{ opacity: 0.6 }}>· adding here</span>}
                    {activeSeries2.length > 0 && focusedPanel !== 0 && (
                      <button
                        onClick={e => { e.stopPropagation(); setActiveSeries([]); }}
                        className="ml-auto opacity-40 hover:opacity-80"
                      >
                        <XIcon size={11} />
                      </button>
                    )}
                  </button>
                )}
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

              {/* Panel 1 — only shown in split mode */}
              {splitMode && (
                <div
                  className="flex flex-col min-w-0 min-h-0"
                  style={{
                    flex: 1,
                    outline: focusedPanel === 1 ? '2px solid var(--coral)' : 'none',
                    outlineOffset: '-2px',
                  }}
                >
                  <button
                    onClick={() => setFocusedPanel(1)}
                    className="shrink-0 px-3 py-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b"
                    style={{
                      background: focusedPanel === 1 ? 'rgba(232,113,90,0.08)' : 'var(--cream)',
                      borderColor: 'var(--cream-dark)',
                      color: focusedPanel === 1 ? 'var(--coral)' : 'var(--navy)',
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: focusedPanel === 1 ? 'var(--coral)' : 'var(--cream-dark)' }} />
                    Panel 2 {focusedPanel === 1 && <span style={{ opacity: 0.6 }}>· adding here</span>}
                  </button>
                  <TransformPanel
                    series={activeSeries2}
                    onTransformChange={changeTransform2}
                    onDenominatorChange={changeDenominator2}
                    onRemove={removeSeries2}
                    onTransformAll={transformAll2}
                  />
                  <DrChart
                    data={chartData2}
                    series={activeSeries2}
                    yearRange={yearRange2}
                    onYearRangeChange={setYearRange2}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 min-h-0">
            <div className="w-full md:w-[420px] shrink-0 md:border-r overflow-hidden flex flex-col" style={{ borderColor: 'var(--cream-dark)', background: 'var(--cream)' }}>
              <LessonsPanel
                onSetChartSeries={setChartSeries}
                activeSeries={activeSeries}
              />
            </div>
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
        {(activeSeries.length > 0 || activeSeries2.length > 0) && (
          <span className="ml-auto text-xs font-bold" style={{ color: 'var(--coral)' }}>
            {splitMode
              ? `${activeSeries.length} + ${activeSeries2.length} series`
              : `${activeSeries.length} series plotted`}
          </span>
        )}
      </footer>
    </div>
  );
}
