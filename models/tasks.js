const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    presence: true
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
  },
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
