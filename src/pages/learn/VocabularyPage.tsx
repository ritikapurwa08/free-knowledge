
import { useState, useEffect, useMemo, } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { loadWordSet, getTotalSets, type Word } from "@/data/words";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types ---
type ViewMode = "list" | "card";
type WordStatus = "new" | "learning" | "mastered";

interface DisplayWord extends Word {
  status: WordStatus;
}

export default function VocabularyPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Data State
  const currentSet = parseInt(searchParams.get("set") || "1");
  const totalSets = getTotalSets();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  // Convex
  const knownWordsQuery = useQuery(api.vocab.getKnownWords);
  const knownWords = useMemo(() => knownWordsQuery || [], [knownWordsQuery]);
  const markKnownMutation = useMutation(api.vocab.markWordAsKnown);

  // Card View State
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch Words
  useEffect(() => {
    async function fetchWords() {
      setLoading(true);
      const data = await loadWordSet(currentSet);
      setWords(data);
      setLoading(false);
      setCurrentIndex(0); // Reset index on set change
    }
    fetchWords();
  }, [currentSet]);

  // Merge Status
  const displayWords: DisplayWord[] = useMemo(() => {
    return words.map(w => ({
      ...w,
      status: knownWords.includes(w.id) ? "mastered" : (w.step === 1 ? "learning" : "new")
    }));
  }, [words, knownWords]);

  const handleSetChange = (newSet: number) => {
    setSearchParams({ set: newSet.toString() });
  };

  const handleMarkKnown = async (wordId: string) => {
      await markKnownMutation({ wordId });
  };

  const handleNextCard = () => {
    setCurrentIndex(prev => (prev + 1) % displayWords.length);
  };

  const rangeStart = (currentSet - 1) * 50 + 1;
  const rangeEnd = Math.min(rangeStart + 49, rangeStart + words.length - 1);

  if (loading && words.length === 0) return <div className="p-10 flex justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden font-sans max-w-[1200px] w-full mx-auto shadow-2xl">
      {/* 1. Header */}
      <header className="flex items-center px-4 pt-4 pb-2 justify-between z-10 shrink-0 bg-white/80 dark:bg-[#111318]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[#111318] dark:text-white">arrow_back_ios_new</span>
        </button>

        <h2 className="text-lg font-bold leading-tight text-center text-[#111318] dark:text-white">Knowledge Map</h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800">
             <span className="material-symbols-outlined text-amber-500 text-[18px]">diamond</span>
             <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{knownWords.length}</span>
          </div>

          <button
            onClick={() => setViewMode(prev => prev === "list" ? "card" : "list")}
            className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[#111318] dark:text-white text-[24px]">
              {viewMode === "list" ? "grid_view" : "format_list_bulleted"}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-0 no-scrollbar relative">
        {viewMode === "list" ? (
          <ListView
            data={displayWords}
            onMarkKnown={handleMarkKnown}
          />
        ) : (
          <CardView
            data={displayWords}
            currentIndex={currentIndex}
            onNext={handleNextCard}
            onMarkKnown={handleMarkKnown}
          />
        )}
      </main>

      {/* 3. Footer: Range Selector & Progress Grid */}
      <footer className="shrink-0 bg-white/80 dark:bg-[#1a2230]/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 p-4 pb-6 z-20">
        <div className="flex justify-center mb-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Range {rangeStart} - {rangeEnd}
                        <span className="material-symbols-outlined text-[18px]">expand_less</span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-60 overflow-y-auto w-48" side="top">
                    {[...Array(totalSets)].map((_, i) => {
                        const s = i + 1;
                        const start = (s - 1) * 50 + 1;
                        const end = s * 50;
                        return (
                            <DropdownMenuItem key={s} onClick={() => handleSetChange(s)} className="cursor-pointer">
                                Set {s} <span className="text-gray-400 ml-auto text-xs">({start}-{end})</span>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="grid grid-cols-10 gap-1.5 w-full max-w-sm mx-auto">
           {displayWords.map((w, i) => (
                <button
                    key={w.id}
                    onClick={() => { setCurrentIndex(i); setViewMode("card"); }}
                    className={cn(
                        "aspect-square rounded-[3px] transition-all duration-200 cursor-pointer hover:opacity-80",
                        w.status === 'mastered' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-200 dark:bg-gray-700",
                        currentIndex === i && "ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-[#1a2230] scale-110 z-10"
                    )}
                />
           ))}
           {[...Array(Math.max(0, 50 - displayWords.length))].map((_, i) => (
               <div key={`empty-${i}`} className="aspect-square rounded-[3px] bg-gray-100 dark:bg-gray-800/50 opacity-50" />
           ))}
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENT: List View ---
function ListView({
    data,
    onMarkKnown
}: {
    data: DisplayWord[],
    onMarkKnown: (id: string) => void
}) {
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 pb-24">
      {data.map((item, index) => {
        const isExpanded = expandedWordId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "group bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-3 transition-all hover:shadow-md",
               item.status === 'new' && index === 0 ? "ring-1 ring-purple-500/30 bg-purple-50/10" : ""
            )}
          >
            <div className="flex gap-4">
                {/* Small Letter Icon */}
                <div className="size-16 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                   <span className="text-2xl font-black text-gray-300 dark:text-gray-600">
                      {item.text.charAt(0).toUpperCase()}
                   </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                     <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2">{item.text}</h3>
                        {item.status === 'mastered' && (
                            <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                        )}
                     </div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.definition}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                      <button
                          onClick={() => setExpandedWordId(isExpanded ? null : item.id)}
                          className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                      >
                          {isExpanded ? "Hide" : "View More"}
                      </button>
                      {item.status !== 'mastered' && (
                          <button
                              onClick={() => {
                                  onMarkKnown(item.id);
                                  // Optional: feedback toast
                              }}
                              className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                          >
                              Already Know
                          </button>
                      )}
                  </div>
                </div>
            </div>

            {/* Inline Expanded Content */}
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p><span className="font-bold text-gray-900 dark:text-gray-100">Meaning: </span>{item.definition}</p>
                        {item.hindiSynonyms?.length > 0 && <p><span className="font-bold text-gray-900 dark:text-gray-100">Hindi: </span>{item.hindiSynonyms.join(", ")}</p>}
                        {item.examples?.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg mt-2">
                                <p className="italic text-gray-500 dark:text-gray-400">"{item.examples[0].sentence}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- SUB-COMPONENT: Card View (Refactored) ---
function CardView({
    data,
    currentIndex,
    onNext,
    onMarkKnown
}: {
    data: DisplayWord[],
    currentIndex: number,
    onNext: () => void,
    onMarkKnown: (id: string) => void
}) {
  const item = data[currentIndex];
  if (!item) return <div>End of set</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden mb-4 flex-1 relative">

        {/* Top Actions */}
        <button className="absolute top-4 right-4 bg-gray-50 dark:bg-white/5 p-2 rounded-full text-gray-400 hover:text-purple-500 transition-colors z-10">
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
        </button>

        {/* Main Card Content */}
        <div className="p-6 pb-28 flex flex-col h-full overflow-y-auto no-scrollbar">

            {/* Header: Small Logo + Word */}
            <div className="flex items-center gap-4 mb-6">
                <div className="size-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-black text-gray-400 dark:text-gray-500">
                        {item.text.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none">{item.text}</h1>
                    <span className="text-sm text-gray-400 font-medium mt-1">Set {Math.ceil(item.step / 50)}</span>
                </div>
            </div>

            {/* Meanings Area */}
            <div className="space-y-6 mb-8 flex-1">
                 {/* Hindi Meaning (Primary) */}
                 <div>
                     <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-orange-400"></span>
                        Hindi Meaning
                     </h3>
                     <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/30 px-5 py-4 rounded-2xl inline-block w-full">
                        <span className="text-xl font-bold text-orange-900 dark:text-orange-100">{item.hindiSynonyms?.[0]}</span>
                     </div>
                 </div>

                 {/* English Synonyms / Definition (Secondary) */}
                 <div>
                     <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                        Definition & Synonyms
                     </h3>
                     <div className="space-y-3">
                        <p className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                            {item.definition}
                        </p>
                        {item.englishSynonyms?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {item.englishSynonyms.map((syn, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold capitalize border border-gray-200 dark:border-gray-700">
                                        {syn}
                                    </span>
                                ))}
                            </div>
                        )}
                     </div>
                 </div>
            </div>

            <div className="mt-auto">
                {item.examples?.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-500/5 p-5 rounded-2xl border border-purple-100 dark:border-purple-500/20 relative overflow-hidden">
                         <span className="text-purple-200 dark:text-purple-900/40 text-6xl font-serif absolute -top-4 -left-2 select-none">“</span>
                        <p className="text-base font-medium text-purple-900 dark:text-purple-200 relative z-10 leading-relaxed pl-2 italic">
                            {item.examples[0].sentence}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* Bottom Actions Floating in Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-white via-white to-transparent dark:from-[#1e293b] dark:via-[#1e293b] pt-12 flex gap-3 z-10">
             <button
                onClick={onNext}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all"
                >
                Skip / Next
            </button>
            <button
                onClick={() => {
                    onMarkKnown(item.id);
                    onNext();
                }}
                className="flex-1 bg-[#2dd4bf] hover:bg-[#14b8a6] text-white font-bold py-4 rounded-2xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                >
                {item.status === 'mastered' ? 'Mastered' : 'I Know This'}
                {item.status === 'mastered' && <span className="material-symbols-outlined text-[20px]">check</span>}
            </button>
        </div>
      </div>
    </div>
  );
}
