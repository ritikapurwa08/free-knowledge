import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// --- Types (Mock Data for now) ---
interface Question {
  id: number;
  text: string;
  type: "Single Choice" | "Multiple Choice";
  options: string[];
}

const MOCK_QUIZ = {
  id: "grammar-101",
  title: "General English",
  timeLimit: 600, // 10 minutes in seconds
  questions: [
    {
      id: 1,
      text: "Identify the synonym of the word <span class='text-primary'>'Diligent'</span>.",
      type: "Single Choice",
      options: ["Lazy", "Hard-working", "Intelligent", "Quick"],
    },
    {
      id: 2,
      text: "Which sentence is grammatically <b>correct</b>?",
      type: "Single Choice",
      options: [
        "She don't like apples.",
        "She doesn't likes apples.",
        "She doesn't like apples.",
        "She do not like apples."
      ],
    },
    {
      id: 3,
      text: "Fill in the blank: I have been waiting _____ 3 hours.",
      type: "Single Choice",
      options: ["since", "for", "from", "at"],
    }
  ] as Question[]
};

export default function QuizAttempt() {
  const navigate = useNavigate();

  // -- State --
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({}); // { questionIndex: optionIndex }
  const [timeLeft, setTimeLeft] = useState(MOCK_QUIZ.timeLimit);

  const currentQuestion = MOCK_QUIZ.questions[currentQIndex];
  const totalQuestions = MOCK_QUIZ.questions.length;
  const progress = ((currentQIndex + 1) / totalQuestions) * 100;

  // -- Timer Logic --
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit logic would go here
          alert("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time (mm:ss)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // -- Handlers --
  const handleOptionSelect = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Submit Quiz
      console.log("Submitting answers:", answers);
      navigate("/"); // Redirect to home or result page
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col antialiased selection:bg-primary/20 pb-20">

      {/* 1. STICKY HEADER (Timer & Progress) */}
      <header className="sticky top-0 z-20 bg-white dark:bg-[#1A2230] shadow-sm transition-colors">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {/* Title & Timer */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{MOCK_QUIZ.title}</span>
            <div className={`flex items-center gap-1.5 font-bold text-lg leading-none mt-0.5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
              <span className="material-symbols-outlined text-[20px]">timer</span>
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Grid View (Placeholder) */}
          <button className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-primary rounded-r-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 px-4 py-6 flex flex-col max-w-lg mx-auto w-full">

        {/* Counter & Tag */}
        <div className="mb-4 flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Question {currentQIndex + 1} <span className="text-slate-400 dark:text-slate-600 font-normal">/ {totalQuestions}</span>
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
            {currentQuestion.type}
          </span>
        </div>

        {/* Question Text */}
        <div className="bg-white dark:bg-[#1A2230] p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 animate-in zoom-in-95 duration-300">
          <h2
            className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white leading-snug"
            dangerouslySetInnerHTML={{ __html: currentQuestion.text }}
          />
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            Choose the word that best matches the meaning from the options below.
          </p>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3 mb-8" role="radiogroup">
          {currentQuestion.options.map((option, index) => {
            const isSelected = answers[currentQIndex] === index;

            return (
              <label
                key={index}
                className={cn(
                  "group cursor-pointer relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all active:scale-[0.98]",
                  isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1A2230] hover:border-primary/50 dark:hover:border-primary/50"
                )}
                onClick={() => handleOptionSelect(index)}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  className="peer sr-only"
                  checked={isSelected}
                  readOnly
                />

                {/* Custom Radio Circle */}
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-500"
                )}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>

                <span className={cn(
                  "text-base font-medium transition-colors",
                  isSelected
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                )}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </main>

      {/* 3. STICKY FOOTER NAVIGATION */}
      <footer className="fixed bottom-0 w-full bg-white dark:bg-[#1A2230] border-t border-slate-100 dark:border-slate-800 px-4 py-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-lg mx-auto flex gap-4">
          <button
            onClick={handlePrev}
            disabled={currentQIndex === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
          >
            {currentQIndex === totalQuestions - 1 ? "Submit" : "Next"}
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
