import { getMessages, getShopItems, purchaseItem, solveMessage, startGame } from "../api/client.ts";
import type { Message, PurchaseItem, ShopItem, SolveMessage } from "../api/types.ts";
import { logger } from "../logger.ts";

export interface GameState {
  lives: number;
  gold: number;
  score: number;
  level: number;
  turn: number;
}

export interface GameSession {
  readonly gameId: string;
  state(): GameState;
  messages(): Promise<Message[]>;
  shop(): Promise<ShopItem[]>;
  solve(adId: string): Promise<SolveMessage>;
  buy(itemId: string): Promise<PurchaseItem>;
}

export async function startGameSession(): Promise<GameSession> {
  logger.info("Starting a new game...");
  const game = await startGame();

  let state: GameState = {
    lives: game.lives,
    gold: game.gold,
    score: game.score,
    level: game.level,
    turn: game.turn,
  };

  return {
    gameId: game.gameId,

    state() {
      return { ...state };
    },
    async messages() {
      const messages = await getMessages(game.gameId);

      return messages
        .map((message) => decryptMessage(message))
        .filter((message) => message !== undefined);
    },
    shop() {
      return getShopItems(game.gameId);
    },
    async solve(adId) {
      const result = await solveMessage(game.gameId, adId);

      state = {
        ...state,
        lives: result.lives,
        gold: result.gold,
        score: result.score,
        turn: result.turn,
      };

      return result;
    },
    async buy(itemId) {
      const result = await purchaseItem(game.gameId, itemId);

      state = {
        ...state,
        lives: result.lives,
        gold: result.gold,
        level: result.level,
        turn: result.turn,
      };

      return result;
    },
  };
}

function decryptMessage(message: Message) {
  if (message.encrypted === null) {
    return message;
  }
  if (message.encrypted !== 1 && message.encrypted !== 2) {
    logger.warn(`Skipping ad with unknown encryption ${message.encrypted}`);
    return;
  }

  const decode = message.encrypted === 1 ? decodeBase64 : decodeROT13;

  return {
    ...message,
    adId: decode(message.adId),
    message: decode(message.message),
    probability: decode(message.probability),
  };
}

function decodeBase64(value: string) {
  return new TextDecoder().decode(Uint8Array.fromBase64(value));
}

function decodeROT13(value: string) {
  return value
    .split("")
    .map((char) => {
      const isUpperCase = char >= "A" && char <= "Z";
      const isLowerCase = char >= "a" && char <= "z";
      if (!isUpperCase && !isLowerCase) {
        return char; // numbers and other symbols don't get affected
      }

      const firstLetterCode = (isUpperCase ? "A" : "a").charCodeAt(0); // 65 or 97
      const charCode = char.charCodeAt(0); // the character as a number, e.g. "A" = 65
      const alphabetIndex = charCode - firstLetterCode;
      const rotatedAlphabetIndex = (alphabetIndex + 13) % 26; // 13 forward, wrapping from z back to a

      return String.fromCharCode(firstLetterCode + rotatedAlphabetIndex); // number back to a character
    })
    .join("");
}
