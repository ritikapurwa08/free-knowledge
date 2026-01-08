
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TopHeader } from "@/components/layout/TopHeader";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function QuizHistory() {
  const navigate = useNavigate();
  const history = useQuery(api.history.getHistory);

  // Filters
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");

  // Derive unique options
  const subjects = useMemo(() => {
      if (!history) return [];
      return ["All", ...new Set(history.map(h => h.quizSubject))];
  }, [history]);

  const topics = useMemo(() => {
      if (!history) return [];
      const relevant = subjectFilter === "All" ? history : history.filter(h => h.quizSubject === subjectFilter);
      return ["All", ...new Set(relevant.map(h => h.quizTopic))];
  }, [history, subjectFilter]);

  // Filtered Data
  const filteredHistory = useMemo(() => {
    if (!history) return [];
    return history.filter(item => {
        const matchSubject = subjectFilter === "All" || item.quizSubject === subjectFilter;
        const matchTopic = topicFilter === "All" || item.quizTopic === topicFilter;
        return matchSubject && matchTopic;
    }).sort((a, b) => {
        if (sortOrder === "Newest") return b.completedAt - a.completedAt;
        if (sortOrder === "Oldest") return a.completedAt - b.completedAt;
        if (sortOrder === "Highest Score") return (b.score / b.maxScore) - (a.score / a.maxScore);
        return 0;
    });
  }, [history, subjectFilter, topicFilter, sortOrder]);

  if (history === undefined) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <TopHeader
        title="History"
        showBack={true}
        onBack={() => navigate(-1)}
        rightAction={<div className="w-10" />} // Spacer
      />

      <div className="p-4 space-y-4 max-w-2xl mx-auto">

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white dark:bg-[#1a2230] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-400 uppercase">Subject</label>
                 <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                 </Select>
             </div>
             <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-400 uppercase">Topic</label>
                 <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                        {topics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                 </Select>
             </div>
             <div className="space-y-1 col-span-2 md:col-span-1">
                 <label className="text-xs font-bold text-gray-400 uppercase">Sort By</label>
                 <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Newest">Newest First</SelectItem>
                        <SelectItem value="Oldest">Oldest First</SelectItem>
                        <SelectItem value="Highest Score">Best Score</SelectItem>
                    </SelectContent>
                 </Select>
             </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
             <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
                 <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{filteredHistory.length}</div>
                 <div className="text-xs text-blue-500/80 font-bold uppercase">Quizzes</div>
             </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800 text-center">
                 <div className="text-2xl font-black text-green-600 dark:text-green-400">
                    {filteredHistory.length > 0
                        ? Math.round(filteredHistory.reduce((acc, h) => acc + (h.score/h.maxScore)*100, 0) / filteredHistory.length)
                        : 0}%
                 </div>
                 <div className="text-xs text-green-500/80 font-bold uppercase">Avg Score</div>
             </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800 text-center">
                 <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {filteredHistory.reduce((acc, h) => acc + h.score * 10, 0)}
                 </div>
                 <div className="text-xs text-purple-500/80 font-bold uppercase">Total XP</div>
             </div>
        </div>

        {/* List */}
        <div className="space-y-3">
            {filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No history found.</div>
            ) : filteredHistory.map((item, i) => (
                <div
                    key={i}
                    onClick={() => {
                        try {
                            // Safe parsing of answers
                            const answers = typeof item.answers === 'string' ? JSON.parse(item.answers) : item.answers;
                            navigate('/quiz/review', {
                                state: {
                                    quizId: item.quizId,
                                    answers,
                                    score: item.score,
                                    totalQuestions: item.maxScore // Assuming 1 point per question
                                }
                            });
                        } catch (e) {
                            console.error("Failed to parse answers", e);
                        }
                    }}
                    className="flex flex-col bg-white dark:bg-[#1a2230] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-gray-100">{item.quizTitle}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold">{item.quizSubject}</span>
                                <span>•</span>
                                <span>{item.quizTopic}</span>
                            </p>
                        </div>
                        <div className="text-right">
                             <div className={`text-xl font-black ${
                                 (item.score / item.maxScore) >= 0.8 ? 'text-green-500' :
                                 (item.score / item.maxScore) >= 0.5 ? 'text-orange-500' : 'text-red-500'
                             }`}>
                                 {item.score}/{item.maxScore}
                             </div>
                             <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Score</div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800/50 mt-1">
                        <span className="text-xs text-gray-400 font-mono">
                            {format(item.completedAt, "dd MMM yyyy, hh:mm a")}
                        </span>
                        <div className="flex gap-2">
                            {/* We could add 'Review' button here if we stored answers properly */}
                            <span className="text-xs font-bold text-gray-300 dark:text-gray-600">Completed</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}
