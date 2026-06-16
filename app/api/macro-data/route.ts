import { NextResponse } from 'next/server';

// Revalidate once per day — FRED updates quarterly/annually
export const revalidate = 86400;

const BASE = 'https://api.stlouisfed.org/fred/series/observations';

// Census Historical Income Table H-2 — household income quintile shares (% of aggregate income)
// Bundled statically; no API provides this data. Source: U.S. Census Bureau.
const QUINTILE_SHARES: Record<number, [number,number,number,number,number]> = {
  1947:[5.0,11.9,17.0,23.1,43.0],1948:[4.9,12.1,17.3,23.2,42.4],1949:[4.5,11.9,17.3,23.5,42.7],
  1950:[4.5,12.0,17.4,23.4,42.7],1951:[5.0,12.4,17.6,23.4,41.6],1952:[4.9,12.3,17.4,23.4,41.9],
  1953:[4.7,12.5,18.0,23.9,40.9],1954:[4.5,12.1,17.7,23.9,41.8],1955:[4.8,12.3,17.8,23.7,41.3],
  1956:[5.0,12.5,17.9,23.7,41.0],1957:[5.1,12.7,18.1,23.8,40.4],1958:[5.0,12.5,18.0,23.9,40.6],
  1959:[4.9,12.3,17.9,23.8,41.1],1960:[4.8,12.2,17.8,24.0,41.3],1961:[4.7,11.9,17.5,23.8,42.2],
  1962:[5.0,12.1,17.6,24.0,41.3],1963:[5.0,12.1,17.7,24.0,41.2],1964:[5.1,12.0,17.7,24.0,41.2],
  1965:[5.2,12.2,17.8,23.9,40.9],1966:[5.6,12.4,17.8,23.8,40.5],1967:[4.0,10.8,17.3,24.2,43.6],
  1968:[4.2,11.1,17.6,24.5,42.6],1969:[4.1,10.9,17.5,24.5,43.0],1970:[4.1,10.8,17.4,24.5,43.3],
  1971:[4.1,10.6,17.3,24.5,43.5],1972:[4.1,10.4,17.0,24.5,43.9],1973:[4.2,10.4,17.0,24.5,43.9],
  1974:[4.3,10.6,17.0,24.6,43.5],1975:[4.3,10.4,17.0,24.7,43.6],1976:[4.3,10.3,17.0,24.7,43.7],
  1977:[4.2,10.2,16.9,24.7,44.0],1978:[4.2,10.2,16.8,24.7,44.1],1979:[4.1,10.2,16.8,24.6,44.2],
  1980:[4.2,10.2,16.8,24.7,44.1],1981:[4.1,10.1,16.7,24.8,44.3],1982:[4.0,10.0,16.5,24.5,45.0],
  1983:[4.0,9.9,16.4,24.6,45.1],1984:[4.0,9.9,16.3,24.6,45.2],1985:[3.9,9.8,16.2,24.4,45.6],
  1986:[3.8,9.7,16.2,24.3,46.1],1987:[3.8,9.6,16.1,24.3,46.2],1988:[3.8,9.6,16.0,24.2,46.3],
  1989:[3.8,9.5,15.8,24.0,46.8],1990:[3.8,9.6,15.9,24.0,46.6],1991:[3.8,9.6,15.9,24.2,46.5],
  1992:[3.8,9.4,15.8,24.2,46.9],1993:[3.6,9.0,15.1,23.5,48.9],1994:[3.6,8.9,15.0,23.4,49.1],
  1995:[3.7,9.1,15.2,23.3,48.7],1996:[3.6,9.0,15.1,23.3,49.0],1997:[3.6,8.9,15.0,23.2,49.4],
  1998:[3.6,9.0,15.0,23.2,49.2],1999:[3.6,8.9,14.9,23.2,49.4],2000:[3.6,8.9,14.8,23.0,49.8],
  2001:[3.5,8.7,14.6,23.0,50.1],2002:[3.5,8.8,14.8,23.3,49.7],2003:[3.4,8.7,14.8,23.4,49.8],
  2004:[3.4,8.7,14.7,23.2,50.1],2005:[3.4,8.6,14.6,23.0,50.4],2006:[3.4,8.6,14.5,22.9,50.5],
  2007:[3.4,8.7,14.8,23.4,49.7],2008:[3.4,8.6,14.7,23.3,50.0],2009:[3.4,8.6,14.6,23.2,50.3],
  2010:[3.3,8.5,14.6,23.4,50.3],2011:[3.2,8.4,14.3,23.0,51.1],2012:[3.2,8.3,14.4,23.0,51.0],
  2013:[3.2,8.4,14.4,23.0,51.0],2014:[3.1,8.2,14.3,23.2,51.2],2015:[3.1,8.2,14.3,23.2,51.1],
  2016:[3.1,8.3,14.2,22.9,51.5],2017:[3.1,8.2,14.3,23.0,51.5],2018:[3.1,8.3,14.1,22.6,52.0],
  2020:[3.1,8.3,14.1,22.8,51.8],2021:[3.1,8.3,14.1,22.9,51.7],2022:[3.1,8.3,14.1,23.0,51.6],
  2023:[3.1,8.3,14.2,23.0,51.5],
};

// Census histpov2: family poverty rate back to 1959 (FRED only has 1989+)
async function fetchCensusPoverty(): Promise<Record<number, number>> {
  try {
    const key = process.env.CENSUS_API_KEY;
    if (!key) return {};
    const url = `https://api.census.gov/data/timeseries/poverty/histpov2?get=YEAR,PCTFAMPOV&for=us:1&key=${key}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) { console.warn(`Census histpov2: HTTP ${res.status} — skipping`); return {}; }
    const rows: string[][] = await res.json();
    const headers = rows[0];
    const yearIdx = headers.indexOf('YEAR');
    const pctIdx = headers.indexOf('PCTFAMPOV');
    if (yearIdx === -1 || pctIdx === -1) return {};
    const out: Record<number, number> = {};
    for (const row of rows.slice(1)) {
      const yr = parseInt(row[yearIdx], 10);
      const val = parseFloat(row[pctIdx]);
      if (!isNaN(yr) && !isNaN(val)) out[yr] = val;
    }
    return out;
  } catch (e) {
    console.warn('fetchCensusPoverty error:', e);
    return {};
  }
}

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
      povertyRate,  // Family poverty rate % (FRED, 1989+)
      consumption,  // PCE, billions $
      investment,   // Gross private domestic investment, billions $
      govSpend,     // Government consumption & investment, billions $
      exports,      // Exports, billions $
      imports,      // Imports, billions $
      censusPoverty, // Census family poverty rate 1959-present
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
      fetchCensusPoverty(),
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
        poverty_rate: censusPoverty[yr] ?? povertyRate[yr] ?? null,
        income_share_q1: QUINTILE_SHARES[yr]?.[0] ?? null,
        income_share_q2: QUINTILE_SHARES[yr]?.[1] ?? null,
        income_share_q3: QUINTILE_SHARES[yr]?.[2] ?? null,
        income_share_q4: QUINTILE_SHARES[yr]?.[3] ?? null,
        income_share_q5: QUINTILE_SHARES[yr]?.[4] ?? null,
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
