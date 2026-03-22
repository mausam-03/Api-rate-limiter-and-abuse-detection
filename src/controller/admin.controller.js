const { redisClient } = require("../config/redis");

async function getBannedIPs(req, res) {
  try {
    const ips = await redisClient.sMembers("banned_ips");

    const activeBans = [];

    for (const ip of ips) {
      const exists = await redisClient.exists(`ban:${ip}`);

      if (exists) {
        const ttl = await redisClient.ttl(`ban:${ip}`);

        activeBans.push({
          ip,
          ttl
        });
      }
    }

    res.json({
      total: activeBans.length,
      data: activeBans
    });

  } catch (error) {
    console.error("Admin API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getBannedIPs
};