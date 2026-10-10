import { HEALING_POTION_ID } from "../../api/types.ts";
import type { Strategy } from "../strategy.ts";
import { pickHighestReward } from "./mostExpensive.ts";

export const optimalStrategy: Strategy = {
  pickAd: pickHighestReward,
  pickItem(items, state) {
    const potion = items.find((item) => item.id === HEALING_POTION_ID)!;
    if (state.lives === 1 && potion.cost <= state.gold) {
      return potion;
    }

    return items
      .filter((item) => item.id !== HEALING_POTION_ID) // 1. skip the potion, it's only bought at 1 life
      .filter((item) => item.cost <= state.gold - potion.cost) // 2. keep only items you can afford while keeping enough for a potion
      .toSorted((a, b) => b.cost - a.cost)[0]; // 3. sort by cost, most expensive first; 4. take the first
  },
};
