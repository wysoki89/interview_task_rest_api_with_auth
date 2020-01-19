const mongoose = require('mongoose')
const settings = require('./settings')
const User = require('./models/user')

const url = `mongodb+srv://${settings.DB.USER}:${settings.DB.PASSWORD}@${settings.DB.HOST}/${settings.DB.NAME}?retryWrites=true&w=majority`

module.exports = {
  connect: () => {
    mongoose.connect(url, {
      useNewUrlParser: true
    })
    return mongoose.connection
  },
  User
}