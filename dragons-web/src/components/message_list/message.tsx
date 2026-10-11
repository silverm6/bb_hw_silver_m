import type { Message as MessageData } from 'dragons-api/types';

interface MessageProps {
  message: MessageData;
}

export function Message({ message }: MessageProps) {
  return (
    <li>
      <div>
        <div>{message.message}</div>
        <small>
          {message.reward} gold · expires in {message.expiresIn}
        </small>
      </div>
      <span>{message.probability}</span>
      <button type="button">Solve</button>
    </li>
  );
}
