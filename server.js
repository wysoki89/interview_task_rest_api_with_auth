require('dotenv').config()
const db = require('./db')
const app = require('./app')

db.connect().once('open', _ => {
  console.log('Database connected')
  app.listen(3000, function () {
    console.log('Listening on port 3000...')
  })
}).on('error', err => {
  console.error('connection error:', err)
  process.exit(1)
})
