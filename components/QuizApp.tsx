'use client';

import { useState, useCallback } from 'react';
import { Question } from '@/types';
import HomeScreen from './HomeScreen';
import QuizScreen from './QuizScreen';
import ResultsScreen from './ResultsScreen';

interface Props {
  questions: Question[];
}

export default function QuizApp({ questions }: Props) {
  const [mode, setMode] = useState<'home' | 'quiz' | 'results'>('home');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const startQuiz = useCallback((qs: Question[]) => {
    setQuizQuestions(qs);
    setAnswers({});
    setCurrentIndex(0);
    setMode('quiz');
  }, []);

  const submitAnswer = useCallback((qNum: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: answer }));
  }, []);

  const finishQuiz = useCallback(() => {
    setMode('results');
  }, []);

  const restart = useCallback(() => {
    setMode('home');
  }, []);

  if (mode === 'home') {
    return <HomeScreen questions={questions} onStart={startQuiz} />;
  }
  if (mode === 'quiz') {
    return (
      <QuizScreen
        questions={quizQuestions}
        answers={answers}
        currentIndex={currentIndex}
        onAnswer={submitAnswer}
        onNavigate={setCurrentIndex}
        onFinish={finishQuiz}
      />
    );
  }
  return (
    <ResultsScreen
      questions={quizQuestions}
      answers={answers}
      onRestart={restart}
    />
  );
}
