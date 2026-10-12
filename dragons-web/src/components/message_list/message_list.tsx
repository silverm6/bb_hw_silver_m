import { useGameStore } from '../../game/store';
import { Message } from './message';

import styles from './message_list.module.css';

export function MessageList() {
  const messages = useGameStore((state) => state.messages);

  if (messages.length === 0) {
    return <p>No messages</p>;
  }

  return (
    <ul className={styles.list}>
      {messages.map((message) => (
        <Message key={message.adId} message={message} />
      ))}
    </ul>
  );
}
