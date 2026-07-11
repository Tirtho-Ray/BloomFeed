export default () => ({
  port: parseInt(process.env.PORT || '9097', 10),
  node_env: process.env.NODE_ENV || 'development',

  security: {
    bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  },

  auth: {
    max_sessions: parseInt(process.env.MAX_SESSIONS || '5', 10),
    max_login_attempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS || '5', 10),
    lock_time_minutes: parseInt(process.env.LOCK_TIME_MINUTES || '12', 10),
  },

  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '15m',

    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refresh_ttl_days: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10),

    issuer: process.env.JWT_ISSUER || 'webvixxen_auth_services',
    audience: process.env.JWT_AUDIENCE || 'webvixxen_web',
  },


  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    url: process.env.REDIS_URL,
  },



  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  // ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
});
