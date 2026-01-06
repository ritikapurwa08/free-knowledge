import { useNavigate } from "react-router-dom";


export default function Learn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* 1. Header & Search */}
      <div className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white">Library</h2>
          <button className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1a2230] shadow-sm">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">search</span>
          </button>
        </div>

        {/* Subject Tabs */}
        <div className="flex w-full gap-6 overflow-x-auto px-4 no-scrollbar">
          <button className="flex flex-col items-center pb-2 border-b-2 border-primary">
            <span className="text-sm font-bold text-primary">English</span>
          </button>
          <button className="flex flex-col items-center pb-2 border-b-2 border-transparent text-gray-500">
            <span className="text-sm font-medium">GK</span>
          </button>
          <button className="flex flex-col items-center pb-2 border-b-2 border-transparent text-gray-500">
            <span className="text-sm font-medium">Reasoning</span>
          </button>
          <button className="flex flex-col items-center pb-2 border-b-2 border-transparent text-gray-500">
            <span className="text-sm font-medium">Maths</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* 2. Topic Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Nouns", "Tenses", "Verbs", "Idioms"].map((chip, i) => (
            <button
              key={chip}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-[#1a2230] text-gray-600 dark:text-gray-300'}`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 3. Quick Access Sections */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate('/learn/vocabulary')}
            className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="size-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <span className="material-symbols-outlined">style</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Flashcards</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn 500+ words</p>
          </div>

          <div
            onClick={() => navigate('/learn/resources')}
            className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <span className="material-symbols-outlined">folder</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">PDF Library</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Download notes</p>
          </div>
        </div>

        {/* 4. Recommended Content List */}
        <div>
            <h3 className="font-bold text-lg mb-3">Recommended for you</h3>
            <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center gap-4 bg-white dark:bg-[#1a2230] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="size-12 rounded-lg bg-gray-100 dark:bg-gray-800 bg-center bg-cover" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoFDhVW5yACV5H2RkVzXHes3RAhA7B8sZ0uCOY1l1SJCPwTnw4iw3oKWHb3TmzYkXDUwoDBq5tNR7shuYlbvWW7ROsnrz340ffEjIc2-IOydxqwvP-Hl3v7U5noy2VC_1NjISCphsWW9NOyu6VKUU_RbtZeKqeN0YdeRfYTIH4GCNkfaHwfFT82KYYuViUlqjSJUdRz0-LhQp7biP3AsxnCoTriojFZR3ABrgjuY617WsZd0UVE14Gu-sUTV7ESrl9uYhmgVDcgA")'}}></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">Grammar Basics: Nouns</h4>
                            <p className="text-xs text-gray-500">Video Lesson • 15 mins</p>
                        </div>
                        <button className="size-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
