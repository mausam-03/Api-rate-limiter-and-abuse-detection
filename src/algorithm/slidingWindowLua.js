const { redisClient, getSlidingScript } = require("../config/redis");

async function slidingWindowLua(ip, limit = 20, windowSize = 60000) {
  const key = `lua_sliding:${ip}`;
  const now = Date.now();

  const scriptSha = getSlidingScript();

  const result = await redisClient.evalSha(
    scriptSha,
    {
      keys: [key],
      arguments: [now, windowSize, limit]
    }
  );

  return result === 1;
}

module.exports = slidingWindowLua;