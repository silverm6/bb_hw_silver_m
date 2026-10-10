import { logger } from "../logger.ts";
import type { GameSession } from "./session.ts";
import type { Strategy } from "./strategy.ts";

export async function gameLoop(session: GameSession, strategy: Strategy) {
  const items = await session.shop();
  console.table(items, ["name", "cost"]);

  while (session.state().lives > 0) {
    const { turn, lives, gold, score, level } = session.state();
    logger.info(`Turn ${turn}: ${lives} lives, ${gold}g, score ${score}, level ${level}`);

    const item = strategy.pickItem(items, session.state());
    if (item !== undefined) {
      const result = await session.buy(item.id);
      if (result.shoppingSuccess) {
        logger.info(`Bought ${item.name} for ${item.cost}g`);
      } else {
        logger.warn(`Failed to buy ${item.name} for ${item.cost}g`);
      }
    }

    const ad = strategy.pickAd(await session.messages(), session.state());
    if (ad !== undefined) {
      const result = await session.solve(ad.adId);
      logger.info(result.message);
    }
  }

  const { score } = session.state();
  logger.info(`Game over, score ${score}`);
  return score;
}
