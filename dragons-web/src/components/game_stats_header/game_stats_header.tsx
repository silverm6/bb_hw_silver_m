import clsx from 'clsx';

import { useGameStore } from '../../game/store';
import { InvestigateButton } from './investigate_button';
import { NewGameButton } from './new_game_button';

import styles from './game_stats_header.module.css';

export function GameStatsHeader() {
  const stats = useGameStore((state) => state.current);
  const reputation = useGameStore((state) => state.reputation);

  const statFields = [
    { label: 'Score', value: stats?.score },
    { label: 'Lives', value: stats?.lives },
    { label: 'Gold', value: stats?.gold },
    { label: 'Level', value: stats?.level },
    { label: 'Turn', value: stats?.turn },
    { label: 'People', value: reputation?.people },
    { label: 'State', value: reputation?.state },
    { label: 'Underworld', value: reputation?.underworld },
  ];

  return (
    <div className={styles.header}>
      <div className={styles.stats}>
        <div className={clsx(styles.stat, styles.gameId)}>
          <span className={styles.label}>Game ID</span>
          <span className={styles.value}>{stats?.gameId ?? '-'}</span>
        </div>
        {statFields.map((field) => (
          <div key={field.label} className={styles.stat}>
            <span className={styles.label}>{field.label}</span>
            <span className={styles.value}>{field.value ?? '-'}</span>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <InvestigateButton />
        <NewGameButton />
      </div>
    </div>
  );
}
