import React, { useState } from "react";
import { CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";

interface QuizGameProps {
  onGameOver?: (score: number) => void;
}

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "Which Indian state is known as the 'Land of Five Rivers'?",
    options: ["Punjab", "Haryana", "Gujarat", "Kerala"],
    answer: 0,
  },
  {
    id: 2,
    question: "What is the official national sport of India?",
    options: ["Cricket", "Field Hockey", "Kabaddi", "Badminton"],
    answer: 1,
  },
  {
    id: 3,
    question: "Which movie won Best Picture at the 95th Academy Awards in 2023?",
    options: ["Avatar 2", "Everything Everywhere All at Once", "Top Gun: Maverick", "RRR"],
    answer: 1,
  },
  {
    id: 4,
    question: "In Ludo, how many tokens does each player have?",
    options: ["2", "4", "6", "8"],
    answer: 1,
  },
  {
    id: 5,
    question: "What color is the center spot of a standard Ludo board?",
    options: ["Black", "Gold / Multi-color", "White", "Gray"],
    answer: 1,
  },
];

export function QuizGame({ onGameOver }: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = SAMPLE_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    let isCorrect = idx === currentQ.answer;
    let newScore = score + (isCorrect ? 20 : 0);
    setScore(newScore);

    setTimeout(() => {
      if (currentIndex + 1 < SAMPLE_QUESTIONS.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        if (onGameOver) onGameOver(newScore);
      }
    }, 1200);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-8 max-w-md mx-auto text-center space-y-6 shadow-2xl">
        <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
        <h3 className="font-display font-extrabold text-2xl">Quiz Completed!</h3>
        <p className="text-slate-300 text-sm">
          You scored <strong className="text-cyan-400 font-bold text-xl">{score}</strong> out of {SAMPLE_QUESTIONS.length * 20} points!
        </p>
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-cyan-400 text-black font-extrabold rounded-xl shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> PLAY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 max-w-lg mx-auto space-y-6 shadow-2xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400">
          Question {currentIndex + 1} of {SAMPLE_QUESTIONS.length}
        </span>
        <span className="text-sm font-extrabold text-cyan-400">Score: {score} XP</span>
      </div>

      {/* Question */}
      <h3 className="font-display font-bold text-lg leading-snug">{currentQ.question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === currentQ.answer;

          let btnStyle = "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700";
          if (selectedOption !== null) {
            if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
            else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 font-bold";
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between text-sm ${btnStyle}`}
            >
              <span>{opt}</span>
              {selectedOption !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
