// src/pages/admin/AdminPage.tsx
import { useState } from "react";
import { TopHeader } from "@/components/layout/TopHeader";
import { QuestionForm } from "@/components/features/admin/QuestionForm";
import { BulkImportForm } from "@/components/features/admin/BulkImportForm"; // Import new component
import { saveQuizToDisk } from "@/lib/local-api";
import {type QuizData, type  Question } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPage() {
  // Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("English");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<"manual" | "bulk">("manual");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Handlers
  const handleAddQuestion = (q: Question) => {
    setQuestions([...questions, q]);
    setIsAddingQuestion(false);
  };

  const handleBulkImport = (newQuestions: Question[]) => {
    setQuestions([...questions, ...newQuestions]);
  };

  const handleSaveFile = async () => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      <TopHeader title="Admin Panel" showBack={true} />

      <main className="p-4 max-w-lg mx-auto space-y-6">

        {/* 1. Quiz Meta Data */}
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

        {/* 2. Add Method Toggle */}
        <div className="flex gap-2 bg-gray-200 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab("manual"); setIsAddingQuestion(true); }}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "manual" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-500"}`}
          >
            Manual Entry
          </button>
          <button
             onClick={() => { setActiveTab("bulk"); setIsAddingQuestion(false); }}
             className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "bulk" ? "bg-white dark:bg-slate-700 shadow-sm" : "text-gray-500"}`}
          >
            Paste JSON
          </button>
        </div>

        {/* 3. Input Forms */}
        {activeTab === "manual" && isAddingQuestion && (
          <QuestionForm
            onSave={handleAddQuestion}
            onCancel={() => setIsAddingQuestion(false)}
          />
        )}

        {activeTab === "bulk" && (
          <BulkImportForm onImport={handleBulkImport} />
        )}

        {/* 4. Preview List */}
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

        {/* 5. Save Button */}
        <div className="sticky bottom-4">
          <Button
            onClick={handleSaveFile}
            className="w-full h-12 text-lg shadow-xl shadow-primary/20"
            disabled={questions.length === 0}
          >
            Save Quiz File
          </Button>
        </div>

      </main>
    </div>
  );
}
