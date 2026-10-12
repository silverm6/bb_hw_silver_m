import clsx from 'clsx';
import { Toaster } from 'sonner';

import { ActionHistory } from '../components/action_history/action_history';
import { GameStatsHeader } from '../components/game_stats_header/game_stats_header';
import { MessageList } from '../components/message_list/message_list';
import { ShopList } from '../components/shop_list/shop_list';

import styles from './app.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <Toaster richColors />
      <GameStatsHeader />
      <div className={styles.board}>
        <div className={clsx(styles.section, styles.boardSection)}>
          <h3>Messages</h3>
          <MessageList />
        </div>
        <div className={clsx(styles.section, styles.boardSection)}>
          <h3>Shop</h3>
          <ShopList />
        </div>
      </div>
      <div className={styles.section}>
        <h3>Action history</h3>
        <ActionHistory />
      </div>
    </div>
  );
}
