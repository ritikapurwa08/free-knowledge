import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllQuizzes } from "@/lib/local-api";
import {type  QuizData } from "@/types/content";
import { TopHeader } from "@/components/layout/TopHeader";

export default function QuizList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAllQuizzes();
      setQuizzes(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <TopHeader title="Available Quizzes" showBack={true} />

      <div className="flex flex-col gap-3 p-4">
        {loading ? (
          <div className="flex justify-center p-10">
            <span className="loading-spinner text-primary">Loading...</span>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center mt-10 p-6 bg-white dark:bg-slate-900 rounded-xl">
            <p className="text-gray-500 mb-2">No quizzes found.</p>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
            >
              Go to Admin to Create
            </button>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              // We pass the full quiz object to the attempt page via state
              onClick={() => navigate('/quiz/attempt', { state: { quizData: quiz } })}
              className="group flex items-center justify-between rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">quiz</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111318] dark:text-white line-clamp-1">{quiz.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
                      {quiz.questions.length} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      {Math.floor(quiz.timeLimit / 60)}m
                    </span>
                  </div>
                </div>
              </div>
              <span className="material-symbols-outlined text-gray-300 group-hover:text-primary">chevron_right</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
