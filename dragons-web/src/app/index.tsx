import { ActionHistory } from '@/components/action_history/action_history';
import { GameStatsHeader } from '@/components/game_stats_header/game_stats_header';
import { MessageList } from '@/components/message_list/message_list';
import { ShopList } from '@/components/shop_list/shop_list';
import { MOCK_HISTORY, MOCK_MESSAGES, MOCK_SHOP_ITEMS, MOCK_STATS } from '@/game/mock_data';

import styles from './app.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <GameStatsHeader />
      <div className={styles.board}>
        <div className={styles.card}>
          <h3>Messages</h3>
          <MessageList messages={MOCK_MESSAGES} />
        </div>
        <div className={styles.card}>
          <h3>Shop</h3>
          <ShopList items={MOCK_SHOP_ITEMS} gold={MOCK_STATS.gold} />
        </div>
      </div>
      <div className={styles.card}>
        <h3>Action history</h3>
        <ActionHistory entries={MOCK_HISTORY} />
      </div>
    </div>
  );
}
