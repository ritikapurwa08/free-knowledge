// src/components/features/admin/BulkImportForm.tsx
import { useState } from "react";
import {type  Question } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  onImport: (questions: Question[]) => void;
}

export function BulkImportForm({ onImport }: Props) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleParse = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonInput);

      if (!Array.isArray(parsed)) {
        throw new Error("Input must be an Array [...]");
      }

      // Map and Validate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validQuestions: Question[] = parsed.map((item: any, index) => {
        // Validation checks
        if (!item.text) throw new Error(`Item ${index + 1} missing 'text'`);
        if (!Array.isArray(item.options) || item.options.length < 2) {
          throw new Error(`Item ${index + 1} invalid 'options'`);
        }
        if (typeof item.correctAnswer !== 'number') {
           throw new Error(`Item ${index + 1} missing 'correctAnswer' index`);
        }

        // Return clean object matching our Type
        return {
          id: `q-${Date.now()}-${index}`, // Auto-generate ID
          text: item.text,
          type: "Single Choice",
          options: item.options,
          correctAnswer: item.correctAnswer,
          explanation: item.explanation || "",
          imageUrl: item.imageUrl || ""
        };
      });

      onImport(validQuestions);
      setJsonInput(""); // Clear input on success
      alert(`Successfully added ${validQuestions.length} questions!`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Invalid JSON format");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Bulk Import JSON</h3>
        <span className="text-xs text-blue-500 cursor-pointer hover:underline" onClick={() => setJsonInput(EXAMPLE_JSON)}>
          Load Example
        </span>
      </div>

      <div>
        <Label>Paste JSON Array here</Label>
        <Textarea
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder='[ { "text": "Question?", "options": ["A", "B"], "correctAnswer": 0 } ]'
          className="mt-1 font-mono text-xs h-48"
        />
        {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleParse} className="bg-green-600 hover:bg-green-700">
          Parse & Add Questions
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
