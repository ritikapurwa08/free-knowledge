import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { loadWordSet, type Word } from "@/data/words";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  // Fetch User Data from Convex
  const user = useQuery(api.users.viewer);
  // Fetch Progress Data
  const progressData = useQuery(api.users.userProgress);

  // Mock fallback if loading or no user
  const userData = user || {
    name: "Guest",
    imageUrl: "",
    streak: 0,
    totalXp: 0,
  };

  // Calculate percentages based on real data
  const wordPercent = progressData && progressData.totalWords
    ? Math.round((progressData.knownWords / progressData.totalWords) * 100)
    : 0;

  const testPercent = progressData && progressData.totalTests
    ? Math.round((progressData.attemptedTests / progressData.totalTests) * 100)
    : 0;



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

      {/* 3. MAIN PROGRESS CARD (Real Data) */}
      <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a2230] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden"
          >
             <p className="text-primary text-xs font-bold uppercase tracking-wider mb-2">Your Progress</p>
             <h2 className="text-xl font-bold mb-4">
                {wordPercent}% Words • {testPercent}% Quizzes
             </h2>

            <div className="space-y-4 relative z-10">
                {/* Word Progress */}
                <div>
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Words Learned</span>
                    <span className="font-bold">{progressData?.knownWords ?? 0} / {progressData?.totalWords ?? 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${wordPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
                </div>

                {/* Quiz Progress */}
                <div>
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500">Quizzes Attempted</span>
                    <span className="font-bold">{progressData?.attemptedTests ?? 0} / {progressData?.totalTests ?? 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${testPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-blue-500 rounded-full"
                    />
                </div>
                </div>
            </div>

            {/* Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <span className="material-symbols-outlined text-[120px] text-primary">trending_up</span>
            </div>
          </motion.div>
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
          onClick={() => toast.info("Grammar module is Coming Soon!")}
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
          onClick={() => navigate('/learn')}
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
