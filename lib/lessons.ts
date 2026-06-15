import { SeriesKey, TransformType } from '@/types';

export interface ConceptSlide {
  type: 'concept';
  title: string;
  body: string[];
  highlight?: string;
  analogy?: string;
  keyPoints?: string[];
}

export interface ChartSlide {
  type: 'chart';
  title: string;
  context: string;
  autoPlot: { series: SeriesKey; transform: TransformType }[];
  watch: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizSlide {
  type: 'quiz';
  questions: QuizQuestion[];
}

export type Slide = ConceptSlide | ChartSlide | QuizSlide;

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  duration: string;
  color: string;
  slides: Slide[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'nominal-vs-real',
    title: 'GDP: Why the Raw Number Lies',
    subtitle: 'Nominal vs. Real GDP',
    emoji: '📈',
    duration: '~15 min',
    color: 'coral',
    slides: [
      {
        type: 'concept',
        title: 'What Is GDP?',
        body: [
          'Every country keeps score of its economy. The most important number on that scoreboard is GDP — Gross Domestic Product. It\'s the total dollar value of everything an economy produces in a year: cars, haircuts, software, sandwiches — if it was made inside the United States, it counts.',
          'In 2024, the U.S. produced $29.2 trillion worth of goods and services. That\'s roughly $85,784 for every single American.',
        ],
        highlight: '💡 One number. One year. The entire U.S. economy.',
        analogy: '📦 Think of GDP like a company\'s annual revenue. Just as a business\'s revenue tells you how much it sold, GDP tells you how much the whole economy produced.',
        keyPoints: [
          'GDP = total value of all goods and services produced within a country in one year',
          'Includes everything: goods, services, business output, government output',
          'It\'s the single most widely used measure of economic size',
        ],
      },
      {
        type: 'concept',
        title: 'The Problem with "Nominal" GDP',
        body: [
          'When GDP is first measured, it uses current-year prices — the prices at the time of measurement. This is called Nominal GDP. It sounds straightforward, but it hides a major problem.',
          'Prices change every year due to inflation. So when nominal GDP goes up, you can\'t tell if it\'s because the economy actually produced more stuff — or just because prices got higher.',
          'In 1929, U.S. GDP was $105 billion. In 2024, it was $29,185 billion — 278 times larger. Did the economy really produce 278 times more goods and services? Not even close.',
        ],
        highlight: '⚠️ Nominal GDP mixes two things: real output changes AND price changes. You can\'t separate them without an extra step.',
        keyPoints: [
          'Nominal = measured in current-year dollar prices',
          'Prices change over time due to inflation',
          'Comparing nominal values across different years is misleading',
        ],
      },
      {
        type: 'chart',
        title: 'Watch Nominal GDP Skyrocket',
        context: 'Below is Nominal GDP since 1929. Notice something suspicious: the line almost never goes down, even during massive recessions like 2009 and 2020.',
        autoPlot: [{ series: 'nominal_gdp', transform: 'level' }],
        watch: [
          'The curve rises steeply and almost never falls — even during recessions',
          'Look at 2020 (COVID-19): nominal GDP barely dips, then rockets up in 2021',
          'If this showed pure real output, we\'d expect clear drops during bad years',
          'This "too perfect" growth is a red flag that inflation is propping up the numbers',
        ],
      },
      {
        type: 'concept',
        title: 'Real GDP: The Inflation-Adjusted Version',
        body: [
          'To fix the problem, economists "adjust for inflation." They pick one year as a benchmark — called the base year — and restate all past GDPs as if that year\'s prices had always applied. The result is called Real GDP.',
          'We use 2024 as the base year. So every Real GDP figure you see is in "2024 dollars" — the same measuring stick applied to every year from 1929 to today.',
          'This lets you finally compare apples to apples: was the economy actually producing more in 1950 than 1929? Now you can see clearly.',
        ],
        highlight: '🔑 Real GDP strips out the distortion of rising prices and shows only changes in actual output.',
        keyPoints: [
          'Real GDP uses a fixed base year (2024) so all values are comparable',
          'All figures expressed in "2024 dollars" — same measuring stick throughout history',
          'Real GDP can and does fall during recessions — nominal almost never does',
          'Formula: Real GDP = Nominal GDP ÷ Price Level × 100',
        ],
      },
      {
        type: 'chart',
        title: 'Real vs. Nominal GDP Side by Side',
        context: 'Now both series are plotted. The gap between them is the cumulative distortion of 95 years of inflation.',
        autoPlot: [
          { series: 'nominal_gdp', transform: 'level' },
          { series: 'real_gdp', transform: 'level' },
        ],
        watch: [
          'Real GDP grows much more slowly — the difference between the lines is inflation',
          'Real GDP actually falls in the Great Depression (1929–33), 2009, and 2020',
          'Nominal barely registers those recessions — inflation masks the damage',
          'In 2024, the two lines meet: because 2024 is the base year, nominal = real',
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: 'Which of the following best describes Gross Domestic Product (GDP)?',
            options: [
              'The total profits earned by U.S. corporations in a year',
              'The total dollar value of all goods and services produced within the U.S. in a year',
              'The total amount of money the government collects in taxes',
              'The value of all U.S. exports sold to other countries',
            ],
            correct: 1,
            explanation: 'GDP measures the total output of the entire economy — every car manufactured, every haircut given, every software subscription sold. It includes production by all businesses, households, and government within U.S. borders, regardless of who owns those businesses.',
          },
          {
            question: 'What makes Nominal GDP misleading when comparing the economy across different years?',
            options: [
              'It only measures goods, not services',
              'It excludes government spending',
              'It\'s measured in current-year prices, so inflation makes it grow even if real output doesn\'t',
              'It counts imports as well as exports',
            ],
            correct: 2,
            explanation: 'Nominal GDP uses the prices at the time of measurement. If prices double and output stays exactly the same, nominal GDP doubles — suggesting the economy doubled when it didn\'t. Real GDP fixes this by using a fixed base year\'s prices for all years.',
          },
          {
            question: 'In 2024, nominal GDP grew 5.3% and inflation was 2.4%. What was the approximate real GDP growth rate?',
            options: [
              '7.7% — add nominal growth and inflation together',
              '5.3% — nominal and real are the same measurement',
              '2.9% — subtract inflation from nominal growth',
              '2.4% — real growth always equals the inflation rate',
            ],
            correct: 2,
            explanation: 'Real Growth ≈ Nominal Growth − Inflation = 5.3% − 2.4% = 2.9%. The actual reported figure was 2.8% (a tiny rounding difference from compounding). This formula lets you decompose any nominal growth figure: the part above inflation is real output growth, the rest is just rising prices.',
          },
          {
            question: 'Nominal GDP rose from $105 billion (1929) to $29,185 billion (2024) — about 278 times larger. What can you conclude?',
            options: [
              'Americans are 278 times wealthier than in 1929',
              'The economy produced 278 times more goods and services',
              'The dollar value of output grew 278 times, but some reflects inflation — not real growth',
              'U.S. population grew 278 times',
            ],
            correct: 2,
            explanation: 'Nominal GDP of 278x includes 95 years of accumulated inflation averaging 2.84%/year. In real terms (2024 dollars), real GDP only grew about 19.6x — still remarkable, but very different from 278x. Population also grew roughly 3x, so even per-person real gains were much less than 278x.',
          },
          {
            question: 'Why does Nominal GDP barely fall even during major recessions like 2009 or 2020?',
            options: [
              'Recessions don\'t actually reduce economic output — they\'re just a media narrative',
              'Inflation keeps prices and thus nominal values rising even as real production falls',
              'The government adds extra spending during recessions that fully offsets the fall',
              'GDP calculations are changed during recessions to smooth out the numbers',
            ],
            correct: 1,
            explanation: 'During a recession, real output falls — but prices don\'t usually fall at the same speed. Inflation keeps nominal values propped up even as the real economy contracts. This is why Real GDP shows clear drops in 2009 and 2020 while Nominal GDP barely dips. Nominal hides the damage; real reveals it.',
          },
          {
            question: 'The GDP Deflator was about 12.8 in 1929 and 125.2 in 2024. A house that cost $50,000 in 1929 would cost approximately how much in 2024 dollars?',
            options: [
              '$62,600 (multiply by 1.252)',
              '$488,000 (multiply by 125.2 ÷ 12.8 ≈ 9.78)',
              '$6,400 (multiply by 12.8 ÷ 100)',
              '$640,000 (multiply by 125.2 directly)',
            ],
            correct: 1,
            explanation: 'To convert 1929 dollars to 2024 dollars, multiply by (deflator₂₀₂₄ ÷ deflator₁₉₂₉) = 125.2 ÷ 12.8 ≈ 9.78. So $50,000 × 9.78 ≈ $489,000. This is why "this house sold for $15,000 in 1950!" sounds cheap but isn\'t — old dollars bought dramatically more than today\'s dollars.',
          },
          {
            question: 'Real GDP grew 3.18%/year on average from 1929–2024. Nominal GDP grew 6.11%/year. What explains the ~2.93% gap between them?',
            options: [
              'Population growth accounted for the extra nominal gains',
              'Inflation — prices rose about 2.84% per year on average, which shows up in nominal but not real GDP',
              'Government spending grew faster than private sector output',
              'Exports became increasingly important, adding to nominal GDP',
            ],
            correct: 1,
            explanation: 'The fundamental identity: Nominal Growth = Real Growth + Inflation. So 6.11% ≈ 3.18% + 2.84%. The ~2.84% average inflation rate is the "price tax" embedded in every nominal GDP growth figure. Every dollar of nominal growth that exceeds real growth is rising prices, not rising output.',
          },
        ],
      },
    ],
  },

  {
    id: 'per-capita',
    title: 'Divide by Everyone',
    subtitle: 'The Per Capita Transformation',
    emoji: '👤',
    duration: '~13 min',
    color: 'teal',
    slides: [
      {
        type: 'concept',
        title: 'Bigger Isn\'t Always Better',
        body: [
          'Imagine two restaurants. Restaurant A does $1 million in sales with 5 employees. Restaurant B also hits $1 million — but with 100 employees. Which is more productive? Obviously A: each employee generates $200K, while B\'s generate only $10K each.',
          'Countries work the same way. A country\'s total GDP matters less than its GDP per person — because people, not governments, experience the economy.',
        ],
        highlight: '💡 The U.S. and China had similar total GDPs in recent years. But U.S. per capita GDP (~$85,784) was about 6x China\'s (~$13,000). Same total — completely different individual experience.',
        analogy: '🍕 If a pizza gets bigger but there are also more people at the table, your individual slice might actually be smaller. GDP is the pizza. Per capita GDP is your slice.',
      },
      {
        type: 'concept',
        title: 'What "Per Capita" Means',
        body: [
          '"Per capita" means "per head" in Latin — it\'s simply dividing a total by the number of people. Per Capita Real GDP = Total Real GDP ÷ Population.',
          'This tells us the output that would belong to each person if production were divided equally. It\'s not claiming that\'s how wealth is distributed — it\'s a standardizing tool that lets us fairly compare economies of different sizes across time.',
          'U.S. population grew from 122 million (1929) to 340 million (2024) — nearly 3x. Ignoring this massively overstates how much individual living standards improved.',
        ],
        highlight: '🧮 Per Capita Real GDP: $12,239 in 1929 → $85,784 in 2024. A 7x increase in individual living standards. Total Real GDP grew 19.6x. The difference is population growth.',
        keyPoints: [
          'Per Capita = total value ÷ population',
          'Adjusts for the fact that more people need more total output just to stay level',
          'The most honest comparison of individual living standards across time',
          'Population grew ~3x since 1929, "absorbing" much of total GDP growth',
        ],
      },
      {
        type: 'chart',
        title: 'Total Real GDP vs. Per Capita Real GDP',
        context: 'Both series plotted together. They start close and then diverge — because population kept growing while being divided into the total.',
        autoPlot: [
          { series: 'real_gdp', transform: 'level' },
          { series: 'pc_real_gdp', transform: 'level' },
        ],
        watch: [
          'Total Real GDP grew ~19.6x from 1929 to 2024',
          'Per Capita Real GDP only grew ~7x over the same period',
          'The divergence is entirely explained by population growth (~2.79x)',
          'Math check: 19.6 ÷ 2.79 ≈ 7.0 — it balances perfectly',
        ],
      },
      {
        type: 'chart',
        title: 'How Fast Are Living Standards Growing?',
        context: 'Now the annual growth rate of Per Capita Real GDP. This shows year-to-year changes in individual living standards.',
        autoPlot: [{ series: 'pc_real_gdp', transform: 'growth_rate' }],
        watch: [
          'Average growth: about 2.07% per year over 95 years',
          'That sounds modest — but it compounds. At 2%/year, living standards double every 35 years',
          'The Great Depression (1929–33): per capita living standards fell ~25% — a catastrophe',
          'COVID 2020: sharp drop, but back to normal within one year',
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: 'What does "per capita" mean, and how is Per Capita GDP calculated?',
            options: [
              '"Per year" — GDP divided by the number of years measured',
              '"Per head" — Total GDP divided by the population',
              '"Per dollar" — GDP adjusted for inflation using a price index',
              '"Per household" — GDP divided by the number of families',
            ],
            correct: 1,
            explanation: 'From Latin, "per capita" means "per head." Per Capita GDP = Total GDP ÷ Population. It converts an economy-wide total into a per-person figure, making it possible to compare living standards across countries and across time periods without being fooled by differences in total population size.',
          },
          {
            question: 'In 2024, U.S. Real GDP was $29,185 billion and population was 340.2 million people. What was per capita real GDP?',
            options: [
              'About $8,579 per person',
              'About $85,784 per person',
              'About $857,840 per person',
              'About $29,185 per person',
            ],
            correct: 1,
            explanation: '$29,185 billion ÷ 340.2 million = $29,185,000 million ÷ 340,200,000 people ≈ $85,784 per person. This is exactly the reported 2024 figure. The trick is keeping track of units: $29,185B means $29,185,000,000,000 total, divided by 340,200,000 people.',
          },
          {
            question: 'Total Real GDP grew 19.6x from 1929 to 2024. Per Capita Real GDP grew 7x. Population grew 2.79x. Which equation correctly connects these?',
            options: [
              '7 + 2.79 = 19.6 (they add up)',
              '7 × 2.79 ≈ 19.6 (they multiply)',
              '19.6 − 7 = 2.79 (they subtract)',
              '19.6 + 7 = 2.79 (the smaller two combine)',
            ],
            correct: 1,
            explanation: '7 × 2.79 ≈ 19.53 ≈ 19.6 ✓ — and equivalently, 19.6 ÷ 2.79 ≈ 7.0 ✓. Per capita = total ÷ population, so total = per capita × population. The growth factors multiply/divide the same way the values do. This is always the check: (per capita growth) × (population growth) = (total growth).',
          },
          {
            question: 'Per capita real GDP has grown at 2.07% per year since 1929. Using the Rule of 70 (doubling time ≈ 70 ÷ growth rate), how long does it take for living standards to double?',
            options: [
              'About 14 years (70 ÷ 5%)',
              'About 22 years (70 ÷ 3.18%, using total real GDP growth)',
              'About 34 years (70 ÷ 2.07%)',
              'About 70 years (the rule gives the answer directly)',
            ],
            correct: 2,
            explanation: '70 ÷ 2.07 ≈ 33.8 years — roughly one generation. This is why economists obsess over growth rates. The difference between 2% and 3% per year seems trivial, but at 3% living standards double every 23 years vs. 34 years at 2%. Over a century, that gap compounds into dramatically different societies.',
          },
          {
            question: 'Country A has a population of 10 million and Total GDP of $500 billion. Country B has a population of 200 million and Total GDP of $5 trillion. Which country has higher per capita GDP?',
            options: [
              'Country B, because its total GDP is 10 times larger',
              'Country A, with $50,000 per capita vs. Country B\'s $25,000 per capita',
              'They\'re equal, since both have the same debt-to-GDP ratio',
              'Cannot be determined without knowing the inflation rate',
            ],
            correct: 1,
            explanation: 'Country A: $500B ÷ 10M = $50,000 per person. Country B: $5,000B ÷ 200M = $25,000 per person. Country A\'s citizens are twice as rich on average, even though Country B\'s economy is 10x larger in total. This is exactly why per capita matters more than total for comparing living standards.',
          },
          {
            question: 'Why do economists prefer Per Capita Real GDP over Nominal GDP when measuring how living standards have changed over time?',
            options: [
              'Nominal GDP is harder to calculate, so economists avoid it when possible',
              'Real GDP alone is sufficient — there is no need to also adjust for population',
              'Per capita real GDP adjusts for both inflation (real) and population growth (per capita), giving the truest picture of individual living standards',
              'It\'s just a convention — all three measures give essentially the same answer',
            ],
            correct: 2,
            explanation: 'Two separate adjustments are needed: (1) The "real" part removes inflation so you\'re comparing the same purchasing power across time. (2) The "per capita" part removes population growth so you\'re comparing per-person output, not total output. Skipping either one significantly distorts the picture. Per capita real GDP does both at once.',
          },
          {
            question: 'In the Great Depression (1929–33), per capita real GDP fell about 25% and took a decade to recover. In COVID (2020), it fell about 5% and recovered within one year. What does this comparison reveal?',
            options: [
              'COVID was actually worse because it happened more recently',
              'The Great Depression was far more severe — deeper drop, far longer recovery',
              'Per capita GDP is the wrong measure for comparing recessions',
              'Both recessions were essentially the same in economic terms',
            ],
            correct: 1,
            explanation: 'The Great Depression caused a ~25% decline in per capita living standards sustained over several years — a complete economic collapse. COVID caused a ~5% drop that fully reversed within 12 months. Both the depth and the duration matter when comparing recessions. The Depression was categorically more destructive by every measure.',
          },
        ],
      },
    ],
  },

  {
    id: 'inflation',
    title: 'The Price of Everything',
    subtitle: 'Measuring and Understanding Inflation',
    emoji: '💰',
    duration: '~14 min',
    color: 'coral',
    slides: [
      {
        type: 'concept',
        title: 'What Inflation Actually Is',
        body: [
          'Inflation is the rate at which prices across the economy rise. When inflation is 2%, a basket of goods and services that cost $100 last year costs $102 this year. Your dollar buys slightly less.',
          'This sounds harmless at first. But it compounds. At 2.84% per year (the U.S. average since 1929), prices double every 25 years. Something that cost $1.00 in 1929 costs about $18-19 today.',
        ],
        highlight: '📊 U.S. inflation rate in 2024: 2.4%. Historical average since 1929: 2.84% per year. Federal Reserve target: 2%.',
        analogy: '🪣 Think of inflation like a leaky bucket. Your salary might grow 5%, but if prices grow 3%, your real raise is only 2%. Inflation silently drained the rest.',
        keyPoints: [
          'Inflation = % change in the overall price level from year to year',
          'Measured using price indices like the GDP Deflator',
          'At 2.84%/year average, U.S. prices have doubled every ~25 years',
          'Deflation (negative inflation) is often more dangerous than mild inflation',
        ],
      },
      {
        type: 'chart',
        title: 'A Century of Inflation',
        context: 'The annual inflation rate (GDP Deflator) since 1929. Every major economic event in U.S. history is visible in this one chart.',
        autoPlot: [{ series: 'inflation_rate', transform: 'level' }],
        watch: [
          'Early 1930s: NEGATIVE inflation (deflation) — prices actually fell during the Great Depression',
          'WWII (1941–43): inflation spiked sharply as wartime spending pushed demand beyond capacity',
          '1970s "Great Inflation": peaked above 9% — the most serious peacetime inflation crisis in U.S. history',
          '2021–22: post-COVID spike, then falling back toward the Fed\'s 2% target by 2024',
        ],
      },
      {
        type: 'concept',
        title: 'Inflation\'s Hidden Tax on Wages',
        body: [
          'Inflation doesn\'t just affect grocery prices — it affects every dollar amount measured over time, including your paycheck.',
          'A nominal wage is just the dollar amount you\'re paid. A real wage adjusts that amount for inflation — it tells you what your paycheck actually buys. Real wages are what matter for living standards.',
          'U.S. manufacturing workers earned about $0.57/hour in 1929. By 2024, that figure was $27.78/hour — a 49x increase in nominal terms. But in 2024 dollars, the 1929 wage was only about $5.60/hour. Real wages grew about 5x, not 49x.',
        ],
        highlight: '⚠️ Nominal wages rose 49x since 1929. Real wages rose only about 5x. The difference — 44x — is pure inflation. Nominal growth always overstates real gains.',
        keyPoints: [
          'Nominal wage = dollar amount paid, not adjusted for inflation',
          'Real wage = nominal wage adjusted for inflation (actual purchasing power)',
          'Real wages can fall even when nominal wages rise — if inflation rises faster',
          'This happened in the 1970s: nominal wages rose, but inflation rose faster',
        ],
      },
      {
        type: 'chart',
        title: 'Nominal vs. Real Wages',
        context: 'Average hourly earnings plotted two ways: the reported nominal figure, and adjusted to 2024 purchasing power.',
        autoPlot: [
          { series: 'nominal_wage', transform: 'level' },
          { series: 'nominal_wage', transform: 'real' },
        ],
        watch: [
          'Nominal wages climb steeply — but most of that steepness is inflation, not real gains',
          'Real wages (2024 dollars) show a much quieter, slower story',
          'In the 1970s: nominal wages rose rapidly but real wages barely moved — inflation consumed the gains',
          'The gap between the two lines at any year = cumulative inflation since 1929',
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: 'An inflation rate of 3% means:',
            options: [
              'The government printed 3% more money this year',
              'Prices for a typical basket of goods and services rose 3% on average',
              'Real GDP fell by 3%',
              'The value of the U.S. dollar increased by 3% internationally',
            ],
            correct: 1,
            explanation: 'Inflation measures the rate of change in the overall price level. At 3% inflation, something costing $100 last year costs $103 this year. It doesn\'t affect all goods equally — some rise more, some less — but the average across a representative basket rose 3%. It says nothing directly about money printing or GDP.',
          },
          {
            question: 'The historical U.S. inflation rate has averaged 2.84% per year since 1929. Using the Rule of 70 (doubling time ≈ 70 ÷ rate), how long does it take for prices to double?',
            options: [
              'About 12 years',
              'About 25 years',
              'About 35 years',
              'About 50 years',
            ],
            correct: 1,
            explanation: '70 ÷ 2.84 ≈ 24.6 years — roughly 25 years. This means prices roughly doubled from 1999 to 2024, from 1974 to 1999, and so on. Something costing $1.00 in 1929 costs about $18–19 today — roughly 4 doublings over 95 years (every ~25 years: 1×2×2×2×2 = 16x, adjusted for timing ≈ 18–19x).',
          },
          {
            question: 'During the Great Depression (1930–33), prices actually fell — deflation. Why is deflation harmful?',
            options: [
              'Lower prices are always good, so deflation can\'t really be harmful',
              'Deflation makes exports more expensive for foreign buyers',
              'Falling prices increase the real burden of existing debts, causing defaults and bank failures',
              'Deflation only affects government bonds, not private citizens',
            ],
            correct: 2,
            explanation: 'When prices fall, the real value of existing debts rises. A farmer who borrowed $10,000 now must sell more crops (at lower prices) to earn $10,000. This triggers defaults, which cause bank failures, which cause more deflation — a vicious spiral. This debt-deflation cycle catastrophically worsened the Great Depression.',
          },
          {
            question: 'Average hourly earnings were $7.15 in 1980 (GDP Deflator: 39.4) and $27.78 in 2024 (Deflator: 125.2). What were 1980 wages worth in 2024 dollars?',
            options: [
              '$7.15 — the nominal wage is already the real wage',
              '$22.72 — multiply $7.15 by (125.2 ÷ 39.4)',
              '$2.25 — divide $7.15 by (125.2 ÷ 39.4)',
              '$87.50 — multiply $7.15 by 12.52',
            ],
            correct: 1,
            explanation: 'Real wage = Nominal × (Base year deflator ÷ Period deflator) = $7.15 × (125.2 ÷ 39.4) = $7.15 × 3.178 ≈ $22.72. So real wages only grew from ~$22.72 to $27.78 from 1980 to 2024 — about 22% over 44 years, or ~0.5%/year. Nominal wages grew 288% over the same period — inflation consumed almost all of it.',
          },
          {
            question: 'Your salary increases 4% this year. Inflation is 6%. What happened to your real purchasing power?',
            options: [
              'It increased by 10% — add the salary growth and inflation',
              'It increased by 4% — your raise is your raise regardless of inflation',
              'It decreased by about 2% — real change ≈ salary growth minus inflation',
              'It stayed the same — salary raises always keep up with inflation',
            ],
            correct: 2,
            explanation: 'Real change ≈ Nominal change − Inflation = 4% − 6% = −2%. Your paycheck has more dollars, but each dollar buys less — the net effect is a 2% cut in what you can actually purchase. This is exactly what happened to many workers in the 1970s: nominal wages rose, but inflation rose faster, so real living standards fell.',
          },
          {
            question: 'The 1970s "Great Inflation" saw rates above 9%. The Federal Reserve eventually reduced it in the early 1980s. What did this require?',
            options: [
              'Printing more money to stimulate the economy out of inflation',
              'Raising interest rates sharply — which caused a painful recession but broke the inflation spiral',
              'Cutting all government spending to zero for two years',
              'Waiting for inflation to naturally resolve itself without policy action',
            ],
            correct: 1,
            explanation: 'Fed Chair Paul Volcker raised interest rates to nearly 20% in 1981. This crushed inflation — but also caused the 1981–82 recession with unemployment rising above 10%. The trade-off between fighting inflation and accepting short-run economic pain is the central dilemma of monetary policy, and the early 1980s remains the definitive case study.',
          },
          {
            question: 'The inflation rate in 2024 was 2.4%. The Fed\'s target is 2%. The historical average since 1929 is 2.84%. How should economists describe 2024 inflation?',
            options: [
              'A dangerous hyperinflation requiring urgent policy action',
              'Normal — at-target and well within historical norms',
              'Dangerously low, approaching deflation territory',
              'The worst inflation since the 1970s Great Inflation',
            ],
            correct: 1,
            explanation: '2.4% is slightly above the Fed\'s 2% target but below the long-run historical average of 2.84%. After the post-COVID spike to 7–8% in 2021–22, returning to 2.4% by 2024 was called a "soft landing" — reducing inflation without triggering a deep recession. By any historical benchmark, 2.4% is benign, low-risk inflation.',
          },
        ],
      },
    ],
  },

  {
    id: 'unemployment',
    title: 'Who\'s Actually Working?',
    subtitle: 'The Labor Market Beyond Headlines',
    emoji: '👷',
    duration: '~13 min',
    color: 'teal',
    slides: [
      {
        type: 'concept',
        title: 'What the Unemployment Rate Actually Measures',
        body: [
          'Every month the government releases the unemployment rate — the most-watched labor market stat. But what exactly does it measure? And what does it miss?',
          'The formula: Unemployment Rate = (Number Unemployed) ÷ (Civilian Labor Force) × 100. The critical catch: you\'re only counted as "unemployed" if you don\'t have a job AND you\'re actively searching for one in the past four weeks.',
          'People who gave up looking — "discouraged workers" — exit the labor force entirely. Once they\'re out, the unemployment rate can fall even though economic conditions haven\'t improved.',
        ],
        highlight: '⚠️ The unemployment rate measures labor market stress — but only for people still actively seeking work. It has a systematic blind spot: it ignores those who stopped trying.',
        keyPoints: [
          'Unemployed = no job AND actively searching (both conditions required)',
          'Discouraged workers who stop searching are NOT counted as unemployed',
          'The rate can fall for bad reasons (people giving up) OR good ones (people finding jobs)',
          '2024: 7,093,000 unemployed ÷ labor force of 168,110,083 = 4.2%',
        ],
      },
      {
        type: 'chart',
        title: 'A Century of Unemployment',
        context: 'The unemployment rate since 1929. Every major economic crisis and boom is written in this line.',
        autoPlot: [{ series: 'unemployment_rate', transform: 'level' }],
        watch: [
          'Great Depression peak (~1933): about 25% — one in four workers without a job',
          'WWII: plunged to near 1% — wartime production created enormous labor demand',
          'Postwar "normal": 4–6% became the peacetime baseline for most of the era',
          '2009 Great Recession peak: 9.6% — worst since the Depression',
          '2020 COVID spike: ~8.9%, then fastest recovery on record',
        ],
      },
      {
        type: 'concept',
        title: 'The Labor Force Participation Rate',
        body: [
          'The Labor Force Participation Rate (LFPR) measures what fraction of the civilian working-age population is either employed or actively job-hunting. It captures a broader view that the unemployment rate misses.',
          'When people leave the labor force — retiring, becoming discouraged, going back to school — the participation rate falls. Unemployment can look great while participation quietly collapses.',
          'LFPR peaked at 67.3% in 2000. By 2024, it had fallen to 62.5%. That 4.8 percentage point decline represents millions of working-age Americans who stepped back from the labor market.',
        ],
        highlight: '🔍 Healthy labor markets show falling unemployment AND stable or rising participation. Falling unemployment paired with falling participation is a yellow flag.',
        keyPoints: [
          'LFPR = (Labor Force) ÷ (Working-age population) × 100',
          'Captures both workers and active job seekers as a share of working-age population',
          'A falling LFPR can mean more retirees — or more discouraged workers',
          'Post-2000 decline reflects aging population plus structural shifts',
        ],
      },
      {
        type: 'chart',
        title: 'Unemployment + Participation Together',
        context: 'Plotting both reveals the full picture of labor market health — something neither series shows alone.',
        autoPlot: [
          { series: 'unemployment_rate', transform: 'level' },
          { series: 'labor_force_participation', transform: 'level' },
        ],
        watch: [
          '2008–09 recession: unemployment surged AND participation fell — a double blow',
          '1990s boom: unemployment fell to 4% AND participation rose to record highs — genuine strength',
          '2020: both crashed simultaneously, then both recovered at record speed',
          'Since 2000: unemployment has been low, but participation never returned to its peak',
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: 'To be counted as "unemployed" in official U.S. statistics, a person must:',
            options: [
              'Not have a job — that\'s the only requirement',
              'Not have a job AND be actively searching for one',
              'Not have a job, be searching, AND be receiving unemployment benefits',
              'Have been laid off involuntarily (voluntary quits don\'t count)',
            ],
            correct: 1,
            explanation: 'Both conditions are required: (1) jobless, AND (2) actively searching for work in the past 4 weeks. People who want work but stopped searching are "discouraged workers" — they are NOT counted as unemployed. This creates the most important limitation of the unemployment rate: it can look better simply because people gave up.',
          },
          {
            question: 'In 2024: 7,093,000 people were unemployed; the civilian labor force was 168,110,083; total U.S. population was 340,212,000. What is the unemployment rate?',
            options: [
              '2.1% (7.09M ÷ 340.2M × 100 — using total population)',
              '4.2% (7.09M ÷ 168.1M × 100 — using the labor force)',
              '8.4% (using only the employed as denominator)',
              '14.2% (adding both numerator and some excluded workers)',
            ],
            correct: 1,
            explanation: 'Unemployment Rate = (Unemployed ÷ Labor Force) × 100 = (7,093,000 ÷ 168,110,083) × 100 = 4.22%. The denominator is the labor force (employed + unemployed who are searching), NOT total population. Using total population gives 2.1% — wrong. The rate measures joblessness among people participating in the labor market.',
          },
          {
            question: 'The Labor Force Participation Rate fell from 67.3% (2000) to 62.5% (2024). Why does this matter for understanding the unemployment rate?',
            options: [
              'It shows the economy is producing more output per remaining worker',
              'It indicates fewer working-age Americans are engaged in the labor market — something the unemployment rate alone doesn\'t capture',
              'It means the unemployment rate in 2024 must be higher than in 2000',
              'LFPR and unemployment rate are two names for the same measurement',
            ],
            correct: 1,
            explanation: 'Unemployment tells you what fraction of active job-seekers can\'t find work. LFPR tells you what fraction of working-age Americans are in the market at all. A falling LFPR means more people have stepped back from the workforce — whether through retirement, discouragement, disability, or other reasons. Unemployment is blind to this shrinkage.',
          },
          {
            question: 'The unemployment rate fell from 9.6% (2010) to 4.7% (2016). But LFPR also fell from 64.6% to 62.7% over those same years. What is the most accurate interpretation?',
            options: [
              'The labor market fully recovered — unemployment nearly halved',
              'The labor market improved, but part of the decline reflected people leaving the labor force, not finding jobs',
              'The situation got worse overall, because LFPR fell',
              'These two trends are unrelated and should not be compared',
            ],
            correct: 1,
            explanation: 'Both are true simultaneously: real job-finding genuinely improved (unemployment fell significantly), but part of the decline also reflected discouraged workers exiting the labor force (LFPR fell). A complete recovery would show falling unemployment AND rising participation. The falling LFPR is a yellow flag that the headline improvement overstated the true recovery.',
          },
          {
            question: 'During WWII (1941–45), the U.S. unemployment rate fell to near 1%. What primarily caused this extraordinary drop?',
            options: [
              'The government changed the definition of unemployment to exclude veterans',
              'Massive wartime production demand essentially eliminated involuntary unemployment',
              'Millions of Americans emigrated to allied countries during the war',
              'The BLS stopped publishing unemployment data during the war',
            ],
            correct: 1,
            explanation: 'WWII mobilization created enormous demand for labor in factories, shipyards, and farms producing war materials. Combined with millions of men entering the military (leaving the civilian labor force), the result was near-complete employment of remaining civilians. Women, older workers, and others previously excluded from work were actively recruited to fill production needs.',
          },
          {
            question: 'A "discouraged worker" stops looking for jobs after months of rejection. According to official statistics, what happens to the unemployment count?',
            options: [
              'They are added to the "long-term unemployed" category and still counted',
              'They are removed from the labor force, and the unemployment rate may actually fall',
              'They are counted separately as "underemployed" workers',
              'Their status has no effect on any official labor statistics',
            ],
            correct: 1,
            explanation: 'Once a person stops actively searching, they exit the labor force — removed from both the numerator (unemployed count) AND the denominator (labor force size). The net effect is often a FALL in the unemployment rate, even though nothing improved for that person. This is why unemployment can look optimistic after a bad recession: it partly reflects people giving up, not people finding work.',
          },
          {
            question: 'Great Depression peak unemployment: ~25%. Great Recession 2009 peak: 9.6%. COVID-2020 peak: ~8.9%. Which statement is most accurate?',
            options: [
              'COVID was worse than the Great Recession since it peaked slightly lower but hit faster',
              'The Depression was categorically more severe; COVID and the Great Recession were comparable in peak but COVID recovered far faster',
              'All three were essentially the same severity — a recession is a recession',
              'The Great Recession was worse overall because it lasted longer than COVID',
            ],
            correct: 1,
            explanation: 'The Great Depression was categorically different — 25% unemployment sustained for years represents complete economic collapse. The 2009 recession (9.6% peak) and COVID (8.9% peak) are comparable in magnitude, but COVID\'s recovery was historically fast — roughly one year back to pre-pandemic employment. The Great Recession took 6+ years to return to full employment. Both depth AND duration define severity.',
          },
        ],
      },
    ],
  },

  {
    id: 'national-debt',
    title: 'The Nation\'s Credit Card',
    subtitle: 'Government Debt in Context',
    emoji: '🏛️',
    duration: '~13 min',
    color: 'coral',
    slides: [
      {
        type: 'concept',
        title: 'Deficit vs. Debt: Know the Difference',
        body: [
          'Two terms that get confused constantly — even by journalists and politicians. A deficit happens in a single year: when the government spends more than it collects in taxes. The debt is the running total of all past deficits accumulated over decades, minus any surpluses used to pay it down.',
        ],
        highlight: '2024: Collected $8,008B in taxes. Spent $9,904B. That year\'s deficit = $1,896B. National Debt = $35,465B built up over all of U.S. history.',
        analogy: '💳 A deficit is like overdrafting your checking account this month. The debt is the total credit card balance after years of monthly charges you never fully paid off.',
        keyPoints: [
          'Deficit = this year\'s shortfall (spending minus tax revenues)',
          'Debt = all past deficits accumulated minus any surpluses',
          'You can run a surplus and still have debt — you\'re just paying down the balance',
          '2024: $1,896B deficit added onto a $33,569B existing debt = $35,465B total',
        ],
      },
      {
        type: 'chart',
        title: 'The National Debt in Raw Dollars',
        context: 'The national debt in billions of dollars since 1929. Brace yourself.',
        autoPlot: [{ series: 'national_debt', transform: 'level' }],
        watch: [
          'Nearly flat through 1940s–60s — rapid postwar growth kept the debt manageable',
          '1980s: the line steepens — structural deficit spending begins',
          '2009 financial crisis: a sharp upward acceleration (stimulus + falling tax revenues)',
          '2020 COVID: another massive jump (trillions in emergency spending in one year)',
          'At $35.5 trillion this looks catastrophic — but raw numbers without context can mislead',
        ],
      },
      {
        type: 'concept',
        title: 'Why Raw Numbers Are Meaningless Without Context',
        body: [
          '$35.5 trillion sounds terrifying. But is it? A $500,000 mortgage is crushing for someone earning $30,000/year. The same mortgage is very manageable for someone earning $5 million/year.',
          'For governments, the right comparison is GNP — the country\'s total income. Debt as a % of GNP tells us how many years of income it would take to pay off the debt.',
          'At 121.3% of GNP in 2024, U.S. debt is larger than one full year of total economic output. Whether that\'s dangerous depends on interest rates, growth rates, and the government\'s capacity to raise revenue.',
        ],
        highlight: '📐 Always express debt as a % of GNP or GDP. The dollar amount alone is uninterpretable. A $35T debt for a $29T economy differs fundamentally from a $35T debt for a $10T economy.',
        keyPoints: [
          'Debt as % of GNP = how many years of national income to pay off the debt',
          '100% means one full year of income owed',
          '2024: 121.3% — matching WWII peak levels',
          'Key question: is the economy growing faster than the debt?',
        ],
      },
      {
        type: 'chart',
        title: 'Debt as % of GNP: A Completely Different Story',
        context: 'Now the same debt expressed as a percentage of GNP. The WWII era suddenly looks familiar.',
        autoPlot: [{ series: 'national_debt_pct_gnp', transform: 'level' }],
        watch: [
          'WWII peak (1945–46): debt reached ~120% of GNP — then fell rapidly for 30 years',
          'It fell not by paying it off, but by growing the economy faster than the debt grew',
          '1981–2019: steady rise from ~30% to ~100% during the structural deficit era',
          '2024: 121.3% — matching the WWII peak. History asks: will the economy outgrow it again?',
        ],
      },
      {
        type: 'quiz',
        questions: [
          {
            question: 'What is the difference between the government\'s "deficit" and the "national debt"?',
            options: [
              'They are two different terms for the same concept',
              'The deficit is this year\'s shortfall (spending minus revenues); the debt is the total accumulated from all past deficits',
              'The deficit is local government debt; the national debt is federal government debt',
              'The deficit is the interest owed on the debt; the debt is the original principal',
            ],
            correct: 1,
            explanation: 'A deficit occurs in a single fiscal year when spending exceeds revenues. The national debt accumulates over decades — it\'s the running total of all past deficits that haven\'t been paid back. In 2024: the year\'s deficit was $1,896B; but the accumulated national debt was $35,465B built up over all of U.S. history.',
          },
          {
            question: 'In 2024, the U.S. government collected $8,008 billion in taxes and spent $9,904 billion. What was the deficit?',
            options: [
              '$9,904 billion (total spending is the deficit)',
              '$17,912 billion (add revenues and spending together)',
              '$1,896 billion ($9,904B minus $8,008B)',
              '$8,008 billion (equal to total taxes collected)',
            ],
            correct: 2,
            explanation: 'Deficit = Expenditures − Revenues = $9,904B − $8,008B = $1,896B. This $1,896 billion was borrowed (via U.S. Treasury bonds) and added to the existing $33,569B national debt, bringing it to $35,465B by year-end. A deficit is always spending minus revenues — when revenues exceed spending, it\'s a surplus.',
          },
          {
            question: 'Why is "national debt as a percentage of GNP" more useful than the raw dollar amount of debt?',
            options: [
              'The percentage is always a smaller number, which is less alarming and easier to discuss',
              'It shows the debt burden relative to the economy\'s capacity to generate income and service the debt',
              'GNP figures are more accurate and reliable than debt figures',
              'Dollar amounts change with inflation, but percentages are inflation-proof',
            ],
            correct: 1,
            explanation: 'A $35 trillion debt is hard to judge in isolation. For a $3 trillion economy, it would be catastrophic — nearly 12 years of income owed. For a $29 trillion economy, it\'s heavy but far more manageable — about 1.2 years of income. Debt-to-GNP gives you that context, just like a "debt-to-income" ratio for a mortgage application.',
          },
          {
            question: 'National debt grew from $5.6T (2000) to $35.5T (2024) — a 6.3x increase. But debt as % of GNP only grew from ~56% to 121% — a 2.2x increase. Why the difference?',
            options: [
              'Some debt was secretly paid off between 2000 and 2024',
              'Debt figures and GNP figures are measured in incompatible units',
              'GNP also grew significantly — from ~$10T to ~$29T — so the economy\'s capacity grew alongside the debt',
              'Percentage changes are always arithmetically smaller than absolute changes',
            ],
            correct: 2,
            explanation: 'GNP roughly tripled from ~$10T to ~$29T from 2000–2024. So while debt grew 6.3x, GNP grew ~2.9x simultaneously, absorbing some of the debt increase. The debt ratio only grew 2.2x because the denominator also expanded. This is why growing your income while taking on debt can keep debt manageable — the ratio is what matters, not the raw amount.',
          },
          {
            question: 'After WWII, U.S. debt was ~120% of GNP. By the early 1970s, it had fallen to ~30% — without the government paying off the debt in full. How?',
            options: [
              'The U.S. defaulted on part of its debt obligations after the war',
              'Hyperinflation in the 1940s–50s destroyed the real value of the debt',
              'Rapid post-WWII economic growth and moderate inflation made GNP grow much faster than the debt',
              'Congress passed a law requiring balanced budgets every year until the debt ratio fell below 30%',
            ],
            correct: 2,
            explanation: 'The postwar U.S. economy boomed: real GDP grew 3–4%/year, and moderate inflation added 2–3%/year, so nominal GNP (the denominator) grew 5–6%/year while the nominal debt grew slowly. The ratio fell because the economy outgrew the debt. This "growing out of debt" is the standard historical prescription and why economists focus on whether growth exceeds the interest rate.',
          },
          {
            question: 'A country has debt at 80% of GDP. It runs a balanced budget this year (no new deficit). GDP grows 3%. What happens to the debt-to-GDP ratio?',
            options: [
              'It stays at 80% — a balanced budget means a stable debt ratio',
              'It rises to 83% — economic growth increases the debt burden',
              'It falls to about 77.7% — (80% ÷ 1.03) — GDP grew but debt stayed constant',
              'It cannot be determined without knowing the interest rate on the debt',
            ],
            correct: 2,
            explanation: 'With a balanced budget, nominal debt stays constant. But GDP grows 3%, making the denominator larger. New ratio ≈ 80% ÷ 1.03 ≈ 77.7%. This illustrates a key insight: a country can reduce its debt ratio simply by growing — even without running surpluses. Economic growth is the most painless long-run path to debt reduction.',
          },
          {
            question: 'Government expenditures in 2024 were 33.9% of GNP; receipts were 27.4% of GNP. If the government wanted to balance the budget without raising taxes, by approximately how much would spending need to fall as a share of GNP?',
            options: [
              'By 33.9 percentage points — eliminate all spending',
              'By 27.4 percentage points — cut spending by the amount of revenues',
              'By 6.5 percentage points — from 33.9% to 27.4% of GNP',
              'By 61.3 percentage points — the combined total',
            ],
            correct: 2,
            explanation: 'To balance: spending must equal revenues. Currently spending = 33.9% of GNP, revenues = 27.4%. The gap = 33.9% − 27.4% = 6.5 percentage points of GNP. In dollar terms, that\'s ~$1,896B in spending cuts. This would be historically unprecedented — larger than the entire federal budget of the year 2000.',
          },
        ],
      },
    ],
  },
];
