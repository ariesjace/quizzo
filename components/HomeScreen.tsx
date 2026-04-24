'use client';

import { useMemo } from 'react';
import { Question } from '@/types';

const TOPIC_COLORS = [
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
  'from-sky-500/20 to-blue-500/20 border-sky-500/40',
  'from-violet-500/20 to-purple-500/20 border-violet-500/40',
  'from-amber-500/20 to-orange-500/20 border-amber-500/40',
  'from-rose-500/20 to-pink-500/20 border-rose-500/40',
  'from-cyan-500/20 to-teal-500/20 border-cyan-500/40',
  'from-indigo-500/20 to-purple-500/20 border-indigo-500/40',
  'from-orange-500/20 to-red-500/20 border-orange-500/40',
];

const TOPIC_ACCENTS = ['text-emerald-400', 'text-sky-400', 'text-violet-400', 'text-amber-400', 'text-rose-400', 'text-cyan-400', 'text-indigo-400', 'text-orange-400'];

interface Props {
  questions: Question[];
  onStart: (qs: Question[]) => void;
}

export default function HomeScreen({ questions, onStart }: Props) {
  const TOPICS = useMemo(() => {
    const uniqueTopics = Array.from(new Set(questions.map(q => q.topic))).sort();
    return uniqueTopics;
  }, [questions]);

  const handleStart = () => {
    onStart(questions);
  };

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
            YOUR REVIEWER FOR IMSE BABY KO
          </h1>
          <p className="text-slate-400 text-sm">100 Case-Based Questions · High-Yield Topics</p>
        </div>
      </div>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        {/* Topics Overview */}
        
        {/* Start Quiz Button */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-6 text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Ready to Begin?</h2>
              <p className="text-sm text-slate-400">All {questions.length} questions · Complete exam</p>
            </div>
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-95 transition-all uppercase tracking-wider"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
