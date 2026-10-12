import { useGameStore } from '../../game/store';

import styles from './action_history.module.css';

export function ActionHistory() {
  const entries = useGameStore((state) => state.history);

  if (entries.length === 0) {
    return <p>Nothing happened yet</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.row}>
          <span className={styles.turn}>Turn {entry.turn}</span>
          <span>{entry.text}</span>
        </li>
      ))}
    </ul>
  );
}
