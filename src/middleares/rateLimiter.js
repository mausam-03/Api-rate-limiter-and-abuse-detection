const slidingWindow = require('../algorithm/slidingWindow');
const handleViolation = require('../services/abuse.services');
const tokenBucket = require("../algorithm/tokenBucket");

async function rateLimiter(req,res, next){
    try{
        const ip = req.ip;
        const endpoint = req.path;

        const key = `rate_limit: ${ip}:${endpoint}`;

        const allowed = await tokenBucket(
         ip,
         10,
         1
        );
        
        if(!allowed){
            await handleViolation(ip);
            return res.status(429).json({ error : "Too many requests. Please try again later." });
            
        }
        next();
    }catch(error){
        console.error("Rate limiter error", error);
        next();
    }
}
module.exports = rateLimiter;