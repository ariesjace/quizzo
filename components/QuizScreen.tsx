'use client';

import { useState } from 'react';
import { Question } from '@/types';

interface Props {
  questions: Question[];
  answers: Record<number, string>;
  currentIndex: number;
  onAnswer: (qNum: number, answer: string) => void;
  onNavigate: (i: number) => void;
  onFinish: () => void;
}

const DIFF_STYLE: Record<string, string> = {
  '⬥ Easy': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '⬥ Moderate': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  '⬥ Difficult': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizScreen({ questions, answers, currentIndex, onAnswer, onNavigate, onFinish }: Props) {
  const [showRationale, setShowRationale] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const q = questions[currentIndex];
  const selected = answers[q.num];
  const isAnswered = !!selected;
  const isCorrect = selected === q.correct;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (letter: string) => {
    if (isAnswered) return;
    onAnswer(q.num, letter);
    setShowRationale(false);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      onNavigate(currentIndex + 1);
      setShowRationale(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
      setShowRationale(false);
    }
  };

  const getOptionStyle = (letter: string) => {
    if (!isAnswered) {
      return 'border-slate-700 bg-slate-900/50 text-white hover:border-slate-500 hover:bg-slate-800 active:scale-98';
    }
    if (letter === q.correct) {
      return 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
    }
    if (letter === selected && letter !== q.correct) {
      return 'border-rose-500 bg-rose-500/10 text-rose-300';
    }
    return 'border-slate-800 bg-slate-900/30 text-slate-600';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => setShowNav(!showNav)} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* Question navigator panel */}
      {showNav && (
        <div className="fixed inset-0 z-20 bg-slate-950/95 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-lg mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Question Navigator</h2>
              <button onClick={() => setShowNav(false)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-3 text-xs text-slate-400">{answeredCount}/{questions.length} answered</div>
            <div className="grid grid-cols-8 gap-1.5">
              {questions.map((question, i) => {
                const ans = answers[question.num];
                let bg = 'bg-slate-800 text-slate-400';
                if (i === currentIndex) bg = 'bg-emerald-500 text-white';
                else if (ans) bg = ans === question.correct ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300';
                return (
                  <button
                    key={i}
                    onClick={() => { onNavigate(i); setShowNav(false); setShowRationale(false); }}
                    className={`aspect-square rounded-lg text-xs font-bold transition-all ${bg}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { setShowNav(false); onFinish(); }}
              className="mt-6 w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
            >
              Finish & See Results
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 px-4 py-5 max-w-lg mx-auto w-full space-y-4 pb-32">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${DIFF_STYLE[q.difficulty] || 'bg-slate-800 text-slate-400'}`}>
            {q.difficulty.replace('⬥ ', '')}
          </span>
          <span className="text-xs text-slate-500 truncate">{q.topic.split(':')[0]}</span>
          <span className="text-xs text-slate-600 ml-auto font-mono">Q{q.num}</span>
        </div>

        {/* Scenario */}
        {q.scenario && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Clinical Scenario</div>
            <p className="text-slate-300 text-sm leading-relaxed">{q.scenario}</p>
          </div>
        )}

        {/* Question */}
        <div className="px-1">
          <p className="text-white text-base font-semibold leading-snug">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {OPTION_LETTERS.filter(l => q.options[l]).map(letter => (
            <button
              key={letter}
              onClick={() => handleAnswer(letter)}
              disabled={isAnswered}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${getOptionStyle(letter)}`}
            >
              <div className="flex items-start gap-3">
                <span className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold mt-0.5 ${
                  isAnswered && letter === q.correct ? 'bg-emerald-500 border-emerald-500 text-white' :
                  isAnswered && letter === selected && letter !== q.correct ? 'bg-rose-500 border-rose-500 text-white' :
                  'border-current'
                }`}>
                  {isAnswered && letter === q.correct ? '✓' : isAnswered && letter === selected && letter !== q.correct ? '✗' : letter}
                </span>
                <span className="text-sm leading-relaxed">{q.options[letter]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Result feedback */}
        {isAnswered && (
          <div className={`rounded-xl p-4 border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
            <div className={`text-sm font-bold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isCorrect ? '✓ Correct!' : `✗ Incorrect — Answer: ${q.correct}`}
            </div>
            {showRationale ? (
              <p className="text-sm text-slate-300 leading-relaxed">{q.rationale}</p>
            ) : (
              <button
                onClick={() => setShowRationale(true)}
                className="text-xs text-slate-400 underline underline-offset-2 hover:text-white transition-colors"
              >
                Show rationale →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 px-4 py-3 safe-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-sm font-semibold text-slate-400 disabled:opacity-30 hover:border-slate-500 hover:text-white transition-all"
          >
            ← Prev
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={onFinish}
              className="flex-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={goNext}
              disabled={!isAnswered}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-emerald-400 transition-all"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
