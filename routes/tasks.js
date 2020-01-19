const express = require('express')
const validate = require('validate.js')
const router = express.Router()
const db = require('../db.js')

router.get('/', async function (req, res, next) {
  try {
    const user = await db.User.findOne({ email: req.user.email })
    if (!user) {
      res.status(401)
    }
    res.status(200).send({ tasks: user.tasks })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message })
  }
})

router.post('/', async function (req, res, next) {
  const schema = {
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    deadline: {
      type: "string",
    },
    reminderDate: {
      type: "string"
    },
    isCompleted: {
      type: "boolean"
    }
  }
  try {
    const task = await validate.async(req.body, schema)
    if(!Object.keys(task).length) {
      throw new Error('no-properties-passed')
    }
    const user = await db.User.findOne({ email: req.user.email })
    if (!user) {
      res.status(401)
    }
    user.tasks.push(task)
    await db.User.updateOne({ email: user.email }, { tasks: user.tasks })
    res.status(200).send()
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message })
  }
})

router.patch('/:uid', async function (req, res, next) {
  const schema = {
    title: {
      type: "string"
    },
    description: {
      type: "string"
    },
    deadline: {
      type: "string",
    },
    reminderDate: {
      type: "string"
    },
    isCompleted: {
      type: "boolean"
    }
  }
  try {
    const task = await validate.async(req.body, schema)
    if(!Object.keys(task).length) {
      throw new Error('no-properties-passed')
    }
    const user = await db.User.findOne({ email: req.user.email })
    if (!user) {
      res.status(401)
    }
    const { uid } = req.query
    const foundTaskIndex = user.tasks.findIndex(t => t.uid === uid)
    if(foundTaskIndex === -1) {
      throw new Error('no-task-found')
    }
    user.tasks[foundTaskIndex] = task
    await db.User.updateOne({ email: user.email }, { tasks: user.tasks })
    res.status(200).send()
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message })
  }
})

router.delete('/:uid', async function (req, res, next) {
  try {
    const user = await db.User.findOne({ email: req.user.email })
    if (!user) {
      res.status(401)
    }
    const { uid } = req.query
    const foundTaskIndex = user.tasks.findIndex(t => t.uid === uid)
    if(foundTaskIndex === -1) {
      throw new Error('no-task-found')
    }
    user.tasks.splice(foundTaskIndex, 1)
    await db.User.updateOne({ email: user.email }, { tasks: user.tasks })
    res.status(200).send()
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message })
  }
})

module.exports = router