import type { Message as MessageData } from 'dragons-api/types';

import { useGameStore } from '../../game/store';

import styles from './message_list.module.css';

interface MessageProps {
  message: MessageData;
}

export function Message({ message }: MessageProps) {
  const solveMessage = useGameStore((state) => state.solveMessage);
  const isPending = useGameStore((state) => state.isPending);

  return (
    <li className={styles.row}>
      <div>{message.message}</div>
      <div className={styles.messageDetails}>
        <span className={styles.messageInfo}>
          {message.reward} gold · expires in {message.expiresIn} · {message.probability}
        </span>
        <button
          type="button"
          aria-label={`Solve ${message.message}`}
          disabled={isPending}
          onClick={() => solveMessage(message.adId)}>
          Solve
        </button>
      </div>
    </li>
  );
}
