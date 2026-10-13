import { decryptMessages } from 'dragons-api/decode_ad';
import type { Game, Message, Reputation, ShopItem } from 'dragons-api/types';
import { toast } from 'sonner';
import { create } from 'zustand';

import { apiClient } from '../api/client';

interface HistoryEntry {
  id: number;
  turn: number;
  text: string;
}

interface GameStore {
  current?: Game;
  reputation?: Reputation;
  messages: Message[];
  shopItems: ShopItem[];
  history: HistoryEntry[];
  isPending: boolean;
  startGame: () => Promise<void>;
  investigateReputation: () => Promise<void>;
  solveMessage: (adId: string) => Promise<void>;
  buyItem: (item: ShopItem) => Promise<void>;
}

const createGameStore = create<GameStore>();

export const useGameStore = createGameStore((set, get) => ({
  messages: [],
  shopItems: [],
  history: [],
  isPending: false,

  startGame: async () => {
    set({ isPending: true });
    try {
      const current = await apiClient.startGame();
      const [messages, shopItems] = await Promise.all([
        getMessages(current.gameId),
        apiClient.getShopItems(current.gameId),
      ]);

      set({ current, reputation: undefined, messages, shopItems, history: [] });
    } catch {
      toast.error("Couldn't start a new game");
    } finally {
      set({ isPending: false });
    }
  },

  investigateReputation: async () => {
    const { current } = get();
    if (current === undefined) {
      return;
    }

    set({ isPending: true });
    try {
      const reputation = await apiClient.investigateReputation(current.gameId);
      const turn = current.turn + 1;

      set((state) => ({
        reputation,
        current: { ...current, turn },
        history: addToHistory(
          state.history,
          turn,
          `Investigated reputation: people ${reputation.people}, state ${reputation.state}, underworld ${reputation.underworld}.`,
        ),
      }));

      const messages = await getMessages(current.gameId);
      set({ messages });
    } catch {
      toast.error('Something went wrong');
    } finally {
      set({ isPending: false });
    }
  },

  solveMessage: async (adId) => {
    const { current } = get();
    if (current === undefined) {
      return;
    }

    set({ isPending: true });
    try {
      const result = await apiClient.solveMessage(current.gameId, adId);
      const isGameOver = result.lives <= 0;

      set((state) => {
        const history = addToHistory(state.history, result.turn, result.message);

        return {
          current: {
            ...current,
            lives: result.lives,
            gold: result.gold,
            score: result.score,
            highScore: result.highScore,
            turn: result.turn,
          },
          messages: isGameOver ? [] : state.messages,
          history: isGameOver ? addToHistory(history, result.turn, `Game over, final score ${result.score}.`) : history,
        };
      });

      if (!isGameOver) {
        const messages = await getMessages(current.gameId);
        set({ messages });
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      set({ isPending: false });
    }
  },

  buyItem: async (item) => {
    const { current } = get();
    if (current === undefined) {
      return;
    }

    set({ isPending: true });
    try {
      const result = await apiClient.purchaseItem(current.gameId, item.id);

      set((state) => ({
        current: { ...current, gold: result.gold, lives: result.lives, level: result.level, turn: result.turn },
        history: addToHistory(
          state.history,
          result.turn,
          result.shoppingSuccess ? `Bought ${item.name}.` : `Couldn't buy ${item.name}.`,
        ),
      }));

      const messages = await getMessages(current.gameId);
      set({ messages });
    } catch {
      toast.error('Something went wrong');
    } finally {
      set({ isPending: false });
    }
  },
}));

async function getMessages(gameId: string) {
  return decryptMessages(await apiClient.getAds(gameId), console);
}

function addToHistory(history: HistoryEntry[], turn: number, text: string) {
  return [{ id: history.length, turn, text }, ...history];
}
