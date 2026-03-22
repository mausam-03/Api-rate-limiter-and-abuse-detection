-- KEYS[1] = rate limit key
-- ARGV[1] = current timestamp
-- ARGV[2] = window size (ms)
-- ARGV[3] = limit

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

local windowStart = now - window

-- remove old requests
redis.call("ZREMRANGEBYSCORE", key, 0, windowStart)

-- count current requests
local count = redis.call("ZCARD", key)

if count >= limit then
    return 0
end

-- add new request
redis.call("ZADD", key, now, now)

-- set expiry
redis.call("PEXPIRE", key, window)

return 1