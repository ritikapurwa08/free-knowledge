// src/components/features/admin/BulkImportForm.tsx
import { useState } from "react";
import { type Question, type Subject } from "@/data/quizzes/quiz.question.type";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const SUBJECTS: Subject[] = ["English", "Math", "Science", "Raj Geography", "Raj History", "Biology", "Chemistry", "Physics", " Raj Culture"];

export function BulkImportForm() {
  const [jsonInput, setJsonInput] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState<Subject>("English");
  const [topic, setTopic] = useState("Grammar");
  const [error, setError] = useState<string | null>(null);

  const createQuiz = useMutation(api.quiz.createQuiz);

  const handleImport = async () => {
    setError(null);
    if (!title.trim()) {
        toast.error("Please enter a Title (e.g., Set 1)");
        return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      if (!Array.isArray(parsed)) {
        throw new Error("Input must be an Array [...]");
      }

      // Map and Validate to valid TS code structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validQuestions: Question[] = parsed.map((item: any, index): Question => {
        // Validation checks
        if (!item.text) throw new Error(`Item ${index + 1} missing 'text'`);
        if (!Array.isArray(item.options) || item.options.length < 2) {
          throw new Error(`Item ${index + 1} invalid 'options'`);
        }
        if (typeof item.correctAnswer !== 'number') {
           throw new Error(`Item ${index + 1} missing 'correctAnswer' index`);
        }

        return {
          id: `${Date.now()}-${index}`, // Temp ID, not stored in DB usually
          text: item.text,
          type: "Single Choice",
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation || "",
          subject: subject,
          topic: topic,
          difficulty: "Medium"
        };
      });

      // Send to Convex
      await createQuiz({
        title: title,
        subject: subject,
        topic: topic,
        questions: validQuestions.map(q => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            type: q.type
        }))
      });

      toast.success(`Successfully published "${title}" with ${validQuestions.length} questions!`);
      setJsonInput("");
      setTitle("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
      toast.error("Format Error");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Create Quiz Set</h3>
        <span className="text-xs text-blue-500 cursor-pointer hover:underline" onClick={() => setJsonInput(EXAMPLE_JSON)}>
          Load Example
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
            <Label>Title (e.g. Set 1)</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Set 1" />
          </div>
          <div>
            <Label>Subject</Label>
             <Select value={subject} onValueChange={(val) => setSubject(val as Subject)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                    {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Topic</Label>
            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Nouns" />
          </div>
      </div>

      <div>
        <Label>Paste Simple JSON Array here</Label>
        <Textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder='[ { "text": "Question?", "options": ["A", "B"], "correctAnswer": 0 } ]'
          className="mt-1 font-mono text-xs h-48"
        />
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700 text-white">
          <span className="material-symbols-outlined mr-2">cloud_upload</span>
          Publish to Database
        </Button>
      </div>
    </div>
  );
}

const EXAMPLE_JSON = `[
  {
    "text": "What is the synonym of Happy?",
    "options": ["Sad", "Joyful", "Angry", "Tired"],
    "correctAnswer": 1,
    "explanation": "Joyful means feeling, expressing, or causing great pleasure and happiness."
  },
  {
    "text": "Which tense is used here: 'I have eaten'?",
    "options": ["Present Simple", "Past Simple", "Present Perfect", "Future"],
    "correctAnswer": 2
  }
]`;
