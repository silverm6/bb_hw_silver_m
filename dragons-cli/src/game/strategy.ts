import type { Message, ShopItem } from '../api/types.ts';
import type { GameState } from './session.ts';

export interface AdStrategy {
  (ads: Message[], state: GameState): Message | undefined;
}

export interface ShopStrategy {
  (items: ShopItem[], state: GameState): ShopItem | undefined;
}
