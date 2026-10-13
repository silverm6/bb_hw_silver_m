import type { Message } from 'dragons-api/types';

import type { GameState } from '../session.ts';

export interface AdStrategy {
  (ads: Message[], state: GameState): Message | undefined;
}

function pickLowestReward(ads: Message[]) {
  return ads.toSorted((a, b) => a.reward - b.reward)[0];
}

function pickHighestReward(ads: Message[]) {
  return ads.toSorted((a, b) => b.reward - a.reward)[0];
}

function pickEasiest(ads: Message[]) {
  return ads
    .toSorted((a, b) => a.expiresIn - b.expiresIn) // 3. closest to expiring as third sort
    .toSorted((a, b) => b.reward - a.reward) // 2. highest reward as second sort
    .toSorted((a, b) => probabilityRank(a.probability) - probabilityRank(b.probability))[0]; // 1. sort by easiest first
}

export const adStrategies = new Map<string, AdStrategy>([
  ['cheapest', pickLowestReward],
  ['easiest', pickEasiest],
  ['most-expensive', pickHighestReward],
]);

function probabilityRank(probability: string) {
  const PROBABILITIES_EASIEST_FIRST = [
    'Sure thing',
    'Piece of cake',
    'Walk in the park',
    'Quite likely',
    'Hmmm....',
    'Gamble',
    'Risky',
    'Playing with fire',
    'Rather detrimental',
    'Suicide mission',
    'Impossible',
  ];

  return PROBABILITIES_EASIEST_FIRST.indexOf(probability);
}
