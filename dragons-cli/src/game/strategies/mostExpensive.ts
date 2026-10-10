import type { Message } from "../../api/types.ts";
import { logAds, type Strategy } from "../strategy.ts";

export function pickHighestReward(messages: Message[]) {
  const ranked = messages.toSorted((a, b) => b.reward - a.reward);
  logAds(ranked);

  return ranked[0];
}

export const mostExpensiveStrategy: Strategy = {
  pickAd: pickHighestReward,
  pickItem(items, state) {
    return items
      .filter((item) => item.cost <= state.gold) // 1. keep only items you can afford right now
      .toSorted((a, b) => b.cost - a.cost)[0]; // 2. sort most expensive first
  },
};
