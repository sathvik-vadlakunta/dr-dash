import { NextResponse } from 'next/server';

// Revalidate once per day — FRED updates quarterly/annually
export const revalidate = 86400;

const BASE = 'https://api.stlouisfed.org/fred/series/observations';

// Fetch one FRED series — returns empty object on any failure (never throws)
async function fetchFred(
  seriesId: string,
  opts: { aggregation?: 'avg' | 'sum' | 'eop'; units?: string } = {}
): Promise<Record<number, number>> {
  try {
    const key = process.env.FRED_API_KEY;
    if (!key) throw new Error('FRED_API_KEY not set');

    const params = new URLSearchParams({
      series_id: seriesId,
      api_key: key,
      file_type: 'json',
      frequency: 'a',
      ...(opts.aggregation ? { aggregation_method: opts.aggregation } : {}),
      ...(opts.units ? { units: opts.units } : {}),
    });

    const res = await fetch(`${BASE}?${params}`, { next: { revalidate: 86400 } });
    if (!res.ok) {
      console.warn(`FRED ${seriesId}: HTTP ${res.status} — skipping`);
      return {};
    }

    const json = await res.json();
    const out: Record<number, number> = {};
    for (const obs of json.observations ?? []) {
      const yr = new Date(obs.date).getFullYear();
      const val = parseFloat(obs.value);
      if (!isNaN(val) && yr >= 1929) out[yr] = val;
    }
    return out;
  } catch (e) {
    console.warn(`fetchFred error:`, e);
    return {};
  }
}

