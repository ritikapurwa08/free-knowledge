import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllQuizzes } from "@/lib/local-api";
import { type QuizData } from "@/types/content";
import { TopHeader } from "@/components/layout/TopHeader";

type Step = "SUBJECT" | "TOPIC" | "QUIZ";

export default function QuizList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection State
  const [step, setStep] = useState<Step>("SUBJECT");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");

  useEffect(() => {
    async function load() {
      const data = await fetchAllQuizzes();
      setQuizzes(data);
      setLoading(false);
    }
    load();
  }, []);

  // Derived filters
  const subjects = [...new Set(quizzes.map(q => q.subject))];

  const topicsForSubject = quizzes
    .filter(q => q.subject === selectedSubject)
    .map(q => q.topic)
    .filter((v, i, a) => a.indexOf(v) === i); // Unique

  const quizzesForTopic = quizzes.filter(
    q => q.subject === selectedSubject && q.topic === selectedTopic
  );

  // Handlers
  const handleBack = () => {
    if (step === "QUIZ") setStep("TOPIC");
    else if (step === "TOPIC") setStep("SUBJECT");
    else navigate(-1); // Go back to home
  };

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setStep("TOPIC");
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setStep("QUIZ");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <span className="loading-spinner text-primary">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <TopHeader
        title={
            step === "SUBJECT" ? "Select Subject" :
            step === "TOPIC" ? selectedSubject :
            selectedTopic
        }
        showBack={true}
        onBack={handleBack}
        rightAction={
            <button
                onClick={() => navigate('/quiz/history')}
                className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                title="Quiz History"
            >
                <span className="material-symbols-outlined">history</span>
            </button>
        }
      />

      <div className="p-4 max-w-lg mx-auto">

        {/* STEP 1: SUBJECTS */}
        {step === "SUBJECT" && (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-right-4">
            {subjects.map(subject => (
              <div
                key={subject}
                onClick={() => handleSelectSubject(subject)}
                className="aspect-square flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#1a2230] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-95 transition-all hover:border-primary/50 group"
              >
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[28px]">
                    {subject === "English" ? "school" : "lightbulb"}
                  </span>
                </div>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{subject}</span>
              </div>
            ))}
            {subjects.length === 0 && (
                <div className="col-span-2 text-center text-gray-400 py-10">No quizzes available.</div>
            )}
          </div>
        )}

        {/* STEP 2: TOPICS */}
        {step === "TOPIC" && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-right-4">
            <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Select Topic</h2>
            {topicsForSubject.map(topic => (
               <div
                key={topic}
                onClick={() => handleSelectTopic(topic)}
                className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2230] rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer active:scale-[0.98] hover:border-primary/30 group"
              >
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">topic</span>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{topic}</span>
                </div>
                <span className="material-symbols-outlined text-gray-300">chevron_right</span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 3: QUIZZES */}
        {step === "QUIZ" && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-right-4">
             <h2 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Available Quizzes</h2>
            {quizzesForTopic.map(quiz => (
              <div
                key={quiz.id}
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
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-primary">play_arrow</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
