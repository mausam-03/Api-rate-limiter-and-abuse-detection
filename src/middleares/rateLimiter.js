const slidingWindow = require('../algorithm/slidingWindow');
const handleViolation = require('../services/abuse.services');
const tokenBucket = require("../algorithm/tokenBucket");

//combined sliding window and token bucket for robust rate limiting
//Token Bucket → allows short bursts
//Sliding Window → enforces strict limits over time (security)
async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip;

    // Step 1: Token Bucket (burst control)
    const tokenAllowed = await tokenBucket(ip, 10, 1);

    if (!tokenAllowed) {
      await handleViolation(ip);

      return res.status(429).json({
        error: "Burst limit exceeded"
      });
    }

    // Step 2: Sliding Window (sustained rate control)
    const slidingAllowed = await slidingWindow(ip, 20, 60);

    if (!slidingAllowed) {
      await handleViolation(ip);

      return res.status(429).json({
        error: "Rate limit exceeded"
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error", error);
    next();
  }
}

module.exports = rateLimiter;