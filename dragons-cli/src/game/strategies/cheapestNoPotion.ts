import { HEALING_POTION_ID } from "../../api/types.ts";
import type { Strategy } from "../strategy.ts";
import { pickLowestReward } from "./cheapest.ts";

export const cheapestNoPotionStrategy: Strategy = {
  pickAd: pickLowestReward,
  pickItem(items, state) {
    // TODO: temporary, always buy a healing potion at 1 life
    const potion = items.find((item) => item.id === HEALING_POTION_ID)!;
    if (state.lives === 1 && potion.cost <= state.gold) {
      return potion;
    }

    return items
      .filter((item) => item.id !== HEALING_POTION_ID) // 1. skip the potion
      .filter((item) => item.cost <= state.gold) // 2. keep only items you can afford right now
      .toSorted((a, b) => a.cost - b.cost)[0]; // 3. sort by cheapest first
  },
};
