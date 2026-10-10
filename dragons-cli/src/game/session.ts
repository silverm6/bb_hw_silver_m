import type { APIClient } from '../api/client.ts';
import type { Message, ShopItem } from '../api/types.ts';
import { logger } from '../logger.ts';

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
  ads(): Promise<Message[]>;
  shop(): Promise<ShopItem[]>;
  solve(adId: string): Promise<string>;
  buy(itemId: string): Promise<boolean>;
}

export async function startGameSession(client: APIClient): Promise<GameSession> {
  logger.info('Starting a new game...');
  const game = await client.startGame();

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
    ads() {
      return client.getAds(game.gameId);
    },
    shop() {
      return client.getShopItems(game.gameId);
    },
    async solve(adId) {
      const result = await client.solveMessage(game.gameId, adId);

      state = {
        ...state,
        lives: result.lives,
        gold: result.gold,
        score: result.score,
        turn: result.turn,
      };

      return result.message;
    },
    async buy(itemId) {
      const result = await client.purchaseItem(game.gameId, itemId);

      state = {
        ...state,
        lives: result.lives,
        gold: result.gold,
        level: result.level,
        turn: result.turn,
      };

      return result.shoppingSuccess;
    },
  };
}
