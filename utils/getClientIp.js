/**
 * Get the real client IP address from the request
 * Handles various proxy headers to get the actual client IP
 * 
 * @param {Object} req - Next.js API request object
 * @returns {string} - Client IP address
 */
export function getClientIp(req) {
  // Check various headers that might contain the real IP
  const forwarded = req.headers['x-forwarded-for'];
  const real = req.headers['x-real-ip'];
  const cfConnecting = req.headers['cf-connecting-ip']; // Cloudflare
  const trueClientIp = req.headers['true-client-ip']; // Cloudflare Enterprise
  
  // X-Forwarded-For can contain multiple IPs (client, proxy1, proxy2, ...)
  // The first IP is usually the real client IP
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0];
  }
  
  // Check other common headers
  if (cfConnecting) return cfConnecting;
  if (trueClientIp) return trueClientIp;
  if (real) return real;
  
  // Fallback to socket IP (least reliable, often shows proxy IP)
  return req.socket.remoteAddress || req.connection.remoteAddress || 'unknown';
}

/**
 * Get detailed IP information including all proxy headers
 * Useful for debugging and spam analysis
 * 
 * @param {Object} req - Next.js API request object
 * @returns {Object} - Object containing various IP-related headers
 */
export function getDetailedIpInfo(req) {
  return {
    clientIp: getClientIp(req),
    xForwardedFor: req.headers['x-forwarded-for'] || null,
    xRealIp: req.headers['x-real-ip'] || null,
    cfConnectingIp: req.headers['cf-connecting-ip'] || null,
    trueClientIp: req.headers['true-client-ip'] || null,
    socketIp: req.socket.remoteAddress || null,
    userAgent: req.headers['user-agent'] || null,
    referer: req.headers['referer'] || null,
    origin: req.headers['origin'] || null,
  };
}

/**
 * Check if IP address is from a known VPN/proxy service
 * This is a basic check - you can expand this list
 * 
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if IP appears to be from VPN/proxy
 */
export function isVpnOrProxy(ip) {
  // Common VPN/proxy IP ranges (example - expand as needed)
  const suspiciousRanges = [
    '10.', // Private network
    '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', // Private network
    '192.168.', // Private network
    '127.', // Localhost
  ];
  
  return suspiciousRanges.some(range => ip.startsWith(range));
}

/**
 * Get geolocation hint from IP (if using Cloudflare or similar CDN)
 * 
 * @param {Object} req - Next.js API request object
 * @returns {Object} - Geolocation information if available
 */
export function getGeolocation(req) {
  return {
    country: req.headers['cf-ipcountry'] || null,
    city: req.headers['cf-ipcity'] || null,
    timezone: req.headers['cf-timezone'] || null,
  };
}
