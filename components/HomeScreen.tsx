'use client';

import { useState } from 'react';
import { Question } from '@/types';

const TOPICS = [
  'Topic 1: Adrenal Gland – Anatomy & Biosynthesis',
  'Topic 2: Thyroid Gland – Anatomy & Biosynthesis',
];

const DIFFICULTIES = ['⬥ Easy', '⬥ Moderate', '⬥ Difficult'];

const TOPIC_COLORS = [
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
  'from-sky-500/20 to-blue-500/20 border-sky-500/40',
  'from-violet-500/20 to-purple-500/20 border-violet-500/40',
  'from-amber-500/20 to-orange-500/20 border-amber-500/40',
];

const TOPIC_ACCENTS = ['text-emerald-400', 'text-sky-400', 'text-violet-400', 'text-amber-400'];

interface Props {
  questions: Question[];
  onStart: (qs: Question[]) => void;
}

export default function HomeScreen({ questions, onStart }: Props) {
  const [mode, setMode] = useState<'all' | 'topic' | 'difficulty'>('all');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDiffs, setSelectedDiffs] = useState<string[]>([]);
  const [count, setCount] = useState(25);

  const toggleTopic = (t: string) =>
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleDiff = (d: string) =>
    setSelectedDiffs(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleStart = () => {
    let pool = questions;
    if (mode === 'topic' && selectedTopics.length > 0) {
      pool = questions.filter(q => selectedTopics.includes(q.topic));
    } else if (mode === 'difficulty' && selectedDiffs.length > 0) {
      pool = questions.filter(q => selectedDiffs.includes(q.difficulty));
    }
    // Shuffle and take count
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    onStart(shuffled);
  };

  const canStart = mode === 'all' || (mode === 'topic' && selectedTopics.length > 0) || (mode === 'difficulty' && selectedDiffs.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-teal-500 rounded-full blur-3xl -translate-y-1/2" />
        </div>
        <div className="relative px-5 pt-14 pb-10 max-w-lg mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-widest uppercase">
            Critical Thinking Exam
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent">
            VIROLOGY
          </h1>
          <p className="text-slate-400 text-sm">100 Case-Based Questions · 4 High-Yield Topics</p>
          <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="text-emerald-400">25</span> Easy</span>
            <span className="flex items-center gap-1"><span className="text-amber-400">50</span> Moderate</span>
            <span className="flex items-center gap-1"><span className="text-rose-400">25</span> Difficult</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Topics Overview */}
        <div className="grid grid-cols-2 gap-3">
          {TOPICS.map((topic, i) => {
            const shortName = topic.split(':')[0];
            const desc = topic.split(':')[1]?.trim() || topic;
            const count = questions.filter(q => q.topic === topic).length;
            return (
              <div key={i} className={`rounded-xl border bg-gradient-to-br p-3 ${TOPIC_COLORS[i]}`}>
                <div className={`text-xs font-bold ${TOPIC_ACCENTS[i]} mb-1`}>{shortName}</div>
                <div className="text-white text-xs leading-tight font-medium">{desc}</div>
                <div className="text-slate-400 text-xs mt-1">{count} questions</div>
              </div>
            );
          })}
        </div>

        {/* Quiz Setup */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Configure Your Quiz</h2>
          </div>

          {/* Mode selector */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 bg-slate-950 rounded-xl p-1">
              {(['all', 'topic', 'difficulty'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    mode === m
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m === 'all' ? 'All' : m === 'topic' ? 'By Topic' : 'By Level'}
                </button>
              ))}
            </div>

            {mode === 'topic' && (
              <div className="space-y-2">
                {TOPICS.map((t, i) => (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                      selectedTopics.includes(t)
                        ? `bg-gradient-to-r ${TOPIC_COLORS[i]} border-current`
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className={`font-semibold text-xs ${selectedTopics.includes(t) ? TOPIC_ACCENTS[i] : ''}`}>
                      {t.split(':')[0]}
                    </div>
                    <div className={`text-xs mt-0.5 ${selectedTopics.includes(t) ? 'text-white' : 'text-slate-500'}`}>
                      {t.split(':')[1]?.trim()}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {mode === 'difficulty' && (
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d, i) => {
                  const colors = ['border-emerald-500 bg-emerald-500/10 text-emerald-400', 'border-amber-500 bg-amber-500/10 text-amber-400', 'border-rose-500 bg-rose-500/10 text-rose-400'];
                  const labels = ['Easy', 'Moderate', 'Difficult'];
                  return (
                    <button
                      key={d}
                      onClick={() => toggleDiff(d)}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedDiffs.includes(d) ? colors[i] : 'border-slate-700 text-slate-500 hover:border-slate-600'
                      }`}
                    >
                      {labels[i]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Question count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Questions</span>
                <span className="text-emerald-400 text-sm font-bold">{count}</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>5</span><span>25</span><span>50</span><span>75</span><span>100</span>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
