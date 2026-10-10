export type Game = {
  gameId: string;
  lives: number;
  gold: number;
  level: number;
  score: number;
  highScore: number;
  turn: number;
};

export type Reputation = {
  people: number;
  state: number;
  underworld: number;
};

export type SolveMessage = {
  success: boolean;
  lives: number;
  gold: number;
  score: number;
  highScore: number;
  turn: number;
  message: string;
};

export type Message = {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  encrypted: number | null;
  probability: string;
};
export type Messages = Message[];

export type ShopItem = {
  id: string;
  name: string;
  cost: number;
};
export type ShopItems = ShopItem[];

export const HEALING_POTION_ID = "hpot";

export type PurchaseItem = {
  shoppingSuccess: boolean;
  gold: number;
  lives: number;
  level: number;
  turn: number;
};
