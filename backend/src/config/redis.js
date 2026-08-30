const Redis = require('ioredis');
const config = require('./config');

let redis = null;

try {
  redis = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 10) return null;
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    enableOfflineQueue: false,
    lazyConnect: true
  });

  redis.on('connect', () => {
    console.log('Redis Connected');
  });

  redis.on('error', (err) => {
    console.error('Redis error (non-critical):', err.message);
  });

  redis.connect().catch(() => {
    console.log('Redis not available - running without cache');
  });
} catch (err) {
  console.log('Redis not available - running without cache');
}

module.exports = redis;
