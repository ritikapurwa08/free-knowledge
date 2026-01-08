import { useNavigate } from "react-router-dom";
import { TopHeader } from "@/components/layout/TopHeader";

import { useLocation } from "react-router-dom";
import { type QuizData } from "@/types/content";
import { cn } from "@/lib/utils";
import { fetchAllQuizzes } from "@/lib/local-api";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function QuizReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as
    | {
        quizData?: QuizData;
        quizId?: string;
        answers: Record<number, number>;
        score: number;
        totalQuestions: number;
      }
    | undefined;

  const [localQuiz, setLocalQuiz] = useState<QuizData | null>(null);

  // 1. Try resolving local quiz (Legacy IDs)
  useEffect(() => {
    if (!state?.quizData && state?.quizId) {
      if (state.quizId.includes("-")) {
        // Heuristic for legacy IDs
        fetchAllQuizzes().then((all) => {
          const found = all.find((q) => q.id === state.quizId);
          if (found) setLocalQuiz(found);
        });
      }
    }
  }, [state?.quizId, state?.quizData]);

  // 2. Try resolving Convex Quiz
  const convexQuizId =
    state?.quizId && !state.quizId.includes("-")
      ? (state.quizId as Id<"quizzes">)
      : null;

  const convexQuiz = useQuery(
    api.quiz.getQuiz,
    convexQuizId ? { quizId: convexQuizId } : "skip"
  );

  // 3. Unify Data
  const quizData = useMemo<QuizData | null>(() => {
    if (state?.quizData) return state.quizData;
    if (localQuiz) return localQuiz;
    if (convexQuiz) {
      // Adapt Convex doc to QuizData
      return {
        id: convexQuiz._id,
        title: convexQuiz.title,
        subject: convexQuiz.subject,
        topic: convexQuiz.topic,
        questions: convexQuiz.questions.map((q, i) => ({
          ...q,
          id: `q-${i}`,
          subject: convexQuiz.subject,
          topic: convexQuiz.topic,
          difficulty: "Medium",
          type: q.type as "Single Choice" | "Multiple Choice",
        })),
        timeLimit: 60 * 10, // Default 10m
        difficulty: "Medium",
      };
    }
    return null;
  }, [state?.quizData, localQuiz, convexQuiz]);

  const [nextQuiz, setNextQuiz] = useState<QuizData | null>(null);

  useEffect(() => {
    async function findNext() {
      if (!quizData) return;
      const allQuizzes = await fetchAllQuizzes();
      // Find other quizzes with same subject & topic, excluding current one
      const others = allQuizzes.filter(
        (q) =>
          q.subject === quizData.subject &&
          q.topic === quizData.topic &&
          q.id !== quizData.id
      );
      // Simple logic: just pick the first one found (or could be smarter)
      if (others.length > 0) {
        setNextQuiz(others[0]);
      }
    }
    findNext();
  }, [quizData]);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No result data found.</p>
        <button onClick={() => navigate("/quiz")} className="text-primary ml-2">
          Go back
        </button>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-2">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
        <p className="text-gray-500">Loading quiz details...</p>
      </div>
    );
  }

  const { answers, score, totalQuestions } = state;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <TopHeader title="Review Answers" showBack={true} />

      {/* 1. Stats Section */}
      <section className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-primary mb-1 text-[28px]">
              trophy
            </span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Score
            </p>
            <p className="text-xl font-bold text-[#111318] dark:text-white">
              {score}/{totalQuestions}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-purple-500 mb-1 text-[28px]">
              timer
            </span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Time
            </p>
            <p className="text-xl font-bold text-[#111318] dark:text-white">
              {Math.floor(quizData.timeLimit / 60)}m
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <span className="material-symbols-outlined text-green-500 mb-1 text-[28px]">
              check_circle
            </span>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Accuracy
            </p>
            <p className="text-xl font-bold text-[#111318] dark:text-white">
              {percentage}%
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-3 text-center border border-primary/20">
          <span className="material-symbols-outlined text-primary text-sm">
            info
          </span>
          <p className="text-sm font-medium text-primary">
            {percentage >= 80
              ? "Great job! You're mastering this topic."
              : percentage >= 50
                ? "Good effort! Keep practicing."
                : "Don't give up! Review the answers and try again."}
          </p>
        </div>
      </section>

      <div className="px-4 pb-2 pt-2">
        <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111318] dark:text-white">
          Question Analysis
        </h3>
      </div>

      {/* 2. Question List */}
      <div className="flex flex-col gap-6 px-4 pb-6">
        {quizData.questions.map((q, index) => {
          const userAnswer = answers[index];
          const isCorrect = userAnswer === q.correctAnswer;
          const isSkipped = userAnswer === undefined;

          return (
            <div
              key={q.id || index}
              className="rounded-xl bg-white dark:bg-[#1a2230] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded">
                    Question {index + 1}
                  </span>
                  {isSkipped ? (
                    <span className="flex items-center gap-1 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">
                        remove
                      </span>{" "}
                      Skipped
                    </span>
                  ) : isCorrect ? (
                    <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>{" "}
                      Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">
                        close
                      </span>{" "}
                      Incorrect
                    </span>
                  )}
                </div>
                <h2
                  className="text-lg font-bold leading-tight text-[#111318] dark:text-white"
                  dangerouslySetInnerHTML={{ __html: q.text }}
                />
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* User Answer */}
                {!isSkipped && (
                  <div
                    className={cn(
                      "flex items-start gap-3 rounded-lg border-2 p-3",
                      isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-red-500 bg-red-50 dark:bg-red-900/20"
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white",
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      )}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {isCorrect ? "check" : "close"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {q.options[userAnswer]}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-medium mt-0.5",
                          isCorrect
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        Your Answer
                      </p>
                    </div>
                  </div>
                )}

                {/* Correct Answer if user was wrong or skipped */}
                {(!isCorrect || isSkipped) && (
                  <div className="flex items-start gap-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900/20 p-3">
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                      <span className="material-symbols-outlined text-[14px]">
                        check
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400 font-medium mt-0.5">
                        Correct Answer
                      </p>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 p-4 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-lg">
                        lightbulb
                      </span>
                      <p className="text-primary font-bold text-sm">
                        Explanation
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#1a2230] p-4 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 flex gap-4">
        <button
          onClick={() => navigate("/quiz")}
          className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-800 py-3.5 text-center text-base font-bold text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Quiz List
        </button>
        {nextQuiz && (
          <button
            onClick={() =>
              navigate("/quiz/attempt", { state: { quizData: nextQuiz } })
            }
            className="flex-1 rounded-xl bg-primary py-3.5 text-center text-base font-bold text-white shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Next Set{" "}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
