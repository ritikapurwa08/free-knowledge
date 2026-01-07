import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllQuizzes, fetchAllPDFs } from "@/lib/local-api";
import {type QuizData,type PDFResource } from "@/types/content";

type ContentItem =
  | { type: "quiz"; data: QuizData }
  | { type: "pdf"; data: PDFResource };

export default function Learn() {
  const navigate = useNavigate();

  // State
  const [selectedSubject, setSelectedSubject] = useState("English");
  const [searchQuery, setSearchQuery] = useState("");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [quizzes, pdfs] = await Promise.all([
          fetchAllQuizzes(),
          fetchAllPDFs()
        ]);

        const merged: ContentItem[] = [
          ...quizzes.map(q => ({ type: "quiz" as const, data: q })),
          ...pdfs.map(p => ({ type: "pdf" as const, data: p }))
        ];

        setContent(merged);
      } catch (e) {
        console.error("Failed to load content", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter Data
  const filteredContent = useMemo(() => {
    return content.filter(item => {
      const { subject, title, topic } = item.data;
      const matchesSubject = subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [content, selectedSubject, searchQuery]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-32">
      {/* 1. Header & Search */}
      <div className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white">Library</h2>
          <div className="relative">
             <input
                className="pl-8 pr-4 py-2 rounded-full bg-white dark:bg-[#1a2230] shadow-sm text-sm outline-none border border-transparent focus:border-primary w-32 focus:w-48 transition-all"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             <span className="material-symbols-outlined absolute left-2 top-1.5 text-gray-400 text-lg">search</span>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="flex w-full gap-6 overflow-x-auto px-4 no-scrollbar">
          {["English", "GK", "Reasoning", "Maths"].map((sub) => (
            <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`flex flex-col items-center pb-2 border-b-2 transition-colors ${
                    selectedSubject === sub
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-gray-500 font-medium"
                }`}
            >
              <span className="text-sm">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* 2. Topic Chips (Static for now, could be dynamic) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Nouns", "Tenses", "Verbs", "Idioms"].map((chip, i) => (
            <button
              key={chip}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium shadow-sm transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-[#1a2230] text-gray-600 dark:text-gray-300'}`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 3. Quick Access Sections */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate('/learn/vocabulary')}
            className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="size-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
              <span className="material-symbols-outlined">style</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Flashcards</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn 500+ words</p>
          </div>

          <div
            onClick={() => navigate('/learn/resources')}
            className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <span className="material-symbols-outlined">folder</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">PDF Library</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Download notes</p>
          </div>
        </div>

        {/* 4. Recommended Content List (REAL DATA) */}
        <div>
            <h3 className="font-bold text-lg mb-3">Recommended for {selectedSubject}</h3>

            {isLoading ? (
                <div className="text-center py-8 text-gray-400">Loading content...</div>
            ) : filteredContent.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-xl">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">sentiment_dissatisfied</span>
                    <p className="text-gray-500">No content found for {selectedSubject}</p>
                    <p className="text-xs text-gray-400 mt-1">Try switching subjects or search query.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredContent.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 bg-white dark:bg-[#1a2230] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                                if (item.type === 'quiz') {
                                    // Navigate to Quiz Attempt
                                    // Need to pass state or just navigate. Using quick-start route or similar based on existing structure.
                                    // Assuming existing flow requires quiz object.
                                    navigate('/quiz/attempt', { state: { quiz: item.data } });
                                } else {
                                    // Open PDF
                                    window.open(item.data.url, '_blank');
                                }
                            }}
                        >
                            <div className={`size-12 rounded-lg flex items-center justify-center text-white ${
                                item.type === 'quiz' ? 'bg-orange-400' : 'bg-red-400'
                            }`}>
                                <span className="material-symbols-outlined">
                                    {item.type === 'quiz' ? 'quiz' : 'picture_as_pdf'}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{item.data.title}</h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    {item.type === 'quiz' ? 'Quiz Attempt' : 'PDF Document'} • {item.data.topic}
                                </p>
                            </div>

                            <button className="size-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-[18px]">
                                    {item.type === 'quiz' ? 'play_arrow' : 'download'}
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}
