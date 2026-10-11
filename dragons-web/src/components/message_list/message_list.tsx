import type { Message as MessageData } from 'dragons-api/types';

import { Message } from './message';

interface MessageListProps {
  messages: MessageData[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return <p>No messages</p>;
  }

  return (
    <ul>
      {messages.map((message) => (
        <Message key={message.adId} message={message} />
      ))}
    </ul>
  );
}
