import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// --- Types ---
type ViewMode = "list" | "card";
type WordStatus = "new" | "learning" | "mastered";

interface WordData {
  id: number;
  word: string;
  pronunciation?: string;
  meaningEn: string;
  meaningHi: string;
  image: string;
  status: WordStatus;
  description: string;
}

// --- Mock Data (Matching your HTML) ---
const VOCAB_DATA: WordData[] = [
  {
    id: 1,
    word: "Developer",
    pronunciation: "/dɪˈveləpər/",
    meaningEn: "A person or company that creates new things, like software.",
    meaningHi: "डेवलपर (जो नई चीजों का निर्माण करता है)",
    description: "A person who creates software or buildings.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1Rma-Gl0yhlw_VnuFT8aF29xvrgbfH5xOWOYclcWTuFgJaX-iSOApzZvVQitNavjUUKOFtctu8YINagxkR7d6MzFlLlugEf9jeAXAhdT7U2hYFsq3W0UyX6BCOUX07TGvvS9SRMi4vHDsSSSpFkFDeSgGOAku2VsLY4BfZXzar4mbzsEQ71bwKb6A3G_GB238rxX7WkV9JFF3bvxsguWQY-HDqi7hQNEYzWZs-VfUzgMnNtgfxjpz8coBjtjiEf5sYJ43OLHunw",
    status: "new"
  },
  {
    id: 2,
    word: "Speaker",
    meaningEn: "A person who speaks.",
    meaningHi: "वक्ता",
    description: "A person who delivers a speech or lecture.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaNAqeI8giDw0kX8tNLxPDEe_KC7UkRDpFucPC4i11N0JcmUdRn1HMG9W2Jo-ARAVMZJdAfW5hiaiQgy7ZZ4dFcK34NssvvKDCYo4IR0bkg_AuWHwQk1KbA8iN2eYlURpcikxIQbE222FQOa0fTVhtDMNF1AuGqg2RnS2nLCcimbpcgB935y0upbYHIRQRM9xZ6OrQFW9pEKWb8tNBd2p_F5I1je588vTgO6FATRfmsn8ly30-EZLID7aNai_-5-TmlsO1BmCcyw",
    status: "mastered"
  },
  {
    id: 3,
    word: "Chart",
    meaningEn: "A visual display of information.",
    meaningHi: "चार्ट / आलेख",
    description: "A graphical representation of data.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYr7lBbqNbrbSJwbs-JQB6o0iwBScPXxtyQK6xBCbfUAtS7dAlUt5tT8Xno83522iz3yP5BoN3Qv5p5zXE9PuFpaWhEThoDpjiOFyTxN7YGdktcmVHXAcSgbKzcwTK2GifoMz1eGVOTDdbY1ONkucFlEGvUOSVWR0ft7FiPER0NMu12RVPuCt5YDwnzFXw-Hke3-kjK4M3Szzh5r8SD6_225W0P9qeRektoz3ZM4n6vHLTBVPuGFMtgEgRWXmchi2_iHf4CbHH1w",
    status: "mastered"
  },
  {
    id: 4,
    word: "Species",
    meaningEn: "A group of living organisms.",
    meaningHi: "प्रजाति",
    description: "A class of individuals having some common characteristics.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0zf4L1p7O9TlbMcazwR0Nb1lDvuMG62a2S9g2Vx7jUVAWDfc31Sh2CysWiBA_mLJt0dbMoEWQvGZDQ7-CRsDtE8dy4BUoXE8MSaUY0gnO6Tt_FaDF6e6Gr5toynAj8N4JCzXTWOq6PZKMqfu9wzSlG0J43oeruq4b_4Xhn5mEnxk9E3gotQD2uiHKyrlSVhrYPHL2QiBywnyjka_VAvWQLA7R53s4nsBa3muCMWX7ECmh_BXXTbIbaj7kugGtLRQyG42KMJokpQ",
    status: "learning"
  },
  {
    id: 5,
    word: "Colleague",
    meaningEn: "A person with whom one works.",
    meaningHi: "सहकर्मी",
    description: "An associate or coworker in a profession.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlaT4XtQF7T4jBAYuWWuOINh3KGTNdJ49lU1NsZofoJC79qfwrxpaFT5w_EoYlpybRGrbktGeLc-jBhe5VK1RFY6l62JykOJT9NRAPvGkLRImBdil-tAazu_qGZEGQX1i3rxvrn6muXMUzwi-vMzcEKVHllqCMwZp60BnGw9nQRkm63vGr7kyy3KhMYq3Acrw4qkR7GUfGVnJahL6ZdduLGHHxCg25ZgAntJV8Gx54PWxr_K5nwEGsgbTEqcaVO6aZq_1bbEg",
    status: "new"
  }
];

