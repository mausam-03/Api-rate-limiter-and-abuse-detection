if (count >= 3) {
    const banKey = `ban:${ip}`;

    await redisClient.set(banKey, "true", { EX: 300 });

    // Add to banned set
    await redisClient.sAdd("banned_ips", ip);

    console.log(`IP ${ip} banned for abuse`);
}