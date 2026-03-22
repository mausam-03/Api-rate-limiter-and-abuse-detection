const {redisClient} = require('../config/redis');

async function handleViolation(ip){
    const violationKey = `violations:${ip}`;

    //increment violation count
    const count = await redisClient.incr(violationKey);

    //first violation -> set expiry 1 minute window
    if(count == 1){
        await redisClient.expire(violationKey, 60);
    }
   if (count >= 3) {
    const banKey = `ban:${ip}`;

    await redisClient.set(banKey, "true", { EX: 300 });

    // Add to banned set
    await redisClient.sAdd("banned_ips", ip);

    console.log(`IP ${ip} banned for abuse`);
 }
}
 module.exports = handleViolation;