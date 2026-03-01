const {redisClient} = require('../config/redis');

async function slidingWindow({key,limit, windowSize}){
    const now = Date.now();
    const windowStart = now - windowSize * 1000;

    //remove old requests
    await redisClient.zRemRangeByScore(key, 0, windowStart);

    //count current requests inside window
    const currentCount = await redisClient.zCard(key);

    if(currentCount >= limit){
        return false;
    }

    // add current request timestamp 
    await redisClient.zAdd(key,{ score: now, value: now.toString() });
 // Set expiry so Redis auto-cleans
  await redisClient.expire(key, windowSize);

  return true;
}

module.exports = slidingWindow;