const request = require('supertest')
const app = require('../../app')
const db = require('../../db')

jest.mock('../../settings', () => {
  return {
    JWT_SECRET: 'fake_jwt_secret',
    JWT_SECRET_EXPIRY: 24 * 60 * 60,
    DB: {}
  }
})

describe('auth', () => {
  describe('POST auth/login', () => {
    const password = 'fake_password'
    const email = 'fake_email'
    const data = {
      password,
      email
    }
    const user = {
      email,
      password
    }
    beforeEach(() => {
      jest.resetModules()
      db.User.findOne = jest.fn().mockReturnValue(user)
    })
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          password
        })
      expect(res.statusCode).toEqual(400)
    })
    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email
        })
      expect(res.statusCode).toEqual(400)
    })
    it('should return 400 when user does not exist', async () => {
      db.User.findOne.mockReturnValueOnce(null)
      const res = await request(app)
        .post('/auth/login')
        .send(data)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual({ error: 'user-not-found'})
      expect(db.User.findOne).toHaveBeenCalledTimes(1)
    })
    it('should return 400 when password is wrong', async () => {
      db.User.findOne.mockReturnValueOnce({ password: 'wrong_password'})
      const res = await request(app)
        .post('/auth/login')
        .send(data)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual({ error: 'wrong-password'})
    })
    it('should return status 200 and token in body when correct password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send(data)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ token: expect.any(String) })
      expect(db.User.findOne).toHaveBeenCalledTimes(1)
    })
  })

  describe('POST auth/register', () => {
    const password = 'fake_password'
    const email = 'fake_email'
    const data = {
      password,
      email
    }
    const user = {
      email,
      password
    }
    beforeEach(() => {
      jest.resetModules()
      db.User.findOne = jest.fn().mockReturnValue(null)
    })
    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          password
        })
      expect(res.statusCode).toEqual(400)
    })
    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email
        })
      expect(res.statusCode).toEqual(400)
    })
    it('should return 400 when user exists', async () => {
      db.User.findOne.mockReturnValueOnce(user)
      const res = await request(app)
        .post('/auth/register')
        .send(data)
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual({ error: 'email-exists'})
      expect(db.User.findOne).toHaveBeenCalledTimes(1)
    })
    it('should return status 200 when body correct', async () => {
      db.User.create = jest.fn()
      const res = await request(app)
        .post('/auth/register')
        .send(data)
      expect(res.statusCode).toEqual(200)
      expect(db.User.create).toHaveBeenCalledWith({ email, password })
    })
  })
})