// src/pages/admin/AdminPage.tsx
import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { QuestionForm } from "@/components/features/admin/QuestionForm";
import { BulkImportForm } from "@/components/features/admin/BulkImportForm";
import { saveQuizToDisk, uploadPDF } from "@/lib/local-api";
import {type QuizData, type  Question } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPage() {
  // Quiz Quiz Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("English");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // PDF Upload State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSubject, setPdfSubject] = useState("English");
  const [pdfTopic, setPdfTopic] = useState("Grammar");
  const [isUploading, setIsUploading] = useState(false);

  // UI State
  const [activeTab, setActiveTab] = useState<"manual" | "bulk" | "pdf">("manual");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // --- QUIZ HANDLERS ---
  const handleAddQuestion = (q: Question) => {
    setQuestions([...questions, q]);
    setIsAddingQuestion(false);
  };

  const handleBulkImport = (newQuestions: Question[]) => {
    setQuestions([...questions, ...newQuestions]);
  };

  const handleSaveQuiz = async () => {
    if (!title || !topic || questions.length === 0) {
      alert("Please enter Title, Topic and add at least one question.");
      return;
    }

    const quizId = title.toLowerCase().replace(/\s+/g, "-");

    const quizData: QuizData = {
      id: quizId,
      title,
      subject,
      topic,
      difficulty: "Medium",
      timeLimit: 600,
      questions
    };

    const result = await saveQuizToDisk(quizData);
    if (result.success) {
      alert(`✅ Saved ${quizId}.json with ${questions.length} questions!`);
      // Optional: Reset form
      // setTitle(""); setQuestions([]);
    } else {
      alert("❌ Failed to save. Check terminal for fs-server errors.");
    }
  };

  // --- PDF HANDLERS ---
  const handlePdfUpload = async () => {
    if (!pdfFile || !pdfSubject || !pdfTopic) {
        alert("Please select a file and enter Subject/Topic.");
        return;
    }

    setIsUploading(true);
    // Construct folder path: Subject/Topic
    const folderPath = `${pdfSubject}/${pdfTopic}`;

    const result = await uploadPDF(pdfFile, folderPath);
    setIsUploading(false);

    if (result.success) {
        alert("✅ PDF Uploaded Successfully!");
        setPdfFile(null);
    } else {
        alert("❌ Upload Failed: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      <TopHeader title="Admin Panel" showBack={true} />

      <main className="p-4 max-w-lg mx-auto space-y-6">

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-gray-200 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto">
          <button
            onClick={() => { setActiveTab("manual"); setIsAddingQuestion(true); }}
            className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === "manual" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-500"}`}
          >
            Quiz (Manual)
          </button>
          <button
             onClick={() => { setActiveTab("bulk"); setIsAddingQuestion(false); }}
             className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === "bulk" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-500"}`}
          >
             Quiz (JSON)
          </button>
          <button
             onClick={() => { setActiveTab("pdf"); setIsAddingQuestion(false); }}
             className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md whitespace-nowrap transition-all ${activeTab === "pdf" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-500"}`}
          >
             Upload PDF
          </button>
        </div>

        {/* --- PDF UPLOAD TAB --- */}
        {activeTab === "pdf" && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm space-y-5 border border-gray-100 dark:border-gray-800">
                <h2 className="font-bold text-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    Upload PDF Resource
                </h2>

                <div className="space-y-4">
                    <div>
                        <Label>Subject</Label>
                        {/* Use simple input for now or select if we have predefined subjects */}
                         <div className="relative">
                            <Input
                                list="subjects"
                                value={pdfSubject}
                                onChange={(e) => setPdfSubject(e.target.value)}
                                placeholder="e.g. English"
                            />
                            <datalist id="subjects">
                                <option value="English" />
                                <option value="GK" />
                                <option value="Science" />
                                <option value="Mathematics" />
                            </datalist>
                        </div>
                    </div>

                    <div>
                        <Label>Topic</Label>
                        <Input
                            value={pdfTopic}
                            onChange={(e) => setPdfTopic(e.target.value)}
                            placeholder="e.g. Grammar, History, Formulas"
                        />
                    </div>

                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 py-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                         <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />

                        {pdfFile ? (
                             <div className="flex flex-col items-center gap-2 text-green-600">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                                <span className="font-medium text-sm truncate max-w-50">{pdfFile.name}</span>
                                <span className="text-xs text-gray-400">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</span>
                             </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">cloud_upload</span>
                                <p className="text-sm text-gray-500 font-medium">Click to upload PDF</p>
                                <p className="text-xs text-gray-400">Supported format: .pdf</p>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handlePdfUpload}
                        className="w-full"
                        disabled={!pdfFile || isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload to Library"}
                    </Button>
                </div>
            </div>
        )}

        {/* --- QUIZ TABS (Existing) --- */}
        {(activeTab === "manual" || activeTab === "bulk") && (
            <>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm space-y-4">
                  <h2 className="font-bold text-xl">Create Quiz</h2>
                  <div>
                    <Label>Title</Label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Prepositions Set A" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Subject</Label>
                      <Input
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. History"
                      />
                    </div>
                    <div>
                      <Label>Topic</Label>
                      <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Grammar" />
                    </div>
                  </div>
                </div>

                {activeTab === "manual" && isAddingQuestion && (
                  <QuestionForm
                    onSave={handleAddQuestion}
                    onCancel={() => setIsAddingQuestion(false)}
                  />
                )}

                {activeTab === "bulk" && (
                  <BulkImportForm onImport={handleBulkImport} />
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg">Questions Added ({questions.length})</h3>
                    {questions.length > 0 && (
                      <button
                        onClick={() => setQuestions([])}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {questions.map((q, i) => (
                      <div key={q.id} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-gray-500">Q{i + 1}</span>
                          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{q.id}</span>
                        </div>
                        <p className="font-medium mb-2">{q.text}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`px-2 py-1 rounded border text-xs ${idx === q.correctAnswer ? "bg-green-50 border-green-200 text-green-700" : "border-gray-100 text-gray-400"}`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-4">
                  <Button
                    onClick={handleSaveQuiz}
                    className="w-full h-12 text-lg shadow-xl shadow-primary/20"
                    disabled={questions.length === 0}
                  >
                    Save Quiz File
                  </Button>
                </div>
            </>
        )}

      </main>
    </div>
  );
}
