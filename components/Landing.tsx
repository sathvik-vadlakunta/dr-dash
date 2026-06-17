'use client';

import { BarChart2, BookOpen, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';
import { LESSONS } from '@/lib/lessons';

interface Props {
  onEnterApp: () => void;
  onGoToLessons: () => void;
}

export default function Landing({ onEnterApp, onGoToLessons }: Props) {
  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: 'var(--cream)', color: 'var(--navy)' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between border-b" style={{ background: 'white', borderColor: 'var(--cream-dark)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--coral)' }}>
            <BarChart2 size={16} color="white" />
          </div>
          <span className="font-black text-xl tracking-tight" style={{ color: 'var(--navy)' }}>
            Dr.<span style={{ color: 'var(--coral)' }}>Dash</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onGoToLessons}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-70"
            style={{ color: 'var(--navy)' }}
          >
            Lessons
          </button>
          <button
            onClick={onEnterApp}
            className="text-sm font-bold px-5 py-2 rounded-xl text-white transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--coral)' }}
          >
            Open App
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 md:px-8 pt-12 md:pt-20 pb-12 md:pb-16 text-center max-w-3xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 md:mb-8 text-xs font-bold uppercase tracking-widest"
          style={{ background: 'var(--tan)', color: 'var(--coral)' }}
        >
          <TrendingUp size={11} /> U.S. Macroeconomic Data · 1929–2024
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5 md:mb-6" style={{ color: 'var(--navy)' }}>
          Understand the<br />
          <span style={{ color: 'var(--coral)' }}>U.S. Economy.</span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.65 }}>
          96 years of real macroeconomic data, 7 transformations, and 5 guided lessons that build genuine intuition — not just definitions.
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--coral)' }}
          >
            Start Exploring <ArrowRight size={16} />
          </button>
          <button
            onClick={onGoToLessons}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: 'var(--navy)', color: 'var(--navy)', background: 'transparent' }}
          >
            <BookOpen size={15} /> Take a Lesson
          </button>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────────── */}
      <section className="border-t border-b py-10" style={{ borderColor: 'var(--cream-dark)', background: 'white' }}>
        <div className="max-w-4xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '96', label: 'Years of Data', sub: '1929 – 2024' },
            { n: '36', label: 'Data Series', sub: 'GDP to wages & debt' },
            { n: '7', label: 'Transformations', sub: 'Real, per capita & more' },
            { n: '5', label: 'Guided Lessons', sub: 'With 7-question quizzes' },
          ].map(({ n, label, sub }) => (
            <div key={label}>
              <p className="text-4xl font-black mb-1" style={{ color: 'var(--coral)' }}>{n}</p>
              <p className="text-sm font-bold mb-0.5" style={{ color: 'var(--navy)' }}>{label}</p>
              <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-3" style={{ color: 'var(--navy)' }}>
            Built for <span style={{ color: 'var(--coral)' }}>real learning</span>
          </h2>
          <p className="text-center text-sm mb-12" style={{ color: 'var(--navy)', opacity: 0.5 }}>Not a textbook. Not passive reading.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart2 size={20} />,
                color: 'var(--coral)',
                title: 'Interactive Charts',
                body: 'Plot any combination of series from 1929–2024. Zoom into the Great Depression, WWII boom, Volcker recession, or COVID shock — all in seconds.',
              },
              {
                icon: <TrendingUp size={20} />,
                color: 'var(--teal)',
                title: '7 Transformations',
                body: 'Switch between nominal, real, per capita, growth rate, and more with one click. See how the same data tells completely different stories.',
              },
              {
                icon: <BookOpen size={20} />,
                color: 'var(--coral)',
                title: 'Guided Lessons',
                body: 'Each lesson teaches a concept, shows it in the live data, then quizzes you with 7 Khan Academy-style questions. No passive reading — active learning.',
              },
            ].map(({ icon, color, title, body }) => (
              <div key={title} className="rounded-2xl p-6 border-2" style={{ background: 'white', borderColor: 'var(--cream-dark)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white" style={{ background: color }}>
                  {icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lessons preview ──────────────────────────────────────────────────── */}
      <section className="py-10 md:py-14 px-4 md:px-8 border-t" style={{ background: 'white', borderColor: 'var(--cream-dark)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black mb-1" style={{ color: 'var(--navy)' }}>Start with a lesson</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            Five core concepts, each building on the last. Concept → data → quiz.
          </p>
          <div className="space-y-3">
            {LESSONS.map((lesson, i) => (
              <button
                key={lesson.id}
                onClick={onGoToLessons}
                className="w-full text-left rounded-2xl p-5 border-2 border-transparent hover:border-[var(--coral)] transition-all flex items-center gap-4 group"
                style={{ background: 'var(--cream)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: lesson.color === 'coral' ? 'rgba(232,113,90,0.12)' : 'rgba(91,168,154,0.12)' }}
                >
                  {lesson.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: lesson.color === 'coral' ? 'var(--coral)' : 'var(--teal)' }}>
                    Lesson {i + 1} · {lesson.subtitle}
                  </p>
                  <p className="font-bold text-sm truncate" style={{ color: 'var(--navy)' }}>{lesson.title}</p>
                </div>
                <div className="text-xs font-medium px-3 py-1 rounded-full shrink-0" style={{ background: 'var(--cream-dark)', color: 'var(--navy)', opacity: 0.7 }}>
                  {lesson.duration}
                </div>
                <ChevronRight size={16} style={{ color: 'var(--coral)' }} className="shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-4 md:px-8 text-center" style={{ background: 'var(--navy)' }}>
        <h2 className="text-2xl md:text-3xl font-black mb-4 text-white">Ready to explore the data?</h2>
        <p className="text-base mb-8 md:mb-10 max-w-sm mx-auto" style={{ color: 'white', opacity: 0.55 }}>
          The entire statsbook — 96 years, 36 series — at your fingertips.
        </p>
        <button
          onClick={onEnterApp}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'var(--coral)' }}
        >
          Launch Dr. Dash <ArrowRight size={16} />
        </button>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="px-4 md:px-8 py-6 text-center text-xs" style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.35)' }}>
        © 2025 Dr. Dash · Pingle, <em>U.S. Macroeconomic Statistics</em>, 29th ed. (2025)
      </footer>
    </div>
  );
}
