import { describe, expect, it } from 'bun:test';

import { http, HttpResponse } from 'msw';

import { createAPIClient, type RequestOptions } from '../client.ts';
import { APIError } from '../error.ts';
import { server } from '../mocks/server.ts';
import { setupMockServer } from '../mocks/setup.ts';

const API_URL = 'https://test.test/api/v2';

function getAPIClient(options?: RequestOptions) {
  return createAPIClient({ apiURL: API_URL, logger: console, options: { retryDelayMs: 0, ...options } });
}

describe('createAPIClient', () => {
  setupMockServer();

  it('startGame correctly calls the start endpoint', async () => {
    const client = getAPIClient();
    const game = {
      gameId: 'game-1',
      lives: 3,
      gold: 0,
      level: 0,
      score: 0,
      highScore: 0,
      turn: 0,
    };

    server.use(
      http.post(`${API_URL}/game/start`, () => {
        return HttpResponse.json(game);
      }),
    );

    expect(await client.startGame()).toEqual(game);
  });

  it('getAds correctly calls the messages endpoint and returns messages as-is', async () => {
    const client = getAPIClient();
    const messages = [
      {
        adId: 'nq-1',
        message: 'Fgrny fbzr tbyq',
        reward: 20,
        expiresIn: 5,
        encrypted: 2,
        probability: 'Fhvpvqr zvffvba',
      },
    ];

    server.use(
      http.get(`${API_URL}/game-1/messages`, () => {
        return HttpResponse.json(messages);
      }),
    );

    expect(await client.getAds('game-1')).toEqual(messages);
  });

  it('solveMessage correctly calls the solve endpoint', async () => {
    const client = getAPIClient();
    const result = {
      success: true,
      lives: 3,
      gold: 10,
      score: 10,
      highScore: 10,
      turn: 1,
      message: 'You successfully solved the mission!',
    };

    server.use(
      http.post(`${API_URL}/game-1/solve/ad-1`, () => {
        return HttpResponse.json(result);
      }),
    );

    expect(await client.solveMessage('game-1', 'ad-1')).toEqual(result);
  });

  it('getShopItems correctly calls the shop endpoint', async () => {
    const client = getAPIClient();
    const items = [{ id: 'hpot', name: 'Healing potion', cost: 50 }];

    server.use(
      http.get(`${API_URL}/game-1/shop`, () => {
        return HttpResponse.json(items);
      }),
    );

    expect(await client.getShopItems('game-1')).toEqual(items);
  });

  it('purchaseItem correctly calls the shop buy endpoint', async () => {
    const client = getAPIClient();
    const result = { shoppingSuccess: true, gold: 0, lives: 3, level: 0, turn: 2 };

    server.use(
      http.post(`${API_URL}/game-1/shop/buy/hpot`, () => {
        return HttpResponse.json(result);
      }),
    );

    expect(await client.purchaseItem('game-1', 'hpot')).toEqual(result);
  });

  it('solveMessage throws APIError with the status for non-ok responses', () => {
    const client = getAPIClient();

    server.use(
      http.post(`${API_URL}/game-1/solve/ad-1`, () => {
        return new HttpResponse(null, { status: 400 });
      }),
    );

    expect(client.solveMessage('game-1', 'ad-1')).rejects.toMatchObject({
      name: 'APIError',
      status: 400,
    });
  });

  it('startGame throws when the response does not match the schema', () => {
    const client = getAPIClient();

    server.use(
      http.post(`${API_URL}/game/start`, () => {
        return HttpResponse.json({ gameId: 'game-1' });
      }),
    );

    expect(client.startGame()).rejects.toThrow();
  });

  it('startGame does not retry a POST', () => {
    const client = getAPIClient();
    let calls = 0;

    server.use(
      http.post(`${API_URL}/game/start`, () => {
        calls++;

        return new HttpResponse(null, { status: 500 });
      }),
    );

    expect(client.startGame()).rejects.toBeInstanceOf(APIError);
    expect(calls).toBe(1);
  });

  it('getShopItems retries a GET up to maxRetries times', () => {
    const client = getAPIClient({ maxRetries: 2 });
    let calls = 0;

    server.use(
      http.get(`${API_URL}/game-1/shop`, () => {
        calls++;

        return new HttpResponse(null, { status: 500 });
      }),
    );

    expect(client.getShopItems('game-1')).rejects.toBeInstanceOf(APIError);
    expect(calls).toBe(3);
  });
});
