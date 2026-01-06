import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";

export default function Statistics() {
  const [filter, setFilter] = useState<"week" | "month" | "all">("week");

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-10">
      <TopHeader title="My Progress" showBack={true} />

      {/* 1. Filter Chips */}
      <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800/50">
        {["This Week", "This Month", "All Time"].map((label, i) => {
          const value = i === 0 ? "week" : i === 1 ? "month" : "all";
          const isActive = filter === value;
          return (
            <button
              key={label}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setFilter(value as any)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-all active:scale-95 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-100 dark:border-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <main className="p-4 space-y-4">

        {/* 2. Level & XP Card */}
        <div className="rounded-2xl bg-white dark:bg-[#1a2230] p-5 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex flex-col gap-1 flex-[2_2_0px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Level 5</span>
              </div>
              <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">Scholar</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total XP: 2,450</p>
            </div>
            {/* 3D Avatar */}
            <div
              className="size-20 bg-center bg-no-repeat bg-cover rounded-full shrink-0 border-4 border-white dark:border-[#1a2230] shadow-lg"
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCfI0LRlb6ojn6ES8pPuNX6uHAvB07eI__Bo5bSVqTx5kJs09rnfn0YKPyEktq3Qr3VATv1nzH9-B_akF_1Z0Hld_mj9bPDdYr-LZDdft2I_M1jKOZaJI9J9XpPq4SuHGkccdWn09-HA6mg_QsMo_wFsWtJnnc6ImvgakgNGH1GGGc5JfM1LQNcTS1bWregFRj3iUib271jDSLnzhBaYxvHEHe4nXO60L6H7nspSgjCMCdeikD4Q3vEVHbMDXSNPwTiW-w8tdj9wg")'}}
            ></div>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col gap-2 mt-4 relative z-10">
            <div className="flex gap-6 justify-between items-end">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Next: 3000 XP</p>
              <p className="text-primary text-xs font-bold">550 XP to go</p>
            </div>
            <div className="rounded-full bg-gray-100 dark:bg-gray-700 h-2.5 overflow-hidden">
              <div className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(19,91,236,0.4)]" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>

        {/* 3. Streak Banner */}
        <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 dark:bg-orange-900/40 p-2 rounded-full flex items-center justify-center text-orange-500">
              <span className="material-symbols-outlined material-symbols-filled">local_fire_department</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-white text-sm font-bold">7 Day Streak!</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Keep learning to maintain it</p>
            </div>
          </div>
          <button className="text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">Calendar</button>
        </div>

        {/* 4. Stats Grid (2x2) */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon="quiz" color="text-primary" bg="bg-blue-50 dark:bg-blue-900/20" value="42" label="Total Tests" />
          <StatCard icon="percent" color="text-green-500" bg="bg-green-50 dark:bg-green-900/20" value="88%" label="Avg Score" />
          <StatCard icon="schedule" color="text-purple-500" bg="bg-purple-50 dark:bg-purple-900/20" value="12h 30m" label="Time Active" />
          <StatCard icon="school" color="text-pink-500" bg="bg-pink-50 dark:bg-pink-900/20" value="350" label="Words Learned" />
        </div>

        {/* 5. Chart Section */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white dark:bg-[#1a2230] shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <p className="text-slate-900 dark:text-white text-base font-bold">Performance</p>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
              Last 7 Days <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </div>
          </div>

          {/* CSS Bar Chart */}
          <div className="flex items-end justify-between h-35 gap-2 pt-4">
            <ChartBar day="Mon" height="40%" />
            <ChartBar day="Tue" height="65%" />
            <ChartBar day="Wed" height="35%" />
            <ChartBar day="Thu" height="85%" active />
            <ChartBar day="Fri" height="50%" />
            <ChartBar day="Sat" height="25%" />
            <ChartBar day="Sun" height="70%" />
          </div>
        </div>

        {/* 6. Recent Achievements */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <p className="text-slate-900 dark:text-white text-base font-bold">Achievements</p>
            <p className="text-primary text-sm font-bold cursor-pointer">View All</p>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <AchievementBadge title="Week Warrior" sub="7 day streak" icon="emoji_events" color="text-yellow-600" bg="bg-yellow-100" />
            <AchievementBadge title="Quick Mind" sub="Under 1 min" icon="psychology" color="text-blue-600" bg="bg-blue-100" />
            <AchievementBadge title="Vocab King" sub="500 words" icon="lock" color="text-slate-400" bg="bg-slate-200" locked />
          </div>
        </div>

      </main>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ icon, color, bg, value, label }: { icon: string, color: string, bg: string, value: string, label: string }) {
  return (
    <div className="bg-white dark:bg-[#1a2230] p-4 rounded-xl flex flex-col gap-3 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className={`size-10 rounded-lg flex items-center justify-center ${bg} ${color}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function ChartBar({ day, height, active }: { day: string, height: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 group h-full justify-end">
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-t-sm h-full flex items-end relative overflow-hidden">
        <div
          className={`w-full rounded-t-sm transition-all duration-500 ${active ? 'bg-primary shadow-[0_0_10px_rgba(19,91,236,0.3)]' : 'bg-primary/30 group-hover:bg-primary/50'}`}
          style={{ height }}
        ></div>
      </div>
      <span className={`text-[10px] font-bold uppercase ${active ? 'text-primary' : 'text-gray-400'}`}>{day}</span>
    </div>
  );
}

function AchievementBadge({ title, sub, icon, color, bg, locked }: { title: string, sub: string, icon: string, color: string, bg: string, locked?: boolean }) {
  return (
    <div className={`min-w-35 bg-white dark:bg-[#1a2230] p-4 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2 text-center shadow-sm ${locked ? 'opacity-60 grayscale' : ''}`}>
      <div className={`size-12 rounded-full flex items-center justify-center ${bg} ${color} mb-1`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}
