import type { Game } from 'dragons-api/types';

import styles from './game_stats_header.module.css';
import { NewGameButton } from './new_game_button';

interface GameStatsHeaderProps {
  stats?: Game;
}

export function GameStatsHeader({ stats }: GameStatsHeaderProps) {
  const statFields = [
    { label: 'Lives', value: stats?.lives },
    { label: 'Gold', value: stats?.gold },
    { label: 'Level', value: stats?.level },
    { label: 'Score', value: stats?.score },
    { label: 'High score', value: stats?.highScore },
    { label: 'Turn', value: stats?.turn },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.stats}>
        {statFields.map((field) => (
          <div key={field.label} className={styles.stat}>
            <span className={styles.label}>{field.label}</span>
            <span className={styles.value}>{field.value ?? '-'}</span>
          </div>
        ))}
      </div>
      <NewGameButton hasGame={stats !== undefined} />
    </header>
  );
}
