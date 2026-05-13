'use client';

import { useEffect, useState } from 'react';

export interface Sentence {
  id: string;
  title: string;
  filePath: string;
  difficulty: string;
  createdAt: string;
}

interface SentenceListProps {
  onSelect: (sentence: Sentence) => void;
}

export default function SentenceList({ onSelect }: SentenceListProps) {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentences = async () => {
      try {
        const res = await fetch('/api/tracks');
        if (!res.ok) throw new Error('Failed to fetch tracks');
        const data = await res.json();
        setSentences(data);
      } catch (err) {
        setError('Error loading tracks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentences();
  }, []);

  if (loading) return <div className="p-4">Loading tracks...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Audio Tracks</h2>
      {sentences.map((sentence) => (
        <button
          key={sentence.id}
          onClick={() => onSelect(sentence)}
          className="w-full p-3 text-left border rounded hover:bg-gray-50 transition"
        >
          <div className="text-sm font-medium">{sentence.title}</div>
          <div className="text-xs text-gray-500 mt-1">{sentence.difficulty}</div>
        </button>
      ))}
    </div>
  );
}
