import 'dotenv/config'
export const env = {
  HOST: process.env.HOST,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_LIFE_TIME: process.env.JWT_TOKEN_LIFE_TIME,
  HASH_SECRET: process.env.HASH_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_USER: process.env.REDIS_USER,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  IS_PRODUCTION: process.env.NODE_ENV === 'production'
}
