export interface YearData {
  nominal_gdp?: number | null;
  nominal_gdp_growth?: number | null;
  real_gdp?: number | null;
  real_gdp_growth?: number | null;
  pc_real_gdp?: number | null;
  pc_real_gdp_growth?: number | null;
  consumption_pct_gdp?: number | null;
  investment_pct_gdp?: number | null;
  gov_pct_gdp?: number | null;
  net_exports_pct_gdp?: number | null;
  gdp_deflator?: number | null;
  inflation_rate?: number | null;
  aaa_bond_yield?: number | null;
  real_interest_rate?: number | null;
  nominal_wage?: number | null;
  nominal_wage_growth?: number | null;
  population?: number | null;
  labor_force?: number | null;
  labor_force_participation?: number | null;
  employment?: number | null;
  unemployment?: number | null;
  unemployment_rate?: number | null;
  m2_nominal?: number | null;
  m2_growth?: number | null;
  m2_real?: number | null;
  m2_velocity?: number | null;
  gov_receipts?: number | null;
  gov_expenditures?: number | null;
  gov_deficit?: number | null;
  national_debt?: number | null;
  gov_receipts_pct_gnp?: number | null;
  gov_exp_pct_gnp?: number | null;
  national_debt_pct_gnp?: number | null;
  median_family_income?: number | null;
  poverty_rate?: number | null;
  income_share_q1?: number | null;
  income_share_q2?: number | null;
  income_share_q3?: number | null;
  income_share_q4?: number | null;
  income_share_q5?: number | null;
}

export type SeriesKey = keyof YearData;

export interface SeriesMeta {
  key: SeriesKey;
  label: string;
  unit: string;
  category: string;
  isNominal?: boolean;
  isLevel?: boolean;
  description?: string;
}

export type TransformType =
  | 'level'
  | 'growth_rate'
  | 'per_capita'
  | 'real'
  | 'real_growth'
  | 'pc_real'
  | 'pct_of';

export interface ActiveSeries {
  key: SeriesKey;
  transform: TransformType;
  denominator?: SeriesKey;
  color: string;
}

export interface ChartDataPoint {
  year: number;
  [key: string]: number | null | undefined;
}
