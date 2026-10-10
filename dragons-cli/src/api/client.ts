import { setTimeout as sleep } from 'node:timers/promises';

import * as v from 'valibot';

import { config } from '../config.ts';
import { logger } from '../logger.ts';
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
  type Message,
  type PurchaseResult,
  type Reputation,
  type ShopItem,
  type SolveResult,
} from './types.ts';

const TIMEOUT_MS = 5_000;
const RETRY_DELAY_MS = 500;

type Method = 'GET' | 'POST';

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

  const res = await fetch(`${config.apiURL}${path}`, {
    method,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new APIError(method, path, res.status);
  }

  return v.parse(schema, await res.json());
}

export function startGame(): Promise<Game> {
  return request('POST', '/game/start', GameSchema);
}

// TODO: unused, either use it or delete it. Each call costs a turn but the response has no `turn`,
// so a session wrapper would have to increment turn itself.
export function investigateReputation(gameId: string): Promise<Reputation> {
  return request('POST', `/${encodeURIComponent(gameId)}/investigate/reputation`, ReputationSchema);
}

export async function getAds(gameId: string): Promise<Message[]> {
  const messages = await request('GET', `/${encodeURIComponent(gameId)}/messages`, v.array(RawMessageSchema));

  return messages.map((message) => decryptMessage(message)).filter((ad) => ad !== undefined);
}

export function solveMessage(gameId: string, adId: string): Promise<SolveResult> {
  return request('POST', `/${encodeURIComponent(gameId)}/solve/${encodeURIComponent(adId)}`, SolveResultSchema);
}

export function getShopItems(gameId: string): Promise<ShopItem[]> {
  return request('GET', `/${encodeURIComponent(gameId)}/shop`, v.array(ShopItemSchema));
}

export function purchaseItem(gameId: string, itemId: string): Promise<PurchaseResult> {
  return request('POST', `/${encodeURIComponent(gameId)}/shop/buy/${encodeURIComponent(itemId)}`, PurchaseResultSchema);
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
