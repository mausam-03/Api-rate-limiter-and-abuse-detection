const slidingWindow = require('../algorithm/slidingWindow');
const handleViolation = require('../services/abuse.services');
const tokenBucket = require("../algorithm/tokenBucket");
const rateLimitConfig = require('../config/ratelimitConfig');
const { logViolation } = require("../services/log.service");

//combined sliding window and token bucket for robust rate limiting
//Token Bucket → allows short bursts
//Sliding Window → enforces strict limits over time (security)
async function rateLimiter(req, res, next) {
  try {
    const ip = req.ip;
     // Get role (default FREE)
    const role = req.headers["x-role"] || "FREE";

    const config = rateLimitConfig[role] || rateLimitConfig["FREE"];
    // Step 1: Token Bucket (burst control)
    
    const tokenAllowed = await tokenBucket(
      ip,
      config.tokenBucket.capacity,
      config.tokenBucket.refillRate
    );

    if (!tokenAllowed) {
      await handleViolation(ip);
       await logViolation({
     ip,
     role,
     endpoint: req.path,
     reason: "TOKEN_BUCKET_EXCEEDED"
    });
      return res.status(429).json({
        error: `Burst limit exceeded for role ${role}`
      });
    }
    // Step 2: Sliding Window (sustained rate control)
     const slidingAllowed = await slidingWindow(
      ip,
      config.slidingWindow.limit,
      config.slidingWindow.window
    );

    if (!slidingAllowed) {
      await handleViolation(ip);
      await logViolation({
     ip,
     role,
     endpoint: req.path,
     reason: "SLIDING_WINDOW_EXCEEDED"
    });
      return res.status(429).json({
        error: `Rate limit exceeded for role ${role}`
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error", error);
    next();
  }
}
module.exports = rateLimiter;