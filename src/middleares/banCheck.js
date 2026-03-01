const {redisClient} = require('../config/redis');

async function banCheck(req,res, next){
    const ip = req.ip;
    const isBanned = await redisClient.get(`banned:${ip}`);

    if(isBanned){
        return res.status(403).json({ error : "Your IP has been banned temporarily" });
    }
    next();
}
module.exports = banCheck;