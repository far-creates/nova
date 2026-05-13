'use client';

import { useState } from 'react';
import { Sentence } from './SentenceList';

export interface CorrectionResult {
  correct: number[];
  wrong: Array<{ index: number; expected: string; got: string }>;
  extra: Array<{ index: number; char: string }>;
  accuracy: number;
}

interface TextInputProps {
  sentence: Sentence;
}

export default function TextInput({ sentence }: TextInputProps) {
  const [userText, setUserText] = useState('');
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setUserText(text);
    setSaveMessage('');

    if (!text) {
      setCorrection(null);
      return;
    }

    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioTrackId: sentence.id, userText: text, saveAttempt: false }),
      });

      if (!res.ok) throw new Error('Failed to get correction');
      const result = await res.json();
      setCorrection(result);
    } catch (err) {
      console.error('Error getting correction:', err);
    }
  };

  const handleSaveAttempt = async () => {
    if (!userText.trim()) return;

    setSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioTrackId: sentence.id,
          userText,
          saveAttempt: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to save attempt');

      const result = await res.json();
      setCorrection(result);
      setSaveMessage('Attempt saved.');
    } catch (err) {
      console.error('Error saving attempt:', err);
      setSaveMessage('Could not save attempt.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Type the sentence</h2>
      <audio controls className="w-full">
        <source src={sentence.filePath} />
        Your browser does not support the audio element.
      </audio>

      <textarea
        value={userText}
        onChange={handleChange}
        placeholder="Type what you heard..."
        className="w-full p-3 border rounded resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleSaveAttempt}
          disabled={saving || !userText.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Attempt'}
        </button>
        {saveMessage && <p className="text-sm text-gray-600">{saveMessage}</p>}
      </div>

      {correction && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Accuracy:</span>
            <span className="text-2xl font-bold text-blue-600">{correction.accuracy}%</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-green-50 border border-green-200 rounded p-2 text-green-700">
              Correct chars: {correction.correct.length}
            </div>
            <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700">
              Wrong chars: {correction.wrong.length}
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-yellow-700">
              Extra chars: {correction.extra.length}
            </div>
          </div>

          {correction.wrong.length > 0 && saveMessage && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
              <div className="font-semibold text-red-800 mb-1">Mistake positions:</div>
              {correction.wrong.slice(0, 3).map((w, i) => (
                <div key={i} className="text-red-700">
                  Position {w.index}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
