import { useEffect, useState, useMemo } from "react";
import { fetchAllPDFs } from "@/lib/local-api";
import {type  PDFResource } from "@/types/content";
import { TopHeader } from "@/components/layout/TopHeader";
import { Input } from "@/components/ui/input";


export default function ResourcesPage() {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");

  useEffect(() => {
    async function load() {
      const data = await fetchAllPDFs();
      setPdfs(data);
    }
    load();
  }, []);

  // Get unique subjects for filter
  const subjects = useMemo(() => {
    const rawSubjects = pdfs.map(p => p.subject);
    return ["All", ...new Set(rawSubjects)];
  }, [pdfs]);

  // Filter logic
  const filteredPdfs = useMemo(() => {
    return pdfs.filter((pdf) => {
      const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            pdf.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "All" || pdf.subject === selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }, [pdfs, searchQuery, selectedSubject]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <TopHeader title="PDF Library" showBack={true} />

      {/* Search and Filter Section */}
      <div className="p-4 pb-0 space-y-3 sticky top-16 z-10 bg-background-light dark:bg-background-dark backdrop-blur-sm">
         <Input
            placeholder="Search PDFs (e.g. Grammar, Tense)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800"
         />

         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {subjects.map(sub => (
                <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${
                        selectedSubject === sub
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
                    }`}
                >
                    {sub}
                </button>
            ))}
         </div>
      </div>

      <div className="p-4 grid gap-3">
        {filteredPdfs.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl mt-4">
             <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">folder_off</span>
             <p className="text-gray-500">No PDFs found.</p>
             {pdfs.length === 0 && (
                 <p className="text-xs text-gray-400 mt-2">
                    Use the Admin Panel to upload your first PDF.
                 </p>
             )}
          </div>
        ) : (
          filteredPdfs.map((pdf) => (
            <div key={pdf.id} className="flex items-center gap-4 bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
               <div className="size-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 shrink-0">
                 <span className="material-symbols-outlined">picture_as_pdf</span>
               </div>
               <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 rounded">{pdf.subject}</span>
                    <span className="text-[10px] text-gray-400">• {pdf.topic}</span>
                 </div>
                 <h3 className="font-bold text-sm text-[#111318] dark:text-white capitalize truncate pr-2">{pdf.title}</h3>
               </div>
               <a
                 href={pdf.url}
                 target="_blank"
                 download
                 className="size-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors shrink-0"
               >
                 <span className="material-symbols-outlined">download</span>
               </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
