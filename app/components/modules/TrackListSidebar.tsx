'use client';

import Card from '@/app/components/ui/Card';
import Button from '@/app/components/ui/Button';
import { useLocale } from '@/app/context/LocaleContext';
import type { LegacyTrackPayload } from '@/packages/api/src/tracks';

interface TrackListSidebarProps {
  tracks: LegacyTrackPayload[];
  currentTrackId?: string | null;
  onSelectTrack: (track: LegacyTrackPayload) => void;
  loading?: boolean;
  error?: string | null;
}

export default function TrackListSidebar({
  tracks,
  currentTrackId,
  onSelectTrack,
  loading = false,
  error = null,
}: TrackListSidebarProps) {
  const { messages } = useLocale();

  return (
    <Card variant="data" padding="md" className="space-y-4">
      <div className="space-y-1">
        <p className="font-ui-en text-xs uppercase tracking-[0.18em] text-[color:var(--color-text-soft)]">
          {messages.practicePage.trackLibrary}
        </p>
        <h3 className="text-lg font-bold text-[color:var(--color-text)]">
          {messages.practicePage.chooseSentence}
        </h3>
      </div>

      {loading ? (
        <p className="text-sm text-[color:var(--color-text-muted)]">{messages.common.loading}</p>
      ) : error ? (
        <p className="text-sm text-[color:var(--color-danger)]">{error}</p>
      ) : (
        <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
          {tracks.map((track) => {
            const selected = track.id === currentTrackId;
            return (
              <Button
                key={track.id}
                type="button"
                variant={selected ? 'soft' : 'ghost'}
                size="md"
                onClick={() => onSelectTrack(track)}
                className="h-auto w-full justify-start rounded-[var(--radius-md)] px-4 py-3 text-left"
              >
                <span className="block min-w-0">
                  <span className="block truncate text-sm font-semibold text-[color:var(--color-text)]">
                    {track.title}
                  </span>
                  <span className="font-ui-en mt-1 block text-xs uppercase tracking-[0.12em] text-[color:var(--color-text-soft)]">
                    Level {String(track.difficulty).toUpperCase()}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
