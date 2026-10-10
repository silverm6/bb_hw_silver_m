import { config } from "../config.ts";
import { logger } from "../logger.ts";
import { APIError } from "./error.ts";
import type { Game, Messages, PurchaseItem, Reputation, ShopItems, SolveMessage } from "./types.ts";

type Method = "GET" | "POST";
const TIMEOUT_MS = 5_000;

// One retry for GET requests in case of transient errors.
async function request<T>(method: Method, path: string): Promise<T> {
  try {
    return await send<T>(method, path);
  } catch (error) {
    if (method !== "GET" || !isRetryable(error)) {
      throw error;
    }

    return send<T>(method, path);
  }
}

async function send<T>(method: Method, path: string): Promise<T> {
  logger.debug(`${method} ${path}`);

  const res = await fetch(`${config.apiURL}${path}`, {
    method,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new APIError(res.status, await res.text());
  }

  return (await res.json()) as T;
}

export function startGame(): Promise<Game> {
  return request<Game>("POST", "/game/start");
}

export function investigateReputation(gameId: string): Promise<Reputation> {
  return request<Reputation>("POST", `/${encodeURIComponent(gameId)}/investigate/reputation`);
}

export function getMessages(gameId: string): Promise<Messages> {
  return request<Messages>("GET", `/${encodeURIComponent(gameId)}/messages`);
}

export function solveMessage(gameId: string, adId: string): Promise<SolveMessage> {
  return request<SolveMessage>(
    "POST",
    `/${encodeURIComponent(gameId)}/solve/${encodeURIComponent(adId)}`,
  );
}

export function getShopItems(gameId: string): Promise<ShopItems> {
  return request<ShopItems>("GET", `/${encodeURIComponent(gameId)}/shop`);
}

export function purchaseItem(gameId: string, itemId: string): Promise<PurchaseItem> {
  return request<PurchaseItem>(
    "POST",
    `/${encodeURIComponent(gameId)}/shop/buy/${encodeURIComponent(itemId)}`,
  );
}

function isRetryable(error: unknown) {
  if (error instanceof APIError) {
    return error.status >= 500;
  }

  return true;
}
