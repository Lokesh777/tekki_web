let redis = null;

try {
  const Redis = require('ioredis');
  const config = require('./config');

  if (config.redisUrl && config.redisUrl !== 'redis://localhost:6379') {
    redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 50, 2000);
      },
      enableOfflineQueue: false,
      lazyConnect: true,
      connectTimeout: 2000
    });

    redis.on('connect', () => console.log('Redis Connected'));
    redis.on('error', () => {});
    redis.connect().catch(() => {});
  }
} catch (err) {}

module.exports = redis;
