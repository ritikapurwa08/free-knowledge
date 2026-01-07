import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { loadWordSet, type Word } from "@/data/words";

export default function Home() {
  const navigate = useNavigate();

  // Mock Data (We will fetch this from Convex/Local JSON later)
  // Fetch User Data from Convex
  const user = useQuery(api.users.viewer);
  // Mock fallback if loading or no user (though auth wrapper usually handles this)
  const userData = user || {
    name: "Guest",
    imageUrl: "",
    streak: 0,
    totalXp: 0,
    // progress is not in DB, so we derive or mock
  };
  const progress = Math.min(100, Math.floor((userData.totalXp / 5000) * 100)) || 0; // Simple XP based progress

  const [dailyWord, setDailyWord] = useState<Word | null>(null);

  useEffect(() => {
    async function fetchDailyWord() {
      // Simple "Game of the Day" logic: use day of year to pick a word index
      const sets = 1; // Just use set 1 for now
      const words = await loadWordSet(sets);
      if (words && words.length > 0) {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const wordIndex = dayOfYear % words.length;
        setDailyWord(words[wordIndex]);
      }
    }
    fetchDailyWord();
  }, []);

  // Falback if loading
  const displayWord = dailyWord || {
    text: "Loading...",
    englishSynonyms: ["..."],
    definition: "Fetching your daily word...",
    hindiSynonyms: []
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">

      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 flex items-center bg-background/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-border transition-colors">
        <div className="flex items-center gap-3">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-primary/20 cursor-pointer"
            style={{ backgroundImage: `url("${userData.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZ1Pp270umxhXhfUP9BXjMC272BUVux7nZOdgb1dklGnqJeXbiMvPOanv4RNtK_WlILLHBgxv3RYHjFj-B2emQD361KdoA4GyvhLYfJHLUiWgB0GLO-YQZCrqtMPxllZVYJE-omuO4U1ID8wkt09Unk1KkXCwVwXQQUoSZPqsfVEDxwWYlBowmDJIpzQtwqJ3YFBTc-C3xepLe22_3q_OaYnRojgB4rR064bMxrioUG08c_3aPYrY0pC5nXJb9akZonxUj9qGzg"}")` }}
            onClick={() => navigate('/profile')}
          ></div>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em]">
            Exam Orbit
          </h2>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 px-3 py-1.5 rounded-full gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-orange-500 text-[20px] material-symbols-filled">local_fire_department</span>
          <p className="text-orange-700 dark:text-orange-400 text-sm font-bold leading-normal tracking-[0.015em]">
            {userData.streak} Days
          </p>
        </div>
      </header>

      {/* 2. GREETING */}
      <div className="px-5 pt-6 pb-2">
        <h2 className="text-foreground tracking-tight text-[26px] font-bold leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
          नमस्ते, {userData.name}! 👋
          <span className="text-lg font-normal text-muted-foreground mt-1 block">
            आज आप क्या सीखना चाहेंगे?
          </span>
        </h2>
      </div>

      {/* 3. MAIN PROGRESS CARD */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-card p-5 shadow-sm border border-border group transition-all hover:border-primary/20">
          {/* Decorative Circle */}
          <div className="absolute -right-5 -top-5 size-32 rounded-full bg-blue-50 dark:bg-blue-900/10 z-0 pointer-events-none"></div>

          <div className="relative z-10 flex items-stretch justify-between gap-4">
            <div className="flex flex-[2_2_0px] flex-col justify-between gap-5">
              <div className="flex flex-col gap-2">
                <div>
                  <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Current Course</p>
                  <p className="text-foreground text-lg font-bold leading-tight">Level 1: Beginner</p>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <p className="text-muted-foreground text-xs font-medium">Progress</p>
                    <p className="text-foreground text-xs font-bold">{progress}%</p>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full shadow-[0_0_8px_rgba(19,91,236,0.4)] transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <button className="flex items-center justify-center overflow-hidden rounded-lg h-9 px-5 bg-primary text-white gap-2 text-sm font-medium leading-normal w-fit shadow-md hover:bg-blue-700 active:scale-95 transition-all">
                <span>Continue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
            {/* 3D Illustration */}
            <div
              className="w-24 bg-center bg-no-repeat bg-cover rounded-xl shrink-0 self-center aspect-3/4"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoFDhVW5yACV5H2RkVzXHes3RAhA7B8sZ0uCOY1l1SJCPwTnw4iw3oKWHb3TmzYkXDUwoDBq5tNR7shuYlbvWW7ROsnrz340ffEjIc2-IOydxqwvP-Hl3v7U5noy2VC_1NjISCphsWW9NOyu6VKUU_RbtZeKqeN0YdeRfYTIH4GCNkfaHwfFT82KYYuViUlqjSJUdRz0-LhQp7biP3AsxnCoTriojFZR3ABrgjuY617WsZd0UVE14Gu-sUTV7ESrl9uYhmgVDcgA")' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 4. DAILY WORD WIDGET (Aaj ka Shabd) */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 dark:bg-indigo-900/10 dark:border-indigo-800 p-5 relative overflow-hidden group">
          {/* Decorative Icon Background */}
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-indigo-100 dark:text-indigo-900/20 text-[100px] select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">auto_stories</span>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">Aaj ka Shabd</p>
              </div>
              <h3 className="text-foreground text-2xl font-bold leading-tight">{displayWord.text}</h3>
              <p className="text-muted-foreground text-sm mt-0.5 font-medium">{displayWord.englishSynonyms?.join(", ")}</p>
            </div>
            <button className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-indigo-950 text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-800 active:scale-90 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-all">
              <span className="material-symbols-outlined text-[22px]">volume_up</span>
            </button>
          </div>

          <div className="h-px w-full bg-indigo-200/60 dark:bg-indigo-800/50 relative z-10 my-1"></div>

          <p className="text-muted-foreground text-sm font-normal leading-relaxed relative z-10">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">Meaning:</span> {displayWord.definition}
            {displayWord.hindiSynonyms && displayWord.hindiSynonyms.length > 0 && (
               <span className="block mt-1 text-xs text-orange-600 dark:text-orange-400">({displayWord.hindiSynonyms[0]})</span>
            )}
          </p>
        </div>
      </div>

      {/* 5. MODULES GRID */}
      <div className="px-5 pt-2 pb-3">
        <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">Learning Modules</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pb-6">
        <ModuleCard
          title="Vocabulary"
          subtitle="शब्दावली"
          icon="menu_book"
          colors="text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-900/20 group-hover:bg-purple-100"
          onClick={() => navigate('/learn/vocabulary')}
        />
        <ModuleCard
          title="Grammar"
          subtitle="व्याकरण"
          icon="edit_note"
          onClick={() => alert("Coming Soon!")}
          colors="text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/20 group-hover:bg-emerald-100 grayscale opacity-80"
        />
        <ModuleCard
          title="Quizzes"
          subtitle="क्विज़"
          icon="quiz"
          colors="text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-900/20 group-hover:bg-rose-100"
          onClick={() => navigate('/quiz')}
        />
        <ModuleCard
          title="Resources"
          subtitle="रिसोर्सेज़"
          icon="folder_open"
          colors="text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/20 group-hover:bg-amber-100"
          onClick={() => navigate('/learn/resources')}
        />
      </div>

      {/* Floating Action Button (Quick Quiz) */}
      {/* Floating Action Button Removed as requested */}

    </div>
  );
}

// Helper Component for Grid Items
function ModuleCard({ title, subtitle, icon, colors, onClick }: { title: string, subtitle: string, icon: string, colors: string, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col gap-3 active:scale-[0.98] transition-all cursor-pointer group hover:border-primary/30 hover:shadow-md"
    >
      <div className={`size-11 rounded-lg flex items-center justify-center transition-colors ${colors}`}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-foreground text-base">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}
