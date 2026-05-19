'use client';

import { calculateAccuracy } from '@/lib/accuracy';
import type { LegacyProfileAttempt } from '@/packages/api/src/profile';

interface AttemptsHistoryProps {
  attempts: AttemptWithSentence[];
}

export interface AttemptWithSentence {
  id: string;
  sentenceId: string;
  sentenceText: string;
  userText: string;
  createdAt: string;
}

export type AttemptHistoryItem = LegacyProfileAttempt;

export default function AttemptsHistory({ attempts }: AttemptsHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 70) return 'bg-blue-500';
    if (accuracy >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (attempts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">No attempts yet. Start typing to track your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Attempts History</h3>
      <div className="space-y-3">
        {attempts.map(attempt => {
          const accuracy = calculateAccuracy(attempt.sentenceText, attempt.userText);
          return (
            <div
              key={attempt.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-300 hover:shadow-lg transition"
            >
              {/* Header with accuracy badge */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 font-medium">Sentence</p>
                  <p className="text-gray-900 font-medium">{attempt.sentenceText}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-white font-bold text-sm ${getAccuracyBadgeColor(accuracy)}`}>
                  {accuracy.toFixed(1)}%
                </div>
              </div>

              {/* Your typing */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-medium">Your typing</p>
                <p className="text-gray-700 bg-gray-50 p-2 rounded text-sm">{attempt.userText}</p>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Correct</p>
                  <p className="text-sm font-semibold text-green-600">
                    {Array.from(attempt.sentenceText).filter((char, i) =>
                      char.toLowerCase() === (attempt.userText[i] || '').toLowerCase()
                    ).length} / {attempt.sentenceText.length} chars
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Date</p>
                  <p className="text-sm text-gray-700">{formatDate(attempt.createdAt)}</p>
                </div>
              </div>

              {/* Visual character comparison */}
              <div className="mb-2">
                <p className="text-xs text-gray-600 font-medium mb-1">Character-by-character</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(attempt.sentenceText).map((char, i) => {
                    const typedChar = attempt.userText[i];
                    const isCorrect = char.toLowerCase() === (typedChar || '').toLowerCase();
                    const isMissing = !typedChar;

                    return (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded font-mono ${
                          isMissing
                            ? 'bg-gray-100 text-gray-600 border border-gray-300'
                            : isCorrect
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        title={`${isCorrect ? '✓' : '✗'} Expected: "${char}", Got: "${typedChar || '-'}"`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
