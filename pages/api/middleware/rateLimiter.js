// Simple in-memory store for rate limiting
const rateLimit = new Map();

export function rateLimiter(options = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // Limit each IP to 5 requests per windowMs
}) {
  return async function(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    
    // Get the requests array for this IP, or create a new one
    const requests = rateLimit.get(ip) || [];
    
    // Filter out requests older than the window
    const recentRequests = requests.filter(time => time > now - options.windowMs);
    
    // Check if the request limit has been exceeded
    if (recentRequests.length >= options.max) {
      throw new Error('Too many requests');
    }
    
    // Add current request timestamp
    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) { // 1% chance to clean up
      for (const [key, times] of rateLimit.entries()) {
        const filtered = times.filter(time => time > now - options.windowMs);
        if (filtered.length === 0) {
          rateLimit.delete(key);
        } else {
          rateLimit.set(key, filtered);
        }
      }
    }
  };
}
