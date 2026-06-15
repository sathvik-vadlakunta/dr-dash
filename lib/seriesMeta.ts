import { SeriesMeta } from '@/types';

export const SERIES_META: SeriesMeta[] = [
  // Output
  { key: 'nominal_gdp', label: 'Nominal GDP', unit: 'Billions of $', category: 'Output', isNominal: true, isLevel: true, description: 'Total value of goods and services produced, in current dollars' },
  { key: 'real_gdp', label: 'Real GDP', unit: 'Billions of 2024 $', category: 'Output', isLevel: true, description: 'GDP adjusted for inflation, in 2024 dollars' },
  { key: 'pc_real_gdp', label: 'Per Capita Real GDP', unit: '2024 $/person', category: 'Output', isLevel: true, description: 'Real GDP divided by population' },
  { key: 'gdp_deflator', label: 'GDP Deflator', unit: 'Price Index', category: 'Output', description: 'Overall price level index (base ≈ 2017)' },
  // GDP Components
  { key: 'consumption_pct_gdp', label: 'Consumption', unit: '% of GDP', category: 'GDP Components', description: 'Personal consumption expenditures as % of GDP' },
  { key: 'investment_pct_gdp', label: 'Investment', unit: '% of GDP', category: 'GDP Components', description: 'Gross private domestic investment as % of GDP' },
  { key: 'gov_pct_gdp', label: 'Government Spending', unit: '% of GDP', category: 'GDP Components', description: 'Government consumption & investment as % of GDP' },
  { key: 'net_exports_pct_gdp', label: 'Net Exports', unit: '% of GDP', category: 'GDP Components', description: 'Exports minus imports as % of GDP' },
  // Prices & Wages
  { key: 'inflation_rate', label: 'Inflation Rate (GDP Deflator)', unit: '% per year', category: 'Prices & Wages', description: 'Annual % change in GDP deflator' },
  { key: 'nominal_wage', label: 'Average Hourly Earnings', unit: '$/hour', category: 'Prices & Wages', isNominal: true, isLevel: true, description: 'Nominal average hourly earnings in manufacturing' },
  { key: 'aaa_bond_yield', label: 'AAA Bond Yield', unit: '% per year', category: 'Prices & Wages', description: 'Nominal interest rate on Aaa corporate bonds' },
  { key: 'real_interest_rate', label: 'Real Interest Rate', unit: '% per year', category: 'Prices & Wages', description: 'AAA bond yield minus inflation rate' },
  // Labor Market
  { key: 'unemployment_rate', label: 'Unemployment Rate', unit: '%', category: 'Labor Market', description: 'Unemployed as % of civilian labor force' },
  { key: 'labor_force_participation', label: 'Labor Force Participation Rate', unit: '%', category: 'Labor Market', description: 'Labor force as % of civilian non-institutional population' },
  { key: 'population', label: 'Population', unit: 'Persons', category: 'Labor Market', isLevel: true, description: 'Total U.S. population' },
  { key: 'labor_force', label: 'Civilian Labor Force', unit: 'Persons', category: 'Labor Market', isLevel: true, description: 'Total civilian labor force' },
  { key: 'employment', label: 'Civilian Employment', unit: 'Persons', category: 'Labor Market', isLevel: true, description: 'Total civilian employed' },
  { key: 'unemployment', label: 'Unemployment (Count)', unit: 'Persons', category: 'Labor Market', isLevel: true, description: 'Total number of unemployed persons' },
  // Money
  { key: 'm2_nominal', label: 'M2 Money Supply (Nominal)', unit: 'Billions of $', category: 'Money', isNominal: true, isLevel: true, description: 'Nominal M2 money supply' },
  { key: 'm2_real', label: 'M2 Money Supply (Real)', unit: 'Billions of 2024 $', category: 'Money', isLevel: true, description: 'Real M2 money supply in 2024 dollars' },
  { key: 'm2_velocity', label: 'M2 Velocity', unit: 'Ratio', category: 'Money', description: 'Nominal GDP divided by M2 money supply' },
  // Government
  { key: 'gov_receipts', label: 'Government Receipts', unit: 'Billions of $', category: 'Government', isNominal: true, isLevel: true, description: 'Total government tax receipts' },
  { key: 'gov_expenditures', label: 'Government Expenditures', unit: 'Billions of $', category: 'Government', isNominal: true, isLevel: true, description: 'Total government spending' },
  { key: 'gov_deficit', label: 'Government Deficit', unit: 'Billions of $', category: 'Government', isNominal: true, isLevel: true, description: 'Government expenditures minus receipts' },
  { key: 'national_debt', label: 'National Debt', unit: 'Billions of $', category: 'Government', isNominal: true, isLevel: true, description: 'Total public debt outstanding' },
  { key: 'gov_receipts_pct_gnp', label: 'Government Receipts (% GNP)', unit: '% of GNP', category: 'Government', description: 'Government receipts as % of GNP' },
  { key: 'gov_exp_pct_gnp', label: 'Government Expenditures (% GNP)', unit: '% of GNP', category: 'Government', description: 'Government expenditures as % of GNP' },
  { key: 'national_debt_pct_gnp', label: 'National Debt (% GNP)', unit: '% of GNP', category: 'Government', description: 'National debt as % of GNP' },
  // Income & Poverty
  { key: 'median_family_income', label: 'Median Family Income', unit: '2023 $', category: 'Income & Poverty', isLevel: true, description: 'Median real family money income in 2023 dollars' },
  { key: 'poverty_rate', label: 'Family Poverty Rate', unit: '%', category: 'Income & Poverty', description: 'Percent of families below poverty threshold' },
  { key: 'income_share_q1', label: 'Income Share: Bottom 20%', unit: '% of income', category: 'Income & Poverty', description: 'Share of household income received by lowest quintile' },
  { key: 'income_share_q2', label: 'Income Share: 2nd Quintile', unit: '% of income', category: 'Income & Poverty', description: 'Share of household income received by second quintile' },
  { key: 'income_share_q3', label: 'Income Share: Middle 20%', unit: '% of income', category: 'Income & Poverty', description: 'Share of household income received by third quintile' },
  { key: 'income_share_q4', label: 'Income Share: 4th Quintile', unit: '% of income', category: 'Income & Poverty', description: 'Share of household income received by fourth quintile' },
  { key: 'income_share_q5', label: 'Income Share: Top 20%', unit: '% of income', category: 'Income & Poverty', description: 'Share of household income received by highest quintile' },
];

export const CATEGORIES = [...new Set(SERIES_META.map(s => s.category))];

export function getSeriesMeta(key: string): SeriesMeta | undefined {
  return SERIES_META.find(s => s.key === key);
}
