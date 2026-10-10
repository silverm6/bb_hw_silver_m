import { HEALING_POTION_API_ID, type ShopItem } from '../../api/types.ts';
import type { GameState } from '../session.ts';
import type { ShopStrategy } from '../strategy.ts';

function pickCheapestItem(items: ShopItem[], state: GameState) {
  return items
    .filter((item) => item.cost <= state.gold) // 1. keep only items you can afford right now
    .toSorted((a, b) => a.cost - b.cost)[0]; // 2. sort by cheapest first
}

function pickMostExpensiveItem(items: ShopItem[], state: GameState) {
  return items
    .filter((item) => item.cost <= state.gold) // 1. keep only items you can afford right now
    .toSorted((a, b) => b.cost - a.cost)[0]; // 2. sort most expensive first
}

function pickOptimalItem(items: ShopItem[], state: GameState) {
  const potion = items.find((item) => item.id === HEALING_POTION_API_ID)!;
  if (state.lives === 1 && potion.cost <= state.gold) {
    return potion;
  }

  return items
    .filter((item) => item.id !== HEALING_POTION_API_ID)
    .filter((item) => item.cost <= state.gold - potion.cost) // 1. keep only items you can afford while keeping enough for a potion
    .toSorted((a, b) => b.cost - a.cost)[0]; // 2. sort by most expensive first
}

export const shopStrategies = new Map<string, ShopStrategy>([
  ['cheapest', pickCheapestItem],
  ['most-expensive', pickMostExpensiveItem],
  ['optimal', pickOptimalItem],
]);
