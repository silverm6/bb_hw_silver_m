import { logger } from '../logger.ts';
import type { GameSession } from './session.ts';
import type { AdStrategy } from './strategies/ads.ts';
import type { ShopStrategy } from './strategies/items.ts';

export async function gameLoop(session: GameSession, adStrategy: AdStrategy, shopStrategy: ShopStrategy) {
  const items = await session.shop();
  logger.info(items);

  while (session.state().lives > 0) {
    const { turn, lives, gold, score, level } = session.state();
    logger.info(`Turn ${turn}: ${lives} lives, ${gold}g, score ${score}, level ${level}`);

    const chosenItem = shopStrategy(items, session.state());
    if (chosenItem !== undefined) {
      const bought = await session.buy(chosenItem.id);
      logger.info(`${bought ? 'Bought' : 'Failed to buy'} ${chosenItem.name} for ${chosenItem.cost}g`);
    }

    const ads = await session.ads();
    for (const ad of ads) {
      logger.info(`${ad.reward}g, ${ad.probability}, expires in ${ad.expiresIn}: ${ad.message}`);
    }

    const chosenAd = adStrategy(ads, session.state());
    if (chosenAd !== undefined) {
      logger.info(`Solving "${chosenAd.message}" for ${chosenAd.reward}g (${chosenAd.probability})`);

      const solveResult = await session.solve(chosenAd.adId);
      logger.info(solveResult);
    }

    // To prevent infinite loops; in case for some reason there are no ads to solve.
    if (session.state().turn === turn) {
      throw new Error(`No action taken on turn ${turn} (${ads.length} ads available)`);
    }
  }

  const { score } = session.state();
  logger.info(`Game over, score ${score}`);
}
