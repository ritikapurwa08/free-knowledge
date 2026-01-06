import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";

export default function QuizReview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopHeader title="Review Answers" showBack={true} />

      {/* 1. Stats Section */}
      <section className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-primary mb-1 text-[28px]">trophy</span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Score</p>
            <p className="text-xl font-bold text-[#111318] dark:text-white">8/10</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-purple-500 mb-1 text-[28px]">timer</span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Time</p>
            <p className="text-xl font-bold text-[#111318] dark:text-white">04:30</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-green-500 mb-1 text-[28px]">check_circle</span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Accuracy</p>
            <p className="text-xl font-bold text-[#111318] dark:text-white">80%</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-3 text-center border border-primary/20">
          <span className="material-symbols-outlined text-primary text-sm">info</span>
          <p className="text-sm font-medium text-primary">Great job! You're mastering prepositions.</p>
        </div>
      </section>

      <div className="px-4 pb-2 pt-2">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111318] dark:text-white">Question Analysis</h3>
      </div>

      {/* 2. Question List */}
      <div className="flex flex-col gap-6 px-4 pb-6">

        {/* Q1: Image Based + Correct */}
        <div className="rounded-xl bg-white dark:bg-[#1a2230] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div
            className="bg-cover bg-center h-48 w-full relative"
            style={{backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuA_lxwBkcx2L8mk2yXjbgVxEZcmYtvboV3K37q7Gco7TNMF1xWuDoGc7WEel2E2zilGXmZQHEv_KUXfbnSDOZvEHJ5NL7N9WY2H0h8D8r4UHujr76szxjbP6f1si-FIBoVBQXwYt63Gf8dzhJv6oJ4kS4XRm65X7-6uXjW0SCfD-CkhZSxjYe8Xta7sM5aDs_uNwcxqoEce7LwW1-BKJHlReOmajmbkqYAzHb4bxUMj_XAHqxSuYxO8_ZR5JUiDj9rpVYTEkMWeKA")'}}
          >
            <div className="absolute bottom-0 left-0 p-4 w-full text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-2 py-1 rounded border border-white/10">Question 1</span>
                <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">check</span> Correct
                </span>
              </div>
              <p className="text-lg font-bold leading-tight drop-shadow-md">Which preposition is correctly used in the sentence: 'She is good ___ playing piano'?</p>
            </div>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {/* Correct User Answer */}
            <div className="flex items-start gap-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 p-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 dark:text-white">at</p>
                <p className="text-xs text-green-700 dark:text-green-400 font-medium mt-0.5">Your Answer</p>
              </div>
            </div>

            {/* Other Option (Disabled look) */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 opacity-60">
              <div className="size-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">in</p>
            </div>

            {/* Explanation */}
            <div className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 p-4 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                <p className="text-primary font-bold text-sm">Explanation</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                "Good at" is the standard phrase used to indicate proficiency in a skill or activity.
              </p>
            </div>
          </div>
        </div>

        {/* Q2: Text Based + Incorrect */}
        <div className="rounded-xl bg-white dark:bg-[#1a2230] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded">Question 2</span>
              <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                <span className="material-symbols-outlined text-[14px]">close</span> Incorrect
              </span>
            </div>
            <p className="text-[#111318] dark:text-white text-lg font-bold leading-tight">Select the synonym for the word: <span className="text-primary">Benevolent</span></p>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {/* Incorrect User Answer */}
            <div className="flex items-start gap-3 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-900/20 p-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                <span className="material-symbols-outlined text-[14px]">close</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Cruel</p>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">Your Answer</p>
              </div>
            </div>

            {/* Correct Answer (Missed) */}
            <div className="flex items-start gap-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 p-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Kind</p>
                <p className="text-xs text-green-700 dark:text-green-400 font-medium mt-0.5">Correct Answer</p>
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 p-4 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">lightbulb</span>
                <p className="text-primary font-bold text-sm">Explanation</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-bold">Benevolent</span> means well meaning and kindly. <span className="italic">Cruel</span> is an antonym.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1a2230] p-4 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40">
        <button
          onClick={() => navigate('/quiz')}
          className="w-full rounded-xl bg-primary py-3.5 text-center text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors active:scale-[0.98]"
        >
          Done 
        </button>
      </div>
    </div>
  );
}
