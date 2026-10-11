import type { Game, Message, ShopItem } from 'dragons-api/types';

import type { HistoryEntry } from './types';

export const MOCK_STATS: Game = {
  gameId: 'mock-game',
  lives: 3,
  gold: 142,
  level: 2,
  score: 385,
  highScore: 1210,
  turn: 14,
};

export const MOCK_MESSAGES: Message[] = [
  {
    adId: 'a1',
    message: 'Help Rufus Doe to transport a magic cart to Bigtown',
    reward: 32,
    expiresIn: 5,
    probability: 'Piece of cake',
  },
  {
    adId: 'a2',
    message: 'Escort Erin Hart to the forest of whispers',
    reward: 58,
    expiresIn: 3,
    probability: 'Risky',
  },
  {
    adId: 'a3',
    message: 'Steal a super awesome diamond from the royal vault',
    reward: 121,
    expiresIn: 6,
    probability: 'Suicide mission',
  },
];

export const MOCK_SHOP_ITEMS: ShopItem[] = [
  { id: 'hpot', name: 'Healing potion', cost: 50 },
  { id: 'cs', name: 'Claw Sharpening', cost: 100 },
  { id: 'gas', name: 'Gas', cost: 100 },
  { id: 'cp', name: 'Copper Plating', cost: 300 },
];

export const MOCK_HISTORY: HistoryEntry[] = [
  { id: 'l3', turn: 14, text: 'You successfully solved the mission!' },
  { id: 'l2', turn: 13, text: 'Bought Healing potion' },
  { id: 'l1', turn: 12, text: 'You were defeated on your last mission!' },
];
