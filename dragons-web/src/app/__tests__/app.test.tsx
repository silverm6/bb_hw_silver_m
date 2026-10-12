import { beforeEach, expect, it } from 'bun:test';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Game, PurchaseResult, RawMessage, Reputation, ShopItem, SolveResult } from 'dragons-api/types';
import { http, HttpResponse } from 'msw';

import { server } from '../../test/server.ts';
import { App } from '../index.tsx';

beforeEach(() => {
  server.use(
    http.post('*/game/start', () => HttpResponse.json(NewGame)),
    http.get('*/:gameId/messages', () => HttpResponse.json([Ad])),
    http.get('*/:gameId/shop', () => HttpResponse.json([Sharpening, Plating])),
  );
});

it('starts a game', async () => {
  await startGame();

  expect(screen.getByTestId('stat-game-id')).toHaveTextContent('test-game');
  expect(screen.getByTestId('stat-gold')).toHaveTextContent('100');
  expect(screen.getByText('Claw Sharpening')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'New game' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Solve Help defend Sheep' })).toBeEnabled();
});

it('solves a message', async () => {
  server.use(
    http.post('*/:gameId/solve/:adId', () =>
      HttpResponse.json<SolveResult>({
        success: true,
        lives: 3,
        gold: 110,
        score: 10,
        highScore: 0,
        turn: 1,
        message: 'You defended the sheep',
      }),
    ),
  );

  const user = await startGame();
  await user.click(screen.getByRole('button', { name: 'Solve Help defend Sheep' }));

  expect(await screen.findByText('You defended the sheep')).toBeInTheDocument();
  expect(screen.getByTestId('stat-gold')).toHaveTextContent('110');
  expect(screen.getByTestId('stat-score')).toHaveTextContent('10');
  expect(screen.getByTestId('stat-turn')).toHaveTextContent('1');
});

it('ends the game when lives run out', async () => {
  server.use(
    http.post('*/:gameId/solve/:adId', () =>
      HttpResponse.json<SolveResult>({
        success: false,
        lives: 0,
        gold: 100,
        score: 40,
        highScore: 0,
        turn: 4,
        message: 'You were eaten',
      }),
    ),
  );

  const user = await startGame();
  await user.click(screen.getByRole('button', { name: 'Solve Help defend Sheep' }));

  expect(await screen.findByText('Game over, final score 40.')).toBeInTheDocument();
  expect(screen.getByText('No messages')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Investigate reputation' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Buy Claw Sharpening' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'New game' })).toBeEnabled();
});

it('buys an affordable item', async () => {
  server.use(
    http.post('*/:gameId/shop/buy/:itemId', () =>
      HttpResponse.json<PurchaseResult>({ shoppingSuccess: true, gold: 0, lives: 3, level: 1, turn: 1 }),
    ),
  );

  const user = await startGame();

  expect(screen.getByRole('button', { name: 'Buy Iron Plating' })).toBeDisabled();

  await user.click(screen.getByRole('button', { name: 'Buy Claw Sharpening' }));

  expect(await screen.findByText('Bought Claw Sharpening.')).toBeInTheDocument();
  expect(screen.getByTestId('stat-gold')).toHaveTextContent('0');
  expect(screen.getByTestId('stat-level')).toHaveTextContent('1');
});

it('investigates reputation', async () => {
  server.use(
    http.post('*/:gameId/investigate/reputation', () =>
      HttpResponse.json<Reputation>({ people: 1.234, state: -2, underworld: 0 }),
    ),
  );

  const user = await startGame();
  await user.click(screen.getByRole('button', { name: 'Investigate reputation' }));

  expect(screen.getByTestId('stat-people')).toHaveTextContent('1.23');
  expect(screen.getByTestId('stat-state')).toHaveTextContent('-2');
  expect(screen.getByTestId('stat-underworld')).toHaveTextContent('0');
  expect(screen.getByTestId('stat-turn')).toHaveTextContent('1');
});

it('shows an error and re-enables actions when a request fails', async () => {
  server.use(http.post('*/:gameId/solve/:adId', () => new HttpResponse(null, { status: 500 })));

  const user = await startGame();
  await user.click(screen.getByRole('button', { name: 'Solve Help defend Sheep' }));

  expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Solve Help defend Sheep' })).toBeEnabled();
  expect(screen.getByTestId('stat-gold')).toHaveTextContent('100');
});

it('clears the history when starting a new game', async () => {
  server.use(
    http.post('*/:gameId/solve/:adId', () =>
      HttpResponse.json<SolveResult>({
        success: true,
        lives: 3,
        gold: 100,
        score: 0,
        highScore: 0,
        turn: 1,
        message: 'You defended the sheep',
      }),
    ),
  );

  const user = await startGame();
  await user.click(screen.getByRole('button', { name: 'Solve Help defend Sheep' }));
  await screen.findByText('You defended the sheep');

  await user.click(screen.getByRole('button', { name: 'New game' }));

  expect(await screen.findByText('Nothing happened yet')).toBeInTheDocument();
});

async function startGame() {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Start game' }));
  await screen.findByText('Help defend Sheep');

  return user;
}

const NewGame: Game = { gameId: 'test-game', lives: 3, gold: 100, level: 0, score: 0, highScore: 0, turn: 0 };

const Ad: RawMessage = {
  adId: 'test-ad',
  message: 'Help defend Sheep',
  reward: 10,
  expiresIn: 7,
  encrypted: null,
  probability: 'Piece of cake',
};

const Sharpening: ShopItem = { id: 'cs', name: 'Claw Sharpening', cost: 100 };
const Plating: ShopItem = { id: 'iron', name: 'Iron Plating', cost: 300 };
