// https://github.com/pmndrs/zustand/blob/main/docs/learn/guides/testing.md#vitest
// https://bun.com/guides/test/testing-library
import { afterAll, afterEach, beforeAll, expect, mock } from 'bun:test';

import * as matchers from '@testing-library/jest-dom/matchers';
import { act, cleanup } from '@testing-library/react';
import { toast } from 'sonner';
import * as zustand from 'zustand';

import { server } from './server.ts';

expect.extend(matchers);

const actualCreate = zustand.create;
const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  return typeof stateCreator === 'function' ? createUncurried(stateCreator) : createUncurried;
}) as typeof zustand.create;

mock.module('zustand', () => ({ ...zustand, create }));

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  toast.dismiss();
  server.resetHandlers();
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});

afterAll(() => {
  server.close();
});
