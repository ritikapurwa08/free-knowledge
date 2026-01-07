import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Leaderboard() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const leaderboardData = useQuery(api.users.leaderboard);
  const currentUser = useQuery(api.users.viewer);

  if (!leaderboardData || !currentUser) {
      return (
          <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
            <TopHeader title="Rankings" showBack={false} />
            <div className="p-8 text-center text-gray-500">Loading rankings...</div>
          </div>
      );
  }

  // Fallback if empty
  if (leaderboardData.length === 0) {
      return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
            <TopHeader title="Rankings" showBack={false} />
            <div className="p-8 text-center text-gray-500">No active users yet. Be the first!</div>
        </div>
      );
  }

  const topThree = leaderboardData.slice(0, 3);
  const restList = leaderboardData.slice(3);

  // Find current user rank
  const myRankIndex = leaderboardData.findIndex(u => u.name === currentUser.name); // Simple match
  const myRank = myRankIndex !== -1 ? leaderboardData[myRankIndex] : null;

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
      {topThree.length > 0 && (
        <div className="relative w-full px-4 pt-4 pb-10">
            <div className="flex items-end justify-center gap-4 mt-2">
            {/* Rank 2 */}
            {topThree[1] && (
                <div className="flex flex-col items-center w-[30%] order-1">
                    <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full border-4 border-gray-200 bg-gray-200 bg-cover bg-center" style={{backgroundImage: `url(${topThree[1].imageUrl || ""})`}}></div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-900">2</div>
                    </div>
                    <p className="font-bold text-sm truncate w-full text-center">{topThree[1].name}</p>
                    <p className="text-xs text-primary font-bold">{topThree[1].totalXp}</p>
                </div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
                <div className="flex flex-col items-center w-[35%] order-2 -mt-8 z-10">
                    <div className="relative mb-3">
                    <span className="material-symbols-outlined text-yellow-400 text-[40px] absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">crown</span>
                    <div className="w-24 h-24 rounded-full border-4 border-yellow-400 bg-yellow-400 bg-cover bg-center shadow-xl shadow-yellow-500/20" style={{backgroundImage: `url(${topThree[0].imageUrl || ""})`}}></div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-sm font-bold px-3 py-0.5 rounded-full border-2 border-white dark:border-gray-900">1</div>
                    </div>
                    <p className="font-bold text-base truncate w-full text-center">{topThree[0].name}</p>
                    <p className="text-sm text-yellow-600 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">bolt</span> {topThree[0].totalXp}
                    </p>
                </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
                <div className="flex flex-col items-center w-[30%] order-3">
                    <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full border-4 border-orange-300 bg-orange-300 bg-cover bg-center" style={{backgroundImage: `url(${topThree[2].imageUrl || ""})`}}></div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-900">3</div>
                    </div>
                    <p className="font-bold text-sm truncate w-full text-center">{topThree[2].name}</p>
                    <p className="text-xs text-primary font-bold">{topThree[2].totalXp}</p>
                </div>
            )}
            </div>
        </div>
      )}

      {/* List */}
      <div className="px-4 flex flex-col gap-3">
        {restList.map((user, index) => (
          <div key={index} className="flex items-center gap-4 bg-white dark:bg-[#1a2230] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="font-bold text-gray-400 w-6 text-center">{index + 4}</span>
            <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                {user.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : user.name[0]}
            </div>
            <p className="font-bold flex-1">{user.name}</p>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-sm">{user.totalXp} XP</span>
          </div>
        ))}
      </div>

      {/* Sticky User Stat */}
      {myRank && (
        <div className="fixed bottom-24 left-4 right-4 z-40">
            <div className="flex items-center gap-4 bg-primary text-white p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgba(19,91,236,0.35)] backdrop-blur-md">
                <div className="flex flex-col items-center justify-center w-8">
                    <span className="font-bold text-lg">{myRank.rank}</span>
                    <span className="material-symbols-outlined text-[14px] text-green-300">arrow_upward</span>
                </div>
                <div className="size-10 rounded-full bg-white/20 border-2 border-white/40 bg-cover bg-center overflow-hidden">
                    {myRank.imageUrl && <img src={myRank.imageUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                    <p className="font-bold">You</p>
                    <p className="text-xs text-blue-100">{myRank.rank <= 10 ? "Top 10" : "Keep climbing!"}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{myRank.totalXp}</p>
                    <p className="text-[10px] uppercase opacity-80">XP</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
