import { describe, expect, it, mock } from 'bun:test';

import type { Message, ShopItem } from 'dragons-api/types';
import { gameLoop } from '../play.ts';
import type { GameSession, GameState } from '../session.ts';

const Ad: Message = {
  adId: 'test-ad',
  message: 'Help defend Sheep',
  reward: 10,
  expiresIn: 7,
  probability: 'Piece of cake',
};

const Item: ShopItem = {
  id: 'test-item',
  name: 'Claw Sharpening',
  cost: 100,
};

describe('gameLoop', () => {
  it('stops when lives hit 0', async () => {
    const session = createFakeSession({ lives: 2 });

    await gameLoop(session, alwaysSolveAd, neverBuyItem);

    expect(session.state().lives).toBe(0);
    expect(session.solve).toHaveBeenCalledTimes(2);
  });

  it('throws when a turn passes with no action', () => {
    const session = createFakeSession();

    expect(gameLoop(session, neverSolveAd, neverBuyItem)).rejects.toThrow(
      'No action taken on turn 0 (1 ads available)',
    );
  });

  it('ad strategy sees state after purchase', async () => {
    const session = createFakeSession({ gold: 100 });
    const adStrategy = mock(alwaysSolveAd);

    await gameLoop(session, adStrategy, alwaysBuyItem);

    expect(adStrategy).toHaveBeenCalledWith([Ad], expect.objectContaining({ gold: 0 }));
  });

  it('does not throw on a turn with a purchase but no solved ad', async () => {
    const session = createFakeSession({}, 3);

    await gameLoop(session, neverSolveAd, alwaysBuyItem);

    expect(session.buy).toHaveBeenCalledTimes(3);
  });
});

function createFakeSession(initial: Partial<GameState> = {}, maxTurns = 10): GameSession {
  let state: GameState = { lives: 1, gold: 0, score: 0, level: 0, turn: 0, ...initial };

  function endTurn(updates: Partial<GameState>) {
    state = { ...state, ...updates, turn: state.turn + 1 };

    if (state.turn >= maxTurns) {
      state = { ...state, lives: 0 };
    }
  }

  return {
    gameId: 'test-game',
    state() {
      return { ...state };
    },
    async ads() {
      return [Ad];
    },
    async shop() {
      return [Item];
    },
    solve: mock(async () => {
      endTurn({ lives: state.lives - 1 });
      return 'solved';
    }),
    buy: mock(async () => {
      endTurn({ gold: state.gold - Item.cost });
      return true;
    }),
  };
}

function alwaysSolveAd() {
  return Ad;
}

function neverSolveAd() {
  return undefined;
}

function alwaysBuyItem() {
  return Item;
}

function neverBuyItem() {
  return undefined;
}
