import { describe, expect, it } from 'bun:test';

import { decryptMessages } from '../decode_ad.ts';

describe('decryptMessages', () => {
  it('returns unencrypted messages as-is', () => {
    const messages = decryptMessages(
      [
        {
          adId: 'ad-1',
          message: 'Help defend Sheep',
          reward: 10,
          expiresIn: 7,
          encrypted: null,
          probability: 'Piece of cake',
        },
      ],
      console,
    );

    expect(messages).toEqual([
      {
        adId: 'ad-1',
        message: 'Help defend Sheep',
        reward: 10,
        expiresIn: 7,
        probability: 'Piece of cake',
      },
    ]);
  });

  it('decodes base64 and ROT13 encrypted messages and skips unknown encryptions', () => {
    const messages = decryptMessages(
      [
        {
          adId: encodeBase64('ad-1'),
          message: encodeBase64('Help defend Sheep'),
          reward: 10,
          expiresIn: 7,
          encrypted: 1,
          probability: encodeBase64('Piece of cake'),
        },
        {
          adId: 'nq-2',
          message: 'Fgrny fbzr tbyq',
          reward: 20,
          expiresIn: 5,
          encrypted: 2,
          probability: 'Fhvpvqr zvffvba',
        },
        {
          adId: 'ad-3',
          message: 'Unknown',
          reward: 30,
          expiresIn: 3,
          encrypted: 3,
          probability: 'Unknown',
        },
      ],
      console,
    );

    expect(messages).toEqual([
      {
        adId: 'ad-1',
        message: 'Help defend Sheep',
        reward: 10,
        expiresIn: 7,
        probability: 'Piece of cake',
      },
      {
        adId: 'ad-2',
        message: 'Steal some gold',
        reward: 20,
        expiresIn: 5,
        probability: 'Suicide mission',
      },
    ]);
  });
});

function encodeBase64(value: string) {
  return new TextEncoder().encode(value).toBase64();
}
