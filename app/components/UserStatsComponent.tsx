'use client';

import type { LegacyUserStats } from '@/packages/api/src/profile';

interface UserStatsProps {
  stats: UserStats;
}

export type UserStats = LegacyUserStats;

export default function UserStatsComponent({ stats }: UserStatsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-blue-600';
    if (accuracy >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Attempts */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAttempts}</p>
        <p className="text-gray-500 text-xs mt-2">
          Last: {formatDate(stats.lastAttempt)}
        </p>
      </div>

      {/* Average Accuracy */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
        <p className="text-gray-600 text-sm font-medium">Average Accuracy</p>
        <p className={`text-3xl font-bold mt-2 ${getAccuracyColor(stats.averageAccuracy)}`}>
          {stats.averageAccuracy.toFixed(1)}%
        </p>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all"
            style={{ width: `${stats.averageAccuracy}%` }}
          ></div>
        </div>
      </div>

      {/* Best Accuracy */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-gray-600 text-sm font-medium">Best Accuracy</p>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {stats.bestAccuracy > 0 ? `${stats.bestAccuracy.toFixed(1)}%` : '-'}
        </p>
        <p className="text-gray-500 text-xs mt-2">Highest score</p>
      </div>

      {/* Worst Accuracy */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
        <p className="text-gray-600 text-sm font-medium">Worst Accuracy</p>
        <p className="text-3xl font-bold text-red-600 mt-2">
          {stats.worstAccuracy > 0 ? `${stats.worstAccuracy.toFixed(1)}%` : '-'}
        </p>
        <p className="text-gray-500 text-xs mt-2">Lowest score</p>
      </div>
    </div>
  );
}
