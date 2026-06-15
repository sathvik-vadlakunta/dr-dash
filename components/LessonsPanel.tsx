'use client';

import { useState, useEffect } from 'react';
import { LESSONS, Lesson, Slide, ConceptSlide, ChartSlide, QuizSlide } from '@/lib/lessons';
import { ActiveSeries, SeriesKey, TransformType } from '@/types';
import { COLORS } from './Sidebar';
import { ArrowLeft, ArrowRight, ChevronRight, Clock, Pencil, RotateCcw, Check, X } from 'lucide-react';

interface Props {
  onSetChartSeries: (series: ActiveSeries[]) => void;
  activeSeries: ActiveSeries[];
}

// ─── Lesson List ─────────────────────────────────────────────────────────────

function LessonCard({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const isCorал = lesson.color === 'coral';
  return (
    <button
      onClick={onStart}
      className="w-full text-left rounded-2xl p-5 border-2 border-transparent hover:border-[var(--coral)] transition-all group"
      style={{ background: 'white' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{lesson.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: isCorал ? 'var(--coral)' : 'var(--teal)' }}>
              {lesson.subtitle}
            </p>
            <h3 className="font-bold text-base" style={{ color: 'var(--navy)' }}>{lesson.title}</h3>
          </div>
        </div>
        <ChevronRight size={20} style={{ color: 'var(--coral)' }} className="group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: 'var(--navy-light)', opacity: 0.7 }}>
        <span className="flex items-center gap-1"><Clock size={11} /> {lesson.duration}</span>
        <span>·</span>
        <span>{lesson.slides.filter(s => s.type === 'quiz').reduce((acc, s) => acc + (s as QuizSlide).questions.length, 0)} quiz questions</span>
        <span>·</span>
        <span>{lesson.slides.filter(s => s.type === 'concept').length} concepts</span>
      </div>
    </button>
  );
}

// ─── Concept Slide ────────────────────────────────────────────────────────────

function ConceptView({ slide }: { slide: ConceptSlide }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--navy)' }}>{slide.title}</h2>
      <div className="space-y-3">
        {slide.body.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.85 }}>{para}</p>
        ))}
      </div>
      {slide.highlight && (
        <div className="rounded-xl p-4 border-l-4" style={{ background: 'rgba(232,113,90,0.08)', borderColor: 'var(--coral)' }}>
          <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--navy)' }}>{slide.highlight}</p>
        </div>
      )}
      {slide.analogy && (
        <div className="rounded-xl p-4 border-l-4" style={{ background: 'rgba(91,168,154,0.08)', borderColor: 'var(--teal)' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--teal)' }}>Real-World Analogy</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.85 }}>{slide.analogy}</p>
        </div>
      )}
      {slide.keyPoints && slide.keyPoints.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'var(--cream-dark)' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: 'var(--navy)', opacity: 0.6 }}>Key Points</p>
          <ul className="space-y-2">
            {slide.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--navy)' }}>
                <span className="mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold" style={{ background: 'var(--navy)' }}>{i + 1}</span>
                <span className="leading-relaxed" style={{ opacity: 0.85 }}>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Chart Slide ──────────────────────────────────────────────────────────────

function ChartView({ slide, onApply }: { slide: ChartSlide; onApply: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--navy)' }}>{slide.title}</h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.85 }}>{slide.context}</p>
      <button
        onClick={onApply}
        className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: 'var(--coral)' }}
      >
        <span>→ Load This Chart</span>
      </button>
      <div className="rounded-xl p-4" style={{ background: 'var(--cream-dark)' }}>
        <p className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
          <span>👀</span> What to Notice
        </p>
        <ul className="space-y-2.5">
          {slide.watch.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--navy)' }}>
              <span className="shrink-0 mt-0.5 text-base">•</span>
              <span className="leading-relaxed" style={{ opacity: 0.85 }}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl p-4 border" style={{ borderColor: 'var(--tan)', background: 'rgba(234,213,183,0.2)' }}>
        <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.6 }}>
          💡 The live chart on the right updates when you click "Load This Chart." You can still use all the transformation buttons to explore further.
        </p>
      </div>
    </div>
  );
}

// ─── Quiz Slide ───────────────────────────────────────────────────────────────

