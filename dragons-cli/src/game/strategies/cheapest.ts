import type { Message } from "../../api/types.ts";
import { logAds, type Strategy } from "../strategy.ts";

export function pickLowestReward(messages: Message[]) {
  const ranked = messages.toSorted((a, b) => a.reward - b.reward);
  logAds(ranked);

  return ranked[0];
}

export const cheapestStrategy: Strategy = {
  pickAd: pickLowestReward,
  pickItem(items, state) {
    return items
      .filter((item) => item.cost <= state.gold) // 1. keep only items you can afford right now
      .toSorted((a, b) => a.cost - b.cost)[0]; // 2. sort by cheapest first
  },
};
