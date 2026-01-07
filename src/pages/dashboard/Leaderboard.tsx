
import { TopHeader } from "@/components/layout/TopHeader";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
  const navigate = useNavigate();

  const leaderboardData = useQuery(api.users.leaderboard);

  const isLoading = leaderboardData === undefined;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      <TopHeader title="Rankings" showBack={false} />

      <div className="p-4 max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>

          {isLoading ? (
            <div className="h-8 w-24 bg-linear-to-r from-gray-200 to-gray-300 rounded-full animate-pulse dark:from-gray-700 dark:to-gray-600" />
          ) : (
            <Badge variant="secondary" className="text-sm">
              {leaderboardData?.length ?? 0} players
            </Badge>
          )}
        </div>

        {/* Skeleton or Real List */}
        <div className="space-y-3">
          {isLoading ? (
            // PERFECT SKELETONS
            Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center p-4 bg-card border rounded-xl animate-pulse"
              >
                <div className="w-12 h-12 bg-linear-to-r from-gray-200 to-gray-300 rounded-full dark:from-gray-700 dark:to-gray-600" />

                <div className="flex-1 ml-4 space-y-2">
                  <div className="h-5 w-32 bg-linear-to-r from-gray-200 to-gray-300 rounded-full dark:from-gray-700 dark:to-gray-600" />
                  <div className="h-4 w-20 bg-linear-to-r from-gray-200 to-gray-300 rounded-full dark:from-gray-700 dark:to-gray-600" />
                </div>

                <div className="w-16 h-10 bg-linear-to-r from-blue-200 to-blue-300 rounded-lg dark:from-blue-800 dark:to-blue-900 flex items-center justify-center">
                  <div className="h-6 w-6 bg-linear-to-r from-blue-300 to-blue-400 rounded-full dark:from-blue-900 dark:to-blue-700" />
                </div>
              </motion.div>
            ))
          ) : (
            // Real leaderboard
            leaderboardData?.map((user,) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center p-4 hover:bg-accent/50 rounded-xl transition-all duration-200 cursor-pointer border hover:border-primary/50"
                onClick={() => navigate(`/profile/${user.name}`)} // Using name/id as per structure
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback className="font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 ml-4">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user.totalXp.toLocaleString()} XP
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <span className="font-bold text-xl">#{user.rank}</span>
                  <Trophy className="w-5 h-5" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
