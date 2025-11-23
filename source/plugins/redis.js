import fs from 'fs';
import path from 'path';

const REDIS_CLIENT_TS = `import { createClient } from 'redis';
import { logger } from '../config/logger';
import { env } from '../config/env';

export const redisClient = createClient({
  url: env.redis.url
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
    logger.info('Redis disconnected');
  }
};`;

const REDIS_CLIENT_JS = `const { createClient } = require('redis');
const { logger } = require('../config/logger');
const env = require('../config/env');

const redisClient = createClient({
  url: env.redis.url
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
    logger.info('Redis disconnected');
  }
};

module.exports = { redisClient, connectRedis, disconnectRedis };`;

const DOCKER_COMPOSE_REDIS_FILE = `services:
  redis:
    image: redis:alpine
    container_name: redis_cache
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  redis-insight:
    image: redis/redisinsight:latest
    container_name: redis_insight
    restart: always
    ports:
      - "5540:5540"
    volumes:
      - redis_insight_data:/data

volumes:
  redis_data:
  redis_insight_data:
`;

export const redisPlugin = {
  name: 'Redis (Caching)',

  dependencies: {
    redis: '^4.6.12',
  },

  apply: (projectPath, language, actions) => {
    const isTS = language === 'typescript';
    const ext = isTS ? 'ts' : 'js';

    const clientContent = isTS ? REDIS_CLIENT_TS : REDIS_CLIENT_JS;
    actions.createFile(`src/lib/redis.${ext}`, clientContent);

    actions.createFile('docker-compose.redis.yml', DOCKER_COMPOSE_REDIS_FILE);

    actions.updateFile('package.json', [
      {
        type: 'inject',
        anchors: ['"scripts": {'],
        location: 'after',
        text: '    "redis:up": "docker compose -f docker-compose.redis.yml up -d",',
      },
    ]);

    if (isTS) {
      actions.updateFile('src/config/env.ts', [
        {
          type: 'inject',
          anchors: ['z.object({'],
          location: 'after',
          text: "  REDIS_URL: z.string().default('redis://localhost:6379'),",
        },
        {
          type: 'inject',
          anchors: ['export const env = {'],
          location: 'after',
          text: '  redis: {\n    url: envVars.REDIS_URL,\n  },',
        },
      ]);
    } else {
      actions.updateFile('src/config/env.js', [
        {
          type: 'inject',
          anchors: ['.keys({'],
          location: 'after',
          text: "    REDIS_URL: Joi.string().default('redis://localhost:6379').description('Redis URL'),",
        },
        {
          type: 'inject',
          anchors: ['module.exports = {'],
          location: 'after',
          text: '  redis: {\n    url: envVars.REDIS_URL,\n  },',
        },
      ]);
    }

    ['.env', '.env.example'].forEach((envFile) => {
      const envPath = path.join(projectPath, envFile);
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        if (!content.includes('REDIS_URL')) {
          fs.appendFileSync(envPath, '\n# Redis\nREDIS_URL=redis://localhost:6379\n');
        }
      }
    });

    const entryFile = `src/index.${ext}`;
    const importStmt = isTS
      ? "import { connectRedis } from './lib/redis';"
      : "const { connectRedis } = require('./lib/redis');";

    actions.updateFile(entryFile, [
      {
        type: 'import',
        text: importStmt,
      },
      {
        type: 'inject',
        anchors: [
          'await prisma.$connect();',
          'await mongoose.connect(env.mongoose.url);',
          "await db.execute('SELECT 1');",
        ],
        location: 'after',
        text: 'await connectRedis();',
      },
    ]);
  },
};
