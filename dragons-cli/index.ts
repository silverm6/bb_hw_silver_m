import { parseArgs } from "node:util";

import { gameLoop } from "./src/game/play.ts";
import { startGameSession } from "./src/game/session.ts";
import { cheapestStrategy } from "./src/game/strategies/cheapest.ts";
import { cheapestNoPotionStrategy } from "./src/game/strategies/cheapestNoPotion.ts";
import { mostExpensiveStrategy } from "./src/game/strategies/mostExpensive.ts";
import { optimalStrategy } from "./src/game/strategies/optimal.ts";
import type { Strategy } from "./src/game/strategy.ts";
import { logger } from "./src/logger.ts";

const strategies = new Map<string, Strategy>([
  ["cheapest", cheapestStrategy],
  ["cheapest-2", cheapestNoPotionStrategy],
  ["most-expensive", mostExpensiveStrategy],
  ["optimal", optimalStrategy],
]);

const { values } = parseArgs({
  options: {
    strategy: { type: "string", default: "optimal" },
  },
});

const strategy = strategies.get(values.strategy);
if (strategy === undefined) {
  logger.error(
    `Unknown strategy "${values.strategy}", expected one of: ${[...strategies.keys()].join(", ")}`,
  );
  process.exit(1);
}

const session = await startGameSession();
await gameLoop(session, strategy);
