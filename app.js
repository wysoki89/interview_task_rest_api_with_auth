const express = require('express')

const authRouter = require('./routes/auth')
const tasksRouter = require('./routes/tasks')
const auth = require('./middleware/auth')

const app = express()

app.use(express.json())
app.use(auth())

app.use('/auth', authRouter)
app.use('/tasks', tasksRouter)

module.exports = app