// src/components/features/admin/QuestionForm.tsx
import { useState } from "react";
import {type  Question } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  onSave: (q: Question) => void;
  onCancel: () => void;
}

export function QuestionForm({ onSave, onCancel }: Props) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState("");

  const handleOptionChange = (index: number, val: string) => {
    const newOpts = [...options];
    newOpts[index] = val;
    setOptions(newOpts);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOpts = options.filter((_, i) => i !== index);
    setOptions(newOpts);
    if (correctAnswer >= index && correctAnswer > 0) {
        setCorrectAnswer(correctAnswer - 1);
    }
  };

  const handleSubmit = () => {
    if (!text || options.some(o => !o)) {
      alert("Please fill all fields");
      return;
    }

    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text,
      type: "Single Choice",
      options,
      correctAnswer,
      explanation
    };

    onSave(newQuestion);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 space-y-4">
      <h3 className="font-bold text-lg">Add New Question</h3>

      <div>
        <Label>Question Text</Label>
        <Textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter question..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Options (Select the correct radio button)</Label>
        <div className="space-y-2 mt-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={correctAnswer === idx}
                onChange={() => setCorrectAnswer(idx)}
                className="size-4 shrink-0"
              />
              <Input
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
              />
              {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(idx)}
                    className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                     <span className="material-symbols-outlined text-[18px]">delete</span>
                  </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2 w-full border-dashed">
            <span className="material-symbols-outlined text-[18px] mr-1">add</span> Add Option
          </Button>
        </div>
      </div>

      <div>
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={explanation}
          onChange={e => setExplanation(e.target.value)}
          placeholder="Why is this answer correct?"
          className="mt-1"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Question</Button>
      </div>
    </div>
  );
}
