import { YearData, SeriesKey, TransformType } from '@/types';

type DataMap = Record<string, YearData>;

function getSortedYears(data: DataMap): number[] {
  return Object.keys(data).map(Number).sort((a, b) => a - b);
}

function getValues(data: DataMap, key: SeriesKey): Array<{ year: number; value: number | null }> {
  return getSortedYears(data).map(year => ({
    year,
    value: (data[year][key] ?? null) as number | null,
  }));
}

export function applyTransform(
  data: DataMap,
  key: SeriesKey,
  transform: TransformType,
  denominator?: SeriesKey
): Array<{ year: number; value: number | null }> {
  const raw = getValues(data, key);

  if (transform === 'level') {
    return raw;
  }

  if (transform === 'growth_rate') {
    return raw.map((point, i) => {
      if (i === 0 || raw[i - 1].value == null || point.value == null || raw[i - 1].value === 0) {
        return { year: point.year, value: null };
      }
      return { year: point.year, value: ((point.value - raw[i - 1].value!) / Math.abs(raw[i - 1].value!)) * 100 };
    });
  }

  if (transform === 'per_capita') {
    const pop = getValues(data, 'population');
    const popMap = Object.fromEntries(pop.map(p => [p.year, p.value]));
    return raw.map(point => {
      const p = popMap[point.year];
      if (point.value == null || !p) return { year: point.year, value: null };
      return { year: point.year, value: point.value / p };
    });
  }

  if (transform === 'real') {
    const deflators = getValues(data, 'gdp_deflator');
    const deflMap = Object.fromEntries(deflators.map(d => [d.year, d.value]));
    const base2024 = deflMap[2024] ?? 125.2;
    return raw.map(point => {
      const defl = deflMap[point.year];
      if (point.value == null || !defl) return { year: point.year, value: null };
      return { year: point.year, value: point.value * (base2024 / defl) };
    });
  }

  if (transform === 'real_growth') {
    const realSeries = applyTransform(data, key, 'real');
    return realSeries.map((point, i) => {
      if (i === 0 || realSeries[i - 1].value == null || point.value == null || realSeries[i - 1].value === 0) {
        return { year: point.year, value: null };
      }
      return { year: point.year, value: ((point.value - realSeries[i - 1].value!) / Math.abs(realSeries[i - 1].value!)) * 100 };
    });
  }

  if (transform === 'pc_real') {
    const realSeries = applyTransform(data, key, 'real');
    const pop = getValues(data, 'population');
    const popMap = Object.fromEntries(pop.map(p => [p.year, p.value]));
    return realSeries.map(point => {
      const p = popMap[point.year];
      if (point.value == null || !p) return { year: point.year, value: null };
      return { year: point.year, value: point.value / p };
    });
  }

  if (transform === 'pct_of' && denominator) {
    const denom = getValues(data, denominator);
    const denomMap = Object.fromEntries(denom.map(d => [d.year, d.value]));
    return raw.map(point => {
      const d = denomMap[point.year];
      if (point.value == null || !d || d === 0) return { year: point.year, value: null };
      return { year: point.year, value: (point.value / d) * 100 };
    });
  }

  return raw;
}

export function getTransformLabel(transform: TransformType, denominator?: string): string {
  switch (transform) {
    case 'level': return 'Level';
    case 'growth_rate': return 'Growth Rate (%)';
    case 'per_capita': return 'Per Capita';
    case 'real': return 'Real (2024 $)';
    case 'real_growth': return 'Real Growth Rate (%)';
    case 'pc_real': return 'Per Capita Real (2024 $)';
    case 'pct_of': return `% of ${denominator ?? 'Series'}`;
  }
}

export function getTransformedUnit(baseUnit: string, transform: TransformType, denomLabel?: string): string {
  switch (transform) {
    case 'level': return baseUnit;
    case 'growth_rate': return '% per year';
    case 'per_capita': return `${baseUnit} / person`;
    case 'real': return '2024 $';
    case 'real_growth': return '% per year';
    case 'pc_real': return '2024 $ / person';
    case 'pct_of': return `% of ${denomLabel ?? ''}`;
  }
}
