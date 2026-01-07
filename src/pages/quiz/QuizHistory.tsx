import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { fetchAllQuizzes } from "@/lib/local-api";
import { type QuizData } from "@/types/content";
import { useState, useEffect } from "react";

export default function QuizHistory() {
  const navigate = useNavigate();
  const history = useQuery(api.quiz.getHistory);
  const [quizzes, setQuizzes] = useState<Record<string, QuizData>>({});

  useEffect(() => {
    async function load() {
        const data = await fetchAllQuizzes();
        const quizMap = data.reduce((acc, q) => ({ ...acc, [q.id]: q }), {} as Record<string, QuizData>);
        setQuizzes(quizMap);
    }
    load();
  }, []);

  const totalQuizzes = history?.length || 0;
  const avgScore = totalQuizzes > 0
    ? Math.round(history!.reduce((acc, curr) => acc + (curr.score / curr.maxScore), 0) / totalQuizzes * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopHeader title="Quiz History" />

      {/* 1. Stats Overview */}
      <section className="px-4 py-4">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-3xl font-bold text-primary">{totalQuizzes}</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Quizzes</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="text-3xl font-bold text-green-500">{avgScore}%</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg. Score</span>
          </div>
        </div>
      </section>

      {/* 2. Filter Tabs */}
      {/* 2. Filter Tabs (Temporarily Removed or can be re-enabled if needed) */}
      {/*
      <div className="sticky top-15 z-20 bg-background-light dark:bg-background-dark pt-2 pb-4 border-b border-gray-100 dark:border-gray-800/50">
           ...
      </div>
      */}

      {/* 3. History List */}
      <div className="flex flex-col gap-4 px-4 pb-4 mt-4">

        {/* Item 1: High Score */}
        {history?.map((attempt) => {
            const quiz = quizzes[attempt.quizId];
            if (!quiz) return null; // Quiz might be deleted or not loaded yet

            const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
            let colorClass = "green";
            if (percentage < 50) colorClass = "red";
            else if (percentage < 80) colorClass = "yellow";

            return (
                <div
                    key={attempt._id}
                    onClick={() => navigate('/quiz/review', {
                        state: {
                            quizData: quiz,
                            answers: JSON.parse(attempt.answers),
                            score: attempt.score,
                            totalQuestions: attempt.maxScore
                        }
                    })}
                    className="group relative flex items-center justify-between gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm transition-all active:scale-[0.98] border border-gray-100 dark:border-gray-800 cursor-pointer"
                >
                    <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-lg bg-${colorClass}-500`}></div>
                    <div className="flex items-center gap-4 pl-2">
                        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-${colorClass}-50 dark:bg-${colorClass}-900/20 text-${colorClass}-600 dark:text-${colorClass}-400`}>
                            <span className="material-symbols-outlined">
                                {percentage >= 80 ? "emoji_events" : percentage >= 50 ? "check_circle" : "cancel"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base font-bold leading-tight text-[#111318] dark:text-white line-clamp-1">{quiz.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                                <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className={`font-medium text-${colorClass}-600 dark:text-${colorClass}-400`}>{attempt.score}/{attempt.maxScore} Correct</span>
                            </div>
                            <span className="text-xs font-medium text-primary mt-1 flex items-center gap-1 group-hover:underline">
                                View Review <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">chevron_right</span>
                </div>
            );
        })}
        {history?.length === 0 && (
            <div className="text-center p-8 text-gray-500">
                <p>No quiz history yet.</p>
                <button onClick={() => navigate('/quiz')} className="text-primary font-bold mt-2">Take a Quiz</button>
            </div>
        )}

      </div>
    </div>
  );
}
