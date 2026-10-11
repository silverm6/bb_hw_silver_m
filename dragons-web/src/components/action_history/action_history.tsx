import type { HistoryEntry } from '@/game/types';

interface ActionHistoryProps {
  entries: HistoryEntry[];
}

export function ActionHistory({ entries }: ActionHistoryProps) {
  if (entries.length === 0) {
    return <p>Nothing happened yet</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <span>{entry.text}</span>
          <small>turn {entry.turn}</small>
        </li>
      ))}
    </ul>
  );
}