function QuizView({
  slide,
  onComplete,
  onFinish,
}: {
  slide: QuizSlide;
  onComplete: (score: number) => void;
  onFinish: () => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<('correct' | 'wrong' | 'skipped' | null)[]>(
    Array(slide.questions.length).fill(null)
  );
  const [done, setDone] = useState(false);

  const q = slide.questions[qIndex];
  const total = slide.questions.length;
  const isCorrect = submitted && selected === q.correct;

  function advance(result: 'correct' | 'wrong' | 'skipped') {
    const next = [...results];
    next[qIndex] = result;
    setResults(next);
    if (qIndex + 1 < total) {
      setQIndex(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      const score = next.filter(r => r === 'correct').length;
      setDone(true);
      onComplete(score);
    }
  }

  function handleCheck() {
    if (selected === null) return;
    setSubmitted(true);
  }

  function handleContinue() {
    advance(selected === q.correct ? 'correct' : 'wrong');
  }

  function handleSkip() {
    advance('skipped');
  }

  // ── Score Screen ─────────────────────────────────────────────────────────────
  if (done) {
    const score = results.filter(r => r === 'correct').length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="flex-1 min-h-0 flex flex-col" style={{ background: 'white' }}>
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 text-center gap-5">
          <div className="text-6xl">{pct === 100 ? '🏆' : pct >= 71 ? '🎯' : pct >= 43 ? '📈' : '📚'}</div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
            {pct === 100 ? 'Perfect score!' : pct >= 71 ? 'Great work!' : pct >= 43 ? 'Good effort!' : 'Keep practicing!'}
          </h2>
          <div className="flex items-end gap-1 justify-center">
            <p className="text-6xl font-black leading-none" style={{ color: 'var(--coral)' }}>{score}</p>
            <p className="text-2xl font-bold pb-1" style={{ color: 'var(--navy)', opacity: 0.35 }}>/ {total}</p>
          </div>
          <div className="w-full max-w-xs rounded-full h-3 overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 71 ? 'var(--teal)' : 'var(--coral)' }} />
          </div>
          <div className="flex gap-2 justify-center">
            {results.map((r, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-full border-2" style={{
                background: r === 'correct' ? 'var(--teal)' : r === 'wrong' ? 'var(--coral)' : 'transparent',
                borderColor: r === 'correct' ? 'var(--teal)' : r === 'wrong' ? 'var(--coral)' : 'var(--cream-dark)',
              }} />
            ))}
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--navy)', opacity: 0.6 }}>
            {pct === 100
              ? 'You nailed every question. On to the next lesson!'
              : pct >= 71
              ? `You got ${score} of ${total} right. Solid understanding!`
              : `You got ${score} of ${total} right. Review the concept slides and try again.`}
          </p>
        </div>
        {/* Bottom bar */}
        <div className="shrink-0 border-t px-6 py-3.5 flex items-center justify-end" style={{ borderColor: 'var(--cream-dark)', background: 'white' }}>
          <button
            onClick={onFinish}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'var(--navy)' }}
          >
            Finish <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  // ── Question Screen ───────────────────────────────────────────────────────────
  return (
    <div className="flex-1 min-h-0 flex flex-col" style={{ background: 'white' }}>
      {/* Scrollable question + options */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p className="text-base font-semibold leading-relaxed mb-5" style={{ color: 'var(--navy)' }}>
          {q.question}
        </p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let bg = 'white';
            let borderColor = 'var(--cream-dark)';
            let radioBg = 'transparent';
            let radioBorder = 'var(--cream-dark)';
            let radioIcon: React.ReactNode = null;

            if (submitted) {
              if (i === q.correct) {
                bg = 'rgba(91,168,154,0.1)';
                borderColor = 'var(--teal)';
                radioBg = 'var(--teal)';
                radioBorder = 'var(--teal)';
                radioIcon = <Check size={10} strokeWidth={3} color="white" />;
              } else if (i === selected) {
                bg = 'rgba(232,113,90,0.09)';
                borderColor = 'var(--coral)';
                radioBg = 'var(--coral)';
                radioBorder = 'var(--coral)';
                radioIcon = <X size={10} strokeWidth={3} color="white" />;
              }
            } else if (selected === i) {
              bg = 'rgba(28,34,64,0.04)';
              borderColor = 'var(--navy)';
              radioBg = 'var(--navy)';
              radioBorder = 'var(--navy)';
              radioIcon = <div className="w-2 h-2 rounded-full" style={{ background: 'white' }} />;
            }

            return (
              <button
                key={i}
                disabled={submitted}
                onClick={() => setSelected(i)}
                className="w-full text-left rounded-xl px-4 py-3 border-2 flex items-center gap-3 transition-all"
                style={{
                  background: bg,
                  borderColor,
                  color: 'var(--navy)',
                  cursor: submitted ? 'default' : 'pointer',
                }}
              >
                <span
                  className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: radioBorder, background: radioBg }}
                >
                  {radioIcon}
                </span>
                <span className="text-sm leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── KA-style bottom bar ────────────────────────────────────────────────── */}
      {submitted ? (
        /* Feedback bar */
        <div
          className="shrink-0 border-t-[3px] px-5 py-4 flex items-start gap-4"
          style={{
            background: isCorrect ? 'rgba(91,168,154,0.1)' : 'rgba(232,113,90,0.08)',
            borderColor: isCorrect ? 'var(--teal)' : 'var(--coral)',
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold mb-1" style={{ color: isCorrect ? 'var(--teal)' : 'var(--coral)' }}>
              {isCorrect ? '✓ Correct!' : '✗ Not quite right'}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.8 }}>{q.explanation}</p>
          </div>
          <button
            onClick={handleContinue}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-bold text-sm text-white transition-all hover:opacity-90"
            style={{ background: isCorrect ? 'var(--teal)' : 'var(--coral)' }}
          >
            {qIndex + 1 < total ? 'Continue' : 'See score'}
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        /* Default check bar */
        <div
          className="shrink-0 border-t px-5 py-3 flex items-center gap-3"
          style={{ borderColor: 'var(--cream-dark)', background: 'white' }}
        >
          {/* Hint */}
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--cream)]"
            style={{ color: 'var(--navy)', opacity: 0.45 }}
            title="Hint (review concept slides)"
          >
            <Pencil size={15} />
          </button>

          <div className="w-px h-5 shrink-0" style={{ background: 'var(--cream-dark)' }} />

          {/* Progress dots */}
          <div className="flex-1 flex items-center gap-2.5">
            <RotateCcw size={12} style={{ color: 'var(--navy)', opacity: 0.3 }} className="shrink-0" />
            <div className="flex gap-1.5">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border-2 transition-all"
                  style={{
                    background:
                      r === 'correct' ? 'var(--teal)'
                      : r === 'wrong' ? 'var(--coral)'
                      : 'transparent',
                    borderColor:
                      i === qIndex ? 'var(--navy)'
                      : r === 'correct' ? 'var(--teal)'
                      : r === 'wrong' ? 'var(--coral)'
                      : 'var(--cream-dark)',
                  }}
                />
              ))}
            </div>
            <span className="text-[11px]" style={{ color: 'var(--navy)', opacity: 0.35 }}>
              {total} questions
            </span>
          </div>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-60"
            style={{ color: 'var(--navy)', opacity: 0.4 }}
          >
            Skip
          </button>

          {/* Check */}
          <button
            onClick={handleCheck}
            disabled={selected === null}
            className="px-5 py-2 rounded-lg font-bold text-sm transition-all"
            style={{
              background: selected !== null ? 'var(--navy)' : 'var(--cream-dark)',
              color: selected !== null ? 'white' : 'var(--navy)',
              opacity: selected !== null ? 1 : 0.45,
              cursor: selected !== null ? 'pointer' : 'not-allowed',
            }}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Lesson Viewer ───────────────────────────────────────────────────────

