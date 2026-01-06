import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";

export default function QuizHistory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopHeader title="Quiz History"
        rightAction={
          <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">filter_list</span>
          </button>
        }
      />

      {/* 1. Stats Overview */}
      <section className="px-4 py-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-3xl font-bold text-primary">42</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Quizzes</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-3xl font-bold text-green-500">85%</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg. Score</span>
          </div>
        </div>
      </section>

      {/* 2. Filter Tabs */}
      <div className="sticky top-15 z-20 bg-background-light dark:bg-background-dark pt-2 pb-4 border-b border-gray-100 dark:border-gray-800/50">
        <div className="flex w-full gap-6 overflow-x-auto px-4 no-scrollbar">
          <button className="flex flex-col items-center gap-2 pb-2 min-w-fit group">
            <span className="text-sm font-bold text-primary">All</span>
            <div className="h-0.75 w-full rounded-t-full bg-primary"></div>
          </button>
          {["Grammar", "Vocabulary", "Reading"].map((tab) => (
            <button key={tab} className="flex flex-col items-center gap-2 pb-2 min-w-fit group">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{tab}</span>
              <div className="h-0.75 w-full rounded-t-full bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"></div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. History List */}
      <div className="flex flex-col gap-4 px-4 pb-4 mt-4">

        {/* Item 1: High Score */}
        <div onClick={() => navigate('/quiz/review')} className="group relative flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm transition-all active:scale-[0.98] border border-gray-100 dark:border-gray-800 cursor-pointer">
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-lg bg-green-500"></div>
          <div className="flex items-center gap-4 pl-2">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <span className="material-symbols-outlined">spellcheck</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold leading-tight text-[#111318] dark:text-white line-clamp-1">English Grammar Set 4</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>12 Oct, 10:30 AM</span>
                <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="font-medium text-green-600 dark:text-green-400">9/10 Correct</span>
              </div>
              <span className="text-xs font-medium text-primary mt-1 flex items-center gap-1 group-hover:underline">
                View Review <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
        </div>

        {/* Item 2: Average Score */}
        <div className="group relative flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm transition-all active:scale-[0.98] border border-gray-100 dark:border-gray-800 cursor-pointer">
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-lg bg-yellow-500"></div>
          <div className="flex items-center gap-4 pl-2">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <span className="material-symbols-outlined">translate</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold leading-tight text-[#111318] dark:text-white line-clamp-1">Vocabulary Set A</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>11 Oct, 09:15 AM</span>
                <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">7/10 Correct</span>
              </div>
              <span className="text-xs font-medium text-primary mt-1 flex items-center gap-1 group-hover:underline">
                View Review <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
        </div>

        {/* Item 3: Low Score */}
        <div className="group relative flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm transition-all active:scale-[0.98] border border-gray-100 dark:border-gray-800 cursor-pointer">
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-lg bg-red-500"></div>
          <div className="flex items-center gap-4 pl-2">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined">menu_book</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold leading-tight text-[#111318] dark:text-white line-clamp-1">Reading Comprehension 2</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>10 Oct, 04:45 PM</span>
                <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="font-medium text-red-600 dark:text-red-400">3/10 Correct</span>
              </div>
              <span className="text-xs font-medium text-primary mt-1 flex items-center gap-1 group-hover:underline">
                View Review <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
        </div>

      </div>
    </div>
  );
}
