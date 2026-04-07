'use client';

import { useState } from 'react';
import { Question } from '@/types';

interface Props {
  questions: Question[];
  answers: Record<number, string>;
  onRestart: () => void;
}

const DIFF_COLOR: Record<string, string> = {
  '⬥ Easy': 'text-emerald-400',
  '⬥ Moderate': 'text-amber-400',
  '⬥ Difficult': 'text-rose-400',
};

export default function ResultsScreen({ questions, answers, onRestart }: Props) {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const totalAnswered = Object.keys(answers).length;
  const correct = questions.filter(q => answers[q.num] === q.correct).length;
  const wrong = questions.filter(q => answers[q.num] && answers[q.num] !== q.correct).length;
  const skipped = questions.length - totalAnswered;
  const pct = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;

  const grade = pct >= 90 ? { label: 'Excellent', color: 'text-emerald-400' }
    : pct >= 75 ? { label: 'Good', color: 'text-teal-400' }
    : pct >= 60 ? { label: 'Average', color: 'text-amber-400' }
    : { label: 'Keep Studying', color: 'text-rose-400' };

  const filtered = questions.filter(q => {
    if (filter === 'correct') return answers[q.num] === q.correct;
    if (filter === 'wrong') return answers[q.num] && answers[q.num] !== q.correct;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Score header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800 px-5 pt-12 pb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative max-w-lg mx-auto text-center">
          <div className="text-6xl font-black mb-1 tabular-nums">
            <span className={pct >= 60 ? 'text-emerald-400' : 'text-rose-400'}>{pct}%</span>
          </div>
          <div className={`text-lg font-bold mb-4 ${grade.color}`}>{grade.label}</div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Correct', value: correct, color: 'text-emerald-400' },
              { label: 'Wrong', value: wrong, color: 'text-rose-400' },
              { label: 'Skipped', value: skipped, color: 'text-slate-400' },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-900/60 rounded-xl border border-slate-800 py-3">
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-2 bg-slate-900 rounded-xl p-1">
          {(['all', 'wrong', 'correct'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'all' ? `All (${questions.length})` : f === 'wrong' ? `Wrong (${wrong})` : `Correct (${correct})`}
            </button>
          ))}
        </div>
      </div>

      {/* Question review list */}
      <div className="px-4 py-4 max-w-lg mx-auto space-y-3 pb-32">
        {filtered.map(q => {
          const userAns = answers[q.num];
          const isCorrect = userAns === q.correct;
          const isExpanded = expandedQ === q.num;

          return (
            <div
              key={q.num}
              className={`rounded-xl border overflow-hidden ${
                !userAns ? 'border-slate-700' :
                isCorrect ? 'border-emerald-500/40' : 'border-rose-500/40'
              }`}
            >
              <button
                className="w-full text-left p-4"
                onClick={() => setExpandedQ(isExpanded ? null : q.num)}
              >
                <div className="flex items-start gap-3">
                  <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                    !userAns ? 'bg-slate-700 text-slate-400' :
                    isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {!userAns ? '−' : isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500 font-mono">Q{q.num}</span>
                      <span className={`text-xs ${DIFF_COLOR[q.difficulty] || 'text-slate-400'}`}>
                        {q.difficulty.replace('⬥ ', '')}
                      </span>
                    </div>
                    <p className="text-sm text-white leading-snug line-clamp-2">{q.question}</p>
                    {userAns && !isCorrect && (
                      <p className="text-xs text-rose-400 mt-1">Your answer: {userAns} · Correct: {q.correct}</p>
                    )}
                  </div>
                  <span className="text-slate-600 ml-2 shrink-0">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-900/50 p-4 space-y-3">
                  {q.scenario && (
                    <div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Scenario</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{q.scenario}</p>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {['A', 'B', 'C', 'D'].filter(l => q.options[l]).map(letter => (
                      <div
                        key={letter}
                        className={`flex gap-2 text-xs rounded-lg px-3 py-2 ${
                          letter === q.correct ? 'bg-emerald-500/10 text-emerald-300' :
                          letter === userAns && letter !== q.correct ? 'bg-rose-500/10 text-rose-300' :
                          'text-slate-500'
                        }`}
                      >
                        <span className="font-bold shrink-0">{letter}.</span>
                        <span>{q.options[letter]}</span>
                      </div>
                    ))}
                  </div>
                  {q.rationale && (
                    <div className="bg-slate-950/50 rounded-lg p-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rationale</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{q.rationale}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 uppercase tracking-wider"
          >
            ← New Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
