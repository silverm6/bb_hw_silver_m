import { parseArgs } from 'node:util';

import { createAPIClient } from 'dragons-api/client';

import { loadConfig } from './src/config.ts';
import { gameLoop } from './src/game/play.ts';
import { startGameSession } from './src/game/session.ts';
import { adStrategies } from './src/game/strategies/ads.ts';
import { shopStrategies } from './src/game/strategies/items.ts';
import { logger } from './src/logger.ts';

const { values: args } = parseArgs({
  options: {
    ads: { type: 'string', default: 'easiest' },
    shop: { type: 'string', default: 'optimal' },
  },
});

const adStrategy = adStrategies.get(args.ads);
const shopStrategy = shopStrategies.get(args.shop);
if (adStrategy === undefined || shopStrategy === undefined) {
  logger.error(
    `Unknown strategy (--ads "${args.ads}", --shop "${args.shop}"). ` +
      `--ads expects one of: ${[...adStrategies.keys()].join(', ')}; ` +
      `--shop expects one of: ${[...shopStrategies.keys()].join(', ')}`,
  );
  process.exit(1);
}

const config = loadConfig(process.env);
const client = createAPIClient({ apiURL: config.apiURL, logger });
const session = await startGameSession(client);

await gameLoop(session, adStrategy, shopStrategy);
