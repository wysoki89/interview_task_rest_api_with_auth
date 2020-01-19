const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String
  },
  deadline: {
    type: Date
  },
  reminderDate: {
    type: Date
  },
  isCompleted: {
    type: Boolean
  }
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  tasks: [taskSchema]
})

const User = mongoose.model('User', userSchema)

module.exports = User
