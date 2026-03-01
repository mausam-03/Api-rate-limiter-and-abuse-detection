const {redisClient} = require('../config/redis');

async function tokenBucket(ip, capacity=10, refillRate = 1){
    const key = `tokens:${ip}`;
    const now = Date.now();

    const bucketData = await redisClient.get(key);

    let tokens = capacity;
    let lastRefill = now;

    if(bucketData){
        const parsed = JSON.parse(bucketData);
        tokens = parsed.tokens;
        lastRefill = parsed.lastRefill;
}

//calculate tokens to refill
 const timePassed = (now - lastRefill)/ 1000; //seconds
 const refillTokens = Math.floor(timePassed * refillRate);
 
 tokens = Math.min(capacity, tokens + refillTokens);
 lastRefill = now;

 if(tokens<=0){
    return false;
 }
 tokens -= 1;

 await redisClient.set(key, JSON.stringify({tokens , lastRefill}),{
    EX: 60
  });
  return true;
}
module.exports = tokenBucket;
