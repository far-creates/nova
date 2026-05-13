'use client';

interface DailySummary {
  date: string;
  attemptsCount: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
}

interface ActivityHeatmapProps {
  dailySummaries: DailySummary[];
  days?: number;
}

interface DayCell {
  dateKey: string;
  date: Date;
  attemptsCount: number;
  averageAccuracy: number;
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default function ActivityHeatmap({ dailySummaries, days = 365 }: ActivityHeatmapProps) {
  const map = new Map(dailySummaries.map((d) => [d.date, d]));
  const maxAttempts = Math.max(1, ...dailySummaries.map((d) => d.attemptsCount));

  const today = startOfDay(new Date());
  const start = addDays(today, -(days - 1));
  const offset = start.getDay();
  const gridStart = addDays(start, -offset);

  const totalCells = Math.ceil((days + offset) / 7) * 7;
  const cells: DayCell[] = [];

  for (let i = 0; i < totalCells; i++) {
    const date = addDays(gridStart, i);
    const dateKey = getDateKey(date);
    const summary = map.get(dateKey);
    cells.push({
      dateKey,
      date,
      attemptsCount: summary?.attemptsCount ?? 0,
      averageAccuracy: summary?.averageAccuracy ?? 0,
    });
  }

  const weeks = Array.from({ length: totalCells / 7 }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7)
  );

  const colorFor = (cell: DayCell): string => {
    if (cell.attemptsCount === 0) return '#e5e7eb';

    const accuracyNorm = Math.max(0, Math.min(1, cell.averageAccuracy / 100));
    const volumeNorm = Math.max(0.2, Math.min(1, cell.attemptsCount / maxAttempts));

    const hue = 8 + accuracyNorm * 122; // red -> green
    const lightness = 84 - volumeNorm * 42; // low volume lighter, high volume darker
    return `hsl(${hue} 72% ${lightness}%)`;
  };

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.map((cell) => {
                const inRange = cell.date >= start && cell.date <= today;
                const dateLabel = cell.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const title = inRange
                  ? `${dateLabel} - ${cell.attemptsCount} attempts - ${cell.averageAccuracy.toFixed(1)}% avg accuracy`
                  : '';

                return (
                  <div
                    key={cell.dateKey}
                    title={title}
                    className="w-3.5 h-3.5 rounded-[3px] border border-gray-200"
                    style={{
                      backgroundColor: inRange ? colorFor(cell) : 'transparent',
                      borderColor: inRange ? '#d1d5db' : 'transparent',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-xs text-gray-600">
        <p>Each square is one day. Hue shows accuracy (red to green), depth shows attempt volume.</p>
        <div className="flex items-center gap-2">
          <span>Low</span>
          <div className="w-3.5 h-3.5 rounded-[3px] border border-gray-200 bg-gray-200" />
          <div className="w-3.5 h-3.5 rounded-[3px] border border-gray-200" style={{ backgroundColor: 'hsl(20 72% 74%)' }} />
          <div className="w-3.5 h-3.5 rounded-[3px] border border-gray-200" style={{ backgroundColor: 'hsl(72 72% 62%)' }} />
          <div className="w-3.5 h-3.5 rounded-[3px] border border-gray-200" style={{ backgroundColor: 'hsl(130 72% 46%)' }} />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
