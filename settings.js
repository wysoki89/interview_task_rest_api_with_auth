module.exports = {
  DB: {
    HOST: process.env.DB_HOST || '',
    USER: process.env.DB_USER || '',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || ''
  },
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_SECRET_EXPIRY: 24 * 60 * 60
}