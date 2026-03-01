const {redisClient} = require('../config/redis');

async function fixedWindow({key,limit, windowSize}){
    //increment counter
    const currentCount = await redisClient.incr(key);

    //if first request, set expiry
    if(currentCount == 1){
        await redisClient.expire(key, windowSize);
    }

    //check if limit exceeded
    if(currentCount > limit){
        return false;
    }
    return true;    
}

module.exports = fixedWindow;