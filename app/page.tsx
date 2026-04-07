'use client';

import { useState, useEffect } from 'react';
import QuizApp from '@/components/QuizApp';
import { Question } from '@/types';

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch('/questions.json')
      .then(r => r.json())
      .then(setQuestions);
  }, []);

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-emerald-400 text-lg font-mono animate-pulse">Loading…</div>
      </div>
    );
  }

  return <QuizApp questions={questions} />;
}
