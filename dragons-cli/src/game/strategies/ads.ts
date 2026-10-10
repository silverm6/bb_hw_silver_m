import type { Message } from '../../api/types.ts';
import type { AdStrategy } from '../strategy.ts';

function pickLowestReward(ads: Message[]) {
  return ads.toSorted((a, b) => a.reward - b.reward)[0];
}

function pickHighestReward(ads: Message[]) {
  return ads.toSorted((a, b) => b.reward - a.reward)[0];
}

function pickOptimal(ads: Message[]) {
  return ads.toSorted((a, b) => {
    // 1. sort by highest first
    if (a.reward !== b.reward) {
      return b.reward - a.reward;
    }
    // 2. closest to expiring as second sort
    return a.expiresIn - b.expiresIn;
  })[0];
}

export const adStrategies = new Map<string, AdStrategy>([
  ['cheapest', pickLowestReward],
  ['most-expensive', pickHighestReward],
  ['optimal', pickOptimal],
]);
