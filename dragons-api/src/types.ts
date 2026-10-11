import * as v from 'valibot';

export const GameSchema = v.object({
  gameId: v.string(),
  lives: v.number(),
  gold: v.number(),
  level: v.number(),
  score: v.number(),
  highScore: v.number(),
  turn: v.number(),
});
export type Game = v.InferOutput<typeof GameSchema>;

export const ReputationSchema = v.object({
  people: v.number(),
  state: v.number(),
  underworld: v.number(),
});
export type Reputation = v.InferOutput<typeof ReputationSchema>;

export const SolveResultSchema = v.object({
  success: v.boolean(),
  lives: v.number(),
  gold: v.number(),
  score: v.number(),
  highScore: v.number(),
  turn: v.number(),
  message: v.string(),
});
export type SolveResult = v.InferOutput<typeof SolveResultSchema>;

// Ad as sent by the API: adId, message and probability may be encoded.
export const RawMessageSchema = v.object({
  adId: v.string(),
  message: v.string(),
  reward: v.number(),
  expiresIn: v.number(),
  encrypted: v.nullable(v.number()),
  probability: v.string(),
});
export type RawMessage = v.InferOutput<typeof RawMessageSchema>;

export type Message = {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  probability: string;
};

export const ShopItemSchema = v.object({
  id: v.string(),
  name: v.string(),
  cost: v.number(),
});
export type ShopItem = v.InferOutput<typeof ShopItemSchema>;

export const PurchaseResultSchema = v.object({
  shoppingSuccess: v.boolean(),
  gold: v.number(),
  lives: v.number(),
  level: v.number(),
  turn: v.number(),
});
export type PurchaseResult = v.InferOutput<typeof PurchaseResultSchema>;

export const HEALING_POTION_API_ID = 'hpot';

export type Logger = Pick<Console, 'debug' | 'info' | 'warn' | 'error'>;