// FRED series IDs mapped to our data fields
// All fetched in parallel to stay under ~2 seconds total
export async function GET() {
  try {
    const [
      gdpNom,       // Nominal GDP, billions $
      gdpReal,      // Real GDP, billions 2017$
      deflator,     // GDP Deflator (2017=100)
      unrate,       // Unemployment rate %
      lfpr,         // Labor force participation rate %
      pop,          // Population, thousands persons
      laborForce,   // Civilian labor force, thousands
      employed,     // Civilian employed, thousands
      unemployed,   // Unemployed, thousands
      m2,           // M2 money supply, billions $
      fedReceipts,  // Federal receipts, billions $
      fedExpend,    // Federal expenditures, billions $
      fedDebt,      // Federal debt, millions $ → convert to billions
      wage,         // Avg hourly earnings, manufacturing, $/hr
      aaaBond,      // Moody's AAA corporate bond yield %
      medianIncome, // Real median family income, current $ (Census)
      povertyRate,  // Family poverty rate %
      consumption,  // PCE, billions $
      investment,   // Gross private domestic investment, billions $
      govSpend,     // Government consumption & investment, billions $
      exports,      // Exports, billions $
      imports,      // Imports, billions $
    ] = await Promise.all([
      fetchFred('GDP'),
      fetchFred('GDPCA'),
      fetchFred('GDPDEF'),
      fetchFred('UNRATE', { aggregation: 'avg' }),
      fetchFred('CIVPART', { aggregation: 'avg' }),
      fetchFred('B230RC0A052NBEA'),          // annual, already in thousands
      fetchFred('CLF16OV', { aggregation: 'avg' }),
      fetchFred('CE16OV', { aggregation: 'avg' }),
      fetchFred('UNEMPLOY', { aggregation: 'avg' }),
      fetchFred('M2SL', { aggregation: 'avg' }),
      fetchFred('FGRECPT'),
      fetchFred('FGEXPND'),
      fetchFred('GFDEBTN', { aggregation: 'eop' }), // end of period, millions
      fetchFred('CES3000000008', { aggregation: 'avg' }), // mfg hourly earnings
      fetchFred('AAA', { aggregation: 'avg' }),
      fetchFred('MEFAINUSA672N'),
      fetchFred('PPAAUS00000A156NCEN'), // Poverty rate, all people 1989-present
      fetchFred('PCEC'),
      fetchFred('GPDI'),
      fetchFred('GCE'),
      fetchFred('EXPGS'),
      fetchFred('IMPGS'),
    ]);

    // Anchor real GDP to 2024 dollars (FRED uses 2017 base)
    const deflator2017 = deflator[2017] ?? 100;
    const deflator2024 = deflator[2024] ?? 125.2;
    const realbaseRatio = deflator2024 / deflator2017;

    // Collect all years present in any series
    const years = new Set<number>();
    [gdpNom, gdpReal, deflator, unrate].forEach(s => Object.keys(s).forEach(y => years.add(+y)));

    const result: Record<string, Record<string, number | null>> = {};

    for (const yr of Array.from(years).sort((a, b) => a - b)) {
      const gdp = gdpNom[yr] ?? null;
      const rgdp17 = gdpReal[yr] ?? null;
      const defl = deflator[yr] ?? null;
      const popPersons = pop[yr] ? pop[yr] * 1000 : null;

      // Convert real GDP to 2024 dollars
      const rgdp = rgdp17 != null ? rgdp17 * realbaseRatio : null;

      // Per capita real GDP (in dollars, not billions)
      const pcRealGdp = rgdp != null && popPersons ? (rgdp * 1e9) / popPersons : null;

      // GDP components as % of GDP
      const cons = consumption[yr] ?? null;
      const inv = investment[yr] ?? null;
      const gov = govSpend[yr] ?? null;
      const exp = exports[yr] ?? null;
      const imp = imports[yr] ?? null;
      const netExp = exp != null && imp != null ? exp - imp : null;

      const pct = (n: number | null) => n != null && gdp ? (n / gdp) * 100 : null;

      // Inflation: YoY % change in deflator
      const prevDefl = deflator[yr - 1] ?? null;
      const inflation = defl != null && prevDefl != null ? ((defl - prevDefl) / prevDefl) * 100 : null;

      // Real M2 in 2024 dollars
      const m2nom = m2[yr] ?? null;
      const m2real = m2nom != null && defl != null ? m2nom * (deflator2024 / defl) : null;

      // National debt: millions → billions
      const debt = fedDebt[yr] != null ? fedDebt[yr] / 1000 : null;

      // Deficit = expenditures − receipts
      const rec = fedReceipts[yr] ?? null;
      const expend = fedExpend[yr] ?? null;
      const deficit = expend != null && rec != null ? expend - rec : null;

      // GNP-based ratios — FRED's GNP is very close to GDP; use GDP as proxy
      const pctGnp = (n: number | null) => n != null && gdp ? (n / gdp) * 100 : null;

      // Real interest rate
      const bond = aaaBond[yr] ?? null;
      const realRate = bond != null && inflation != null ? bond - inflation : null;

      result[yr.toString()] = {
        nominal_gdp: gdp,
        real_gdp: rgdp,
        pc_real_gdp: pcRealGdp,
        gdp_deflator: defl,
        consumption_pct_gdp: pct(cons),
        investment_pct_gdp: pct(inv),
        gov_pct_gdp: pct(gov),
        net_exports_pct_gdp: pct(netExp),
        inflation_rate: inflation,
        nominal_wage: wage[yr] ?? null,
        aaa_bond_yield: bond,
        real_interest_rate: realRate,
        unemployment_rate: unrate[yr] ?? null,
        labor_force_participation: lfpr[yr] ?? null,
        population: popPersons,
        labor_force: laborForce[yr] ? laborForce[yr] * 1000 : null,
        employment: employed[yr] ? employed[yr] * 1000 : null,
        unemployment: unemployed[yr] ? unemployed[yr] * 1000 : null,
        m2_nominal: m2nom,
        m2_real: m2real,
        m2_velocity: gdp != null && m2nom != null ? gdp / m2nom : null,
        gov_receipts: rec,
        gov_expenditures: expend,
        gov_deficit: deficit,
        national_debt: debt,
        gov_receipts_pct_gnp: pctGnp(rec),
        gov_exp_pct_gnp: pctGnp(expend),
        national_debt_pct_gnp: pctGnp(debt),
        median_family_income: medianIncome[yr] ?? null,
        poverty_rate: povertyRate[yr] ?? null,
        // Income quintile shares not available via FRED API
        income_share_q1: null,
        income_share_q2: null,
        income_share_q3: null,
        income_share_q4: null,
        income_share_q5: null,
      };
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch (err) {
    console.error('FRED fetch error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
