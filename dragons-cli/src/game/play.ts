import { logger } from '../logger.ts';
import type { GameSession } from './session.ts';
import type { AdStrategy, ShopStrategy } from './strategy.ts';

export async function gameLoop(session: GameSession, adStrategy: AdStrategy, shopStrategy: ShopStrategy) {
  const items = await session.shop();
  logger.info(items);

  while (session.state().lives > 0) {
    const { turn, lives, gold, score, level } = session.state();
    logger.info(`Turn ${turn}: ${lives} lives, ${gold}g, score ${score}, level ${level}`);

    const item = shopStrategy(items, session.state());
    if (item !== undefined) {
      const bought = await session.buy(item.id);
      logger.info(`${bought ? 'Bought' : 'Failed to buy'} ${item.name} for ${item.cost}g`);
    }

    const ads = await session.ads();
    for (const ad of ads) {
      logger.info(`${ad.reward}g, ${ad.probability}, expires in ${ad.expiresIn}: ${ad.message}`);
    }

    const ad = adStrategy(ads, session.state());
    if (ad !== undefined) {
      logger.info(`Solving "${ad.message}" for ${ad.reward}g (${ad.probability})`);

      const message = await session.solve(ad.adId);
      logger.info(message);
    }

    // To prevent infinite loops; in case for some reason there are no ads to solve.
    if (session.state().turn === turn) {
      throw new Error(`No action taken on turn ${turn} (${ads.length} ads available)`);
    }
  }

  const { score } = session.state();
  logger.info(`Game over, score ${score}`);
}
