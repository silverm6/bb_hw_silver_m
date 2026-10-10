import type { Message, ShopItem } from "../api/types.ts";
import type { GameState } from "./session.ts";

export interface Strategy {
  pickAd(messages: Message[], state: GameState): Message | undefined;
  pickItem(items: ShopItem[], state: GameState): ShopItem | undefined;
}

export function logAds(ads: Message[]) {
  console.table(ads, ["message", "reward", "expiresIn", "probability"]);
}