export default function VocabularyPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // State for Card View (current focused word)
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark overflow-hidden">

      {/* 1. Header (Knowledge Map) */}
      <header className="flex items-center px-4 pt-6 pb-2 justify-between z-10 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-[#111318] dark:text-white">arrow_back_ios_new</span>
        </button>

        <h2 className="text-lg font-bold leading-tight text-center text-[#111318] dark:text-white">Knowledge Map</h2>

        <div className="flex items-center gap-3">
          {/* Gem Count */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="material-symbols-outlined text-amber-400 text-[18px] material-symbols-filled">diamond</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">10</span>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setViewMode(prev => prev === "list" ? "card" : "list")}
            className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[#111318] dark:text-white text-[26px]">
              {viewMode === "list" ? "grid_view" : "format_list_bulleted"}
            </span>
          </button>
        </div>
      </header>

      {/* 2. Range Selector & Progress Grid */}
      <div className="px-4 py-2 shrink-0">
        <div className="flex justify-center mb-4">
          <button className="bg-white dark:bg-[#1a2230] border border-gray-100 dark:border-gray-700 px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-sm">
            Range 1,501 - 1,600
            <span className="material-symbols-outlined text-[20px]">expand_more</span>
          </button>
        </div>

        {/* The Grid of Squares (20 items) */}
        <div className="grid grid-cols-20 gap-0.5 w-full px-1 mb-2">
          {/* Simulated progress based on HTML */}
          <div className="aspect-square bg-[#2dd4bf] rounded-[1px]"></div> {/* Teal */}
          <div className="aspect-square bg-[#2dd4bf]/80 rounded-[1px]"></div>
          <div className="aspect-square bg-[#2dd4bf] rounded-[1px]"></div>
          <div className="aspect-square bg-blue-400 rounded-[1px]"></div>
          <div className="aspect-square bg-purple-500 rounded-[1px]"></div> {/* Active */}
          {[...Array(15)].map((_, i) => (
             <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-[1px]"></div>
          ))}
        </div>
      </div>

      {/* 3. Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pb-20 no-scrollbar">
        {viewMode === "list" ? (
          <ListView data={VOCAB_DATA} onSelect={(index) => { setCurrentIndex(index); setViewMode("card"); }} />
        ) : (
          <CardView
            data={VOCAB_DATA}
            currentIndex={currentIndex}
            onNext={() => setCurrentIndex(prev => (prev + 1) % VOCAB_DATA.length)}
          />
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: List View ---
function ListView({ data, onSelect }: { data: WordData[], onSelect: (idx: number) => void }) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      {data.map((item, index) => (
        <div
          key={item.id}
          onClick={() => onSelect(index)}
          className={cn(
            "bg-white dark:bg-[#1a2230] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex h-32 hover:shadow-md transition-all cursor-pointer",
            item.status === "new" && index === 0 ? "ring-2 ring-purple-500/20" : "" // Highlight first new item
          )}
        >
          {/* Left Image */}
          <div className="w-28 h-full bg-gray-200 dark:bg-gray-800 relative shrink-0">
            <img src={item.image} alt={item.word} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="flex-1 p-3 pl-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className={cn("text-base font-bold", item.status === "new" && index === 0 ? "text-purple-600 dark:text-purple-400" : "text-[#111318] dark:text-white")}>
                  {item.word}
                </h3>

                {/* Status Icons */}
                {item.status === "mastered" && <span className="material-symbols-outlined text-green-500 text-[18px] material-symbols-filled">check_circle</span>}
                {item.status === "learning" && <span className="size-4 block rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></span>}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              <p className="text-sm font-medium text-[#111318] dark:text-white mt-1">{item.meaningHi}</p>
            </div>

            {/* Status Button (Bottom) */}
            <div className="mt-2">
              {item.status === "mastered" && (
                <div className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 w-fit">
                   Already Know <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </div>
              )}
              {item.status === "learning" && (
                <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1 w-fit">
                   Learning <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                </div>
              )}
              {item.status === "new" && (
                <div className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-md flex-1 text-center w-20">
                  Learn
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SUB-COMPONENT: Card View ---
function CardView({ data, currentIndex, onNext }: { data: WordData[], currentIndex: number, onNext: () => void }) {
  const item = data[currentIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-[#1a2230] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden mb-4 flex-1">

        {/* Large Image Area */}
        <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-700 shrink-0">
          <img src={item.image} alt={item.word} className="w-full h-full object-cover" />
          <button className="absolute top-4 right-4 bg-white/60 dark:bg-black/40 backdrop-blur-sm p-1.5 rounded-full hover:bg-white dark:hover:bg-black transition-colors">
            <span className="material-symbols-outlined text-[#111318] dark:text-white text-[20px]">more_horiz</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-0.5">
            <h1 className="text-3xl font-bold text-[#111318] dark:text-white">{item.word}</h1>
            <button className="text-gray-400 hover:text-primary transition-colors mt-1">
              <span className="material-symbols-outlined text-[24px]">volume_up</span>
            </button>
          </div>

          <p className="text-lg text-gray-400 font-light mb-4">{item.pronunciation || "/.../"}</p>

          <p className="text-[17px] text-primary dark:text-purple-400 font-medium leading-relaxed mb-3">
             {item.meaningHi}
          </p>

          <p className="text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 font-medium">
             {item.meaningEn}
          </p>

          <div className="flex justify-end mt-auto mb-6">
            <a href="#" className="text-sm text-gray-400 underline decoration-gray-300 underline-offset-2 hover:text-gray-600 transition-colors">Learn more...</a>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="grid grid-cols-2 gap-3 mt-auto pb-4">
        <button
          onClick={onNext}
          className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-purple-200 dark:shadow-none"
        >
            Should Learn
        </button>
        <button
          onClick={onNext}
          className="bg-[#2dd4bf] hover:bg-[#14b8a6] active:scale-95 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-teal-100 dark:shadow-none"
        >
            Already Knew
        </button>
      </div>
    </div>
  );
}
