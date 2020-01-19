const express = require('express')
const router = express.Router()
const db = require('../db.js')
const validate = require('validate.js')
const jwt = require('jsonwebtoken')
const settings = require('../settings')

router.post('/login', async function (req, res, next) {
  const schema = {
    email: {
      presence: true,
      type: "string"
    },
    password: {
      presence: true,
      type: "string"
    }
  }
  try {
    const { email, password } = await validate.async(req.body, schema)
    const user = await db.User.findOne({ email })
    if (!user) {
      throw new Error('user-not-found')
    }
    if (user.password !== password) {
      throw new Error('wrong-password')
    }
    // TODO store hashedPassword
    const token = jwt.sign({ email }, settings.JWT_SECRET, {
      expiresIn: settings.JWT_SECRET_EXPIRY
    })
    res.status(200).send({ token })
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message })
  }
})

router.post('/register', async function (req, res, next) {
  const schema = {
    email: {
      presence: true,
      type: "string"
    },
    password: {
      presence: true,
      type: "string"
    }
  }
  try {
    const { email, password } = await validate.async(req.body, schema)
    const existingUser = await db.User.findOne({ email })
    if (existingUser) {
      throw new Error('email-exists')
    }
    await db.User.create({ email, password })
    res.status(200).end()
  } catch (error) {
    console.error(error)
    res.status(400).send({ error: error.message })
  }
})

module.exports = router