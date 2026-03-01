const {redisClient} = require('../config/redis');

async function handleViolation(ip){
    const violationKey = `violations:${ip}`;

    //increment violation count
    const count = await redisClient.incr(violationKey);

    //first violation -> set expiry 1 minute window
    if(count == 1){
        await redisClient.expire(violationKey, 60);
    }
    // if too many violations -> ban 
    if(count >=3){
        await redisClient.set(`ban:${ip}`, "true", {EX: 300}); // ban for 5 minutes
        console.log(`IP ${ip} bannded for abuse`);
    }
}
 module.exports = handleViolation;