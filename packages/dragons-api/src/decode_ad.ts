import type { Logger, Message, RawMessage } from './types.ts';

export function decryptMessages(messages: RawMessage[], logger: Logger): Message[] {
  return messages.map((message) => decryptMessage(message, logger)).filter((message) => message !== undefined);
}

export function decryptMessage(message: RawMessage, logger: Logger): Message | undefined {
  if (message.encrypted === null) {
    return {
      adId: message.adId,
      message: message.message,
      reward: message.reward,
      expiresIn: message.expiresIn,
      probability: message.probability,
    };
  }
  if (message.encrypted !== 1 && message.encrypted !== 2) {
    logger.warn(`Skipping ad with unknown encryption ${message.encrypted}`);
    return;
  }

  const decodeFn = message.encrypted === 1 ? decodeBase64 : decodeROT13;

  return {
    adId: decodeFn(message.adId),
    message: decodeFn(message.message),
    reward: message.reward,
    expiresIn: message.expiresIn,
    probability: decodeFn(message.probability),
  };
}

function decodeBase64(value: string) {
  return new TextDecoder().decode(Uint8Array.fromBase64(value));
}

function decodeROT13(value: string) {
  return value
    .split('')
    .map((char) => {
      const isUpperCase = char >= 'A' && char <= 'Z';
      const isLowerCase = char >= 'a' && char <= 'z';
      if (!isUpperCase && !isLowerCase) {
        return char; // numbers and other symbols don't get affected
      }

      const firstLetterCode = (isUpperCase ? 'A' : 'a').charCodeAt(0); // 65 or 97
      const charCode = char.charCodeAt(0); // the character as a number, e.g. "A" = 65
      const alphabetIndex = charCode - firstLetterCode;
      const rotatedAlphabetIndex = (alphabetIndex + 13) % 26; // 13 forward, wrapping from z back to a

      return String.fromCharCode(firstLetterCode + rotatedAlphabetIndex); // number back to a character
    })
    .join('');
}
