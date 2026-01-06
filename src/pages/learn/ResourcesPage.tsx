import { useEffect, useState } from "react";
import { fetchAllPDFs } from "@/lib/local-api";
import {type  PDFResource } from "@/types/content";
import { TopHeader } from "@/components/layout/TopHeader";

export default function ResourcesPage() {
  const [pdfs, setPdfs] = useState<PDFResource[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchAllPDFs();
      setPdfs(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      <TopHeader title="PDF Library" />

      <div className="p-4 grid gap-3">
        {pdfs.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-xl">
             <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">folder_off</span>
             <p className="text-gray-500">No PDFs found.</p>
             <p className="text-xs text-gray-400 mt-2">
                Put .pdf files in your <code>public/pdfs</code> folder.
             </p>
          </div>
        ) : (
          pdfs.map((pdf) => (
            <div key={pdf.id} className="flex items-center gap-4 bg-white dark:bg-[#1a2230] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
               <div className="size-12 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                 <span className="material-symbols-outlined">picture_as_pdf</span>
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-sm text-[#111318] dark:text-white capitalize">{pdf.title}</h3>
                 <p className="text-xs text-gray-500">Local Resource</p>
               </div>
               <a
                 href={pdf.url}
                 target="_blank"
                 download
                 className="size-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors"
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