function LessonViewer({
  lesson,
  onBack,
  onSetChartSeries,
}: {
  lesson: Lesson;
  onBack: () => void;
  onSetChartSeries: (series: ActiveSeries[]) => void;
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [quizScores, setQuizScores] = useState<Record<number, number>>({});
  const [quizKey, setQuizKey] = useState(0);

  const slide = lesson.slides[slideIndex];
  const total = lesson.slides.length;
  const progress = ((slideIndex) / (total - 1)) * 100;

  const isFirst = slideIndex === 0;
  const isLast = slideIndex === total - 1;

  const canAdvance = slide.type !== 'quiz' || quizScores[slideIndex] !== undefined;

  function applyChartSlide(s: ChartSlide) {
    const series: ActiveSeries[] = s.autoPlot.map((p, i) => ({
      key: p.series,
      transform: p.transform,
      color: COLORS[i % COLORS.length],
    }));
    onSetChartSeries(series);
  }

  function handleNext() {
    if (slideIndex < total - 1) {
      setSlideIndex(i => i + 1);
      setQuizKey(k => k + 1);
    }
  }

  function handlePrev() {
    if (slideIndex > 0) {
      setSlideIndex(i => i - 1);
      setQuizKey(k => k + 1);
    }
  }

  function getSlideLabel(s: Slide) {
    if (s.type === 'concept') return '📖';
    if (s.type === 'chart') return '📊';
    return '❓';
  }

  return (
    <div className="h-full flex flex-col">
      {/* Lesson header */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--cream-dark)', background: 'white' }}>
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-semibold mb-3 transition-opacity hover:opacity-70" style={{ color: 'var(--coral)' }}>
          <ArrowLeft size={14} /> All Lessons
        </button>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{lesson.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--coral)', opacity: 0.8 }}>{lesson.subtitle}</p>
            <h2 className="font-bold text-sm leading-tight" style={{ color: 'var(--navy)' }}>{lesson.title}</h2>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--cream-dark)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--coral)' }} />
        </div>
        {/* Slide dots */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {lesson.slides.map((s, i) => (
            <button
              key={i}
              onClick={() => { setSlideIndex(i); setQuizKey(k => k + 1); }}
              title={s.type}
              className="w-6 h-6 rounded-full text-[10px] flex items-center justify-center border transition-all"
              style={{
                background: i === slideIndex ? 'var(--coral)' : i < slideIndex ? 'var(--teal)' : 'var(--cream-dark)',
                borderColor: i === slideIndex ? 'var(--coral)' : 'transparent',
                color: i <= slideIndex ? 'white' : 'var(--navy)',
              }}
            >
              {getSlideLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {/* Slide content */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col" style={{ background: slide.type === 'quiz' ? 'white' : 'var(--cream)' }}>
        {slide.type === 'concept' && <ConceptView slide={slide as ConceptSlide} />}
        {slide.type === 'chart' && (
          <ChartView
            slide={slide as ChartSlide}
            onApply={() => applyChartSlide(slide as ChartSlide)}
          />
        )}
        {slide.type === 'quiz' && (
          <QuizView
            key={`${slideIndex}-${quizKey}`}
            slide={slide as QuizSlide}
            onComplete={(s) => setQuizScores(prev => ({ ...prev, [slideIndex]: s }))}
            onFinish={onBack}
          />
        )}
      </div>

      {/* Navigation — hidden during quiz (quiz manages its own footer) */}
      {slide.type !== 'quiz' && (
        <div className="shrink-0 px-5 py-4 flex items-center justify-between border-t" style={{ borderColor: 'var(--cream-dark)', background: 'white' }}>
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-30"
            style={{ background: 'var(--cream-dark)', color: 'var(--navy)' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.4 }}>
            {slideIndex + 1} / {total}
          </span>
          <button
            onClick={handleNext}
            disabled={isLast}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white transition-all disabled:opacity-30"
            style={{ background: 'var(--coral)' }}
          >
            Continue <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Root Panel ───────────────────────────────────────────────────────────────

export default function LessonsPanel({ onSetChartSeries }: Props) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!activeLesson ? (
        <>
          <div className="shrink-0 px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--cream-dark)', background: 'white' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--coral)' }}>Dr. Dash</p>
            <h2 className="text-xl font-black leading-tight" style={{ color: 'var(--navy)' }}>Learn Macroeconomics.</h2>
            <h2 className="text-xl font-black leading-tight" style={{ color: 'var(--coral)' }}>Build Intuition.</h2>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              Each lesson teaches a concept, shows it in the live data, then quizzes you — all in one place.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--cream)' }}>
            {LESSONS.map(l => (
              <LessonCard key={l.id} lesson={l} onStart={() => setActiveLesson(l)} />
            ))}
          </div>
        </>
      ) : (
        <LessonViewer
          lesson={activeLesson}
          onBack={() => setActiveLesson(null)}
          onSetChartSeries={onSetChartSeries}
        />
      )}
    </div>
  );
}
