const rateLimitConfig = {
  FREE: {
    tokenBucket: {
      capacity: 5,
      refillRate: 1
    },
    slidingWindow: {
      limit: 10,
      window: 60
    }
  },

  USER: {
    tokenBucket: {
      capacity: 10,
      refillRate: 2
    },
    slidingWindow: {
      limit: 20,
      window: 60
    }
  },

  ADMIN: {
    tokenBucket: {
      capacity: 50,
      refillRate: 10
    },
    slidingWindow: {
      limit: 100,
      window: 60
    }
  }
};

module.exports = rateLimitConfig;