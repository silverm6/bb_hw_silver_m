import * as v from 'valibot';

import { decryptMessage } from './decode_ad.ts';
import { APIError } from './error.ts';
import {
  GameSchema,
  PurchaseResultSchema,
  RawMessageSchema,
  ReputationSchema,
  ShopItemSchema,
  SolveResultSchema,
  type Game,
  type Logger,
  type Message,
  type PurchaseResult,
  type Reputation,
  type ShopItem,
  type SolveResult,
} from './types.ts';

const TIMEOUT_MS = 5_000;
const RETRY_DELAY_MS = 500;

type Method = 'GET' | 'POST';

export interface APIClient {
  getAds(gameId: string): Promise<Message[]>;
  getShopItems(gameId: string): Promise<ShopItem[]>;
  investigateReputation(gameId: string): Promise<Reputation>;
  purchaseItem(gameId: string, itemId: string): Promise<PurchaseResult>;
  solveMessage(gameId: string, adId: string): Promise<SolveResult>;
  startGame(): Promise<Game>;
}

export interface APIClientOptions {
  apiURL: string;
  logger: Logger;
}

export function createAPIClient({ apiURL, logger }: APIClientOptions): APIClient {
  // One retry for GET requests in case of transient errors.
  async function request<T>(method: Method, path: string, schema: v.GenericSchema<unknown, T>): Promise<T> {
    try {
      return await send(method, path, schema);
    } catch (error) {
      if (method !== 'GET' || !isRetryable(error)) {
        throw error;
      }

      logger.warn(`${method} ${path} failed (${error}), retrying...`);
      await sleep(RETRY_DELAY_MS);

      return send(method, path, schema);
    }
  }

  async function send<T>(method: Method, path: string, schema: v.GenericSchema<unknown, T>): Promise<T> {
    logger.debug(`${method} ${path}`);

    const res = await fetch(`${apiURL}${path}`, {
      method,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new APIError(method, path, res.status);
    }

    return v.parse(schema, await res.json());
  }

  return {
    async getAds(gameId) {
      const messages = await request('GET', `/${encodeURIComponent(gameId)}/messages`, v.array(RawMessageSchema));

      return messages.map((message) => decryptMessage(message, logger)).filter((ad) => ad !== undefined);
    },
    getShopItems(gameId) {
      return request('GET', `/${encodeURIComponent(gameId)}/shop`, v.array(ShopItemSchema));
    },
    investigateReputation(gameId) {
      return request('POST', `/${encodeURIComponent(gameId)}/investigate/reputation`, ReputationSchema);
    },
    purchaseItem(gameId, itemId) {
      return request(
        'POST',
        `/${encodeURIComponent(gameId)}/shop/buy/${encodeURIComponent(itemId)}`,
        PurchaseResultSchema,
      );
    },
    solveMessage(gameId, adId) {
      return request('POST', `/${encodeURIComponent(gameId)}/solve/${encodeURIComponent(adId)}`, SolveResultSchema);
    },
    startGame() {
      return request('POST', '/game/start', GameSchema);
    },
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown) {
  if (error instanceof APIError) {
    return error.status >= 500;
  }
  if (error instanceof v.ValiError) {
    return false;
  }

  return true;
}
