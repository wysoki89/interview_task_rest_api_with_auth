const expressJwt = require('express-jwt')
const settings = require('../settings')

module.exports = () => {
  return expressJwt({
    secret: settings.JWT_SECRET
  }).unless({
    path: [
      '/auth/login',
      '/auth/register'
    ]
  })
}