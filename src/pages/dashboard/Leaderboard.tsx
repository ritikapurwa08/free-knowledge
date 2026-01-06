import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";

// Mock Data
const LEADERBOARD_DATA = [
  { id: 1, name: "Rahul", score: 1500, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYPCZvTWP4vzn_BhjFryAqa0Xp0wBISL6mFGxkt6bLLzvtfE9Pba_usQs78qYfwCfIUxwzP-tW0TNqW9bOJIXnvIH1HT8TBjbTN3L9X-Mh5_jJaVUBydTE7sWGVR8xSbEM3SQgJr_-l61VWA97VB0hX5q7bw5_U72Jl4y_9mdegHd6dIssPmKQfJjbJNlKE3FmuAijsengPV2RGF1k1O0FDFYJRNy6PKf3jJRq6o1XD6DIOomQaM26OmlBFPHBo1AvD3UO0Ra_nQ" },
  { id: 2, name: "Priya", score: 1450, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlwnokF-tWEoSAf9n_JGvN9zhrLIcAB-JleOvDM_tU53Zi6gDP_-tHti84ZvXyLKtO6NYaQXB3oyGFuOWGVH5aT4UmLwwzsAcuz_s6NcNUZ-hrUSU2D0Ayl5rh4aKNhCfEJwEeDzLPaV_IpMn2xusp6FD-KiKiG6isXcSP_ISEXFagIY_ucQQWaf6I6M7Q2nzJkQy12qk6FvWBpSDbjpMmX-YrZP0mNktkFBKz3gdNkDlay_baUuF-vlGPtdxoR5gjkwmQVvaHQg" },
  { id: 3, name: "Amit", score: 1400, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2rIoBnNQqJFWv3SBy_V73GYNvo6DcgGT-b4_lvKo0Aqf1ZmuUf01Vj1zbd-cuzohkwwSn7eMVokUCGEXd-uqPNN9hZMk0iQvqFv-t9WQIriyX1K99tq6fZjybGflfqjzN50d49vUiLposce51dSkAA7n4H5fyFF_22IQZV6efYaaaG-hFhKIQa6VZLeXw2dk_PGwGNywdqdr7dg6J7IpwkzEJFaBJ48sy16rRDNYT7xwHslEWT73mNyCoSMTuAexlHPEuTO0mkA" },
  { id: 4, name: "Aarav", score: 1200 },
  { id: 5, name: "Neha", score: 1150 },
  { id: 6, name: "Rohan", score: 1100 },
];

export default function Leaderboard() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <TopHeader title="Rankings" showBack={false} />

      {/* Tabs */}
      <div className="px-4 py-4 sticky top-15 z-30 bg-background-light dark:bg-background-dark">
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-1 shadow-sm border border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setPeriod("weekly")}
            className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${period === 'weekly' ? 'bg-primary text-white shadow-md' : 'text-gray-500'}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`flex-1 h-full rounded-lg text-sm font-semibold transition-all ${period === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-gray-500'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Podium */}
      <div className="relative w-full px-4 pt-4 pb-10">
        <div className="flex items-end justify-center gap-4 mt-2">
          {/* Rank 2 */}
          <div className="flex flex-col items-center w-[30%] order-1">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-gray-200 bg-gray-200 bg-cover bg-center" style={{backgroundImage: `url(${LEADERBOARD_DATA[1].avatar})`}}></div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-900">2</div>
            </div>
            <p className="font-bold text-sm truncate w-full text-center">{LEADERBOARD_DATA[1].name}</p>
            <p className="text-xs text-primary font-bold">{LEADERBOARD_DATA[1].score}</p>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center w-[35%] order-2 -mt-8 z-10">
            <div className="relative mb-3">
              <span className="material-symbols-outlined text-yellow-400 text-[40px] absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">crown</span>
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-yellow-400 bg-cover bg-center shadow-xl shadow-yellow-500/20" style={{backgroundImage: `url(${LEADERBOARD_DATA[0].avatar})`}}></div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-sm font-bold px-3 py-0.5 rounded-full border-2 border-white dark:border-gray-900">1</div>
            </div>
            <p className="font-bold text-base truncate w-full text-center">{LEADERBOARD_DATA[0].name}</p>
            <p className="text-sm text-yellow-600 font-bold flex items-center gap-1">
               <span className="material-symbols-outlined text-[16px]">bolt</span> {LEADERBOARD_DATA[0].score}
            </p>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center w-[30%] order-3">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full border-4 border-orange-300 bg-orange-300 bg-cover bg-center" style={{backgroundImage: `url(${LEADERBOARD_DATA[2].avatar})`}}></div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-900">3</div>
            </div>
            <p className="font-bold text-sm truncate w-full text-center">{LEADERBOARD_DATA[2].name}</p>
            <p className="text-xs text-primary font-bold">{LEADERBOARD_DATA[2].score}</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-4 flex flex-col gap-3">
        {LEADERBOARD_DATA.slice(3).map((user, index) => (
          <div key={user.id} className="flex items-center gap-4 bg-white dark:bg-[#1a2230] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="font-bold text-gray-400 w-6 text-center">{index + 4}</span>
            <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500">
                {user.name[0]}
            </div>
            <p className="font-bold flex-1">{user.name}</p>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-sm">{user.score} XP</span>
          </div>
        ))}
      </div>

      {/* Sticky User Stat */}
      <div className="fixed bottom-24 left-4 right-4 z-40">
        <div className="flex items-center gap-4 bg-primary text-white p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgba(19,91,236,0.35)] backdrop-blur-md">
            <div className="flex flex-col items-center justify-center w-8">
                <span className="font-bold text-lg">24</span>
                <span className="material-symbols-outlined text-[14px] text-green-300">arrow_upward</span>
            </div>
            <div className="size-10 rounded-full bg-white/20 border-2 border-white/40 bg-cover bg-center" style={{backgroundImage: `url(${LEADERBOARD_DATA[0].avatar})`}}></div>
            <div className="flex-1">
                <p className="font-bold">You</p>
                <p className="text-xs text-blue-100">Top 20%</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg">850</p>
                <p className="text-[10px] uppercase opacity-80">XP</p>
            </div>
        </div>
      </div>
    </div>
  );
}
