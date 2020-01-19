const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')

const mockSettings = {
  JWT_SECRET: 'fake_jwt_secret',
  JWT_SECRET_EXPIRY: 24 * 60 * 60,
  DB: {}
}
jest.mock('../../settings', () => {
  return {
    JWT_SECRET: 'fake_jwt_secret',
    JWT_SECRET_EXPIRY: 24 * 60 * 60,
    DB: {}
  }
})

describe('middleware auth', () => {
  const protectedRoute = '/tasks'
  const email = 'fake_email'
  it('should return 401 when missing token', async () => {
    const res = await request(app)
      .get(protectedRoute)
      .send()
    expect(res.statusCode).toEqual(401)
  })
  it('should return 401 when token empty', async () => {
    const res = await request(app)
      .get(protectedRoute)
      .set('Authorization', '')
      .send()
    expect(res.statusCode).toEqual(401)
  })
  it('should return 401 when token generated with wrong secret', async () => {
    const token = jwt.sign({
      email
    }, 'incorrect_secret', {
      expiresIn: mockSettings.JWT_SECRET_EXPIRY
    })
    const res = await request(app)
      .get(protectedRoute)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(res.statusCode).toEqual(401)
  })
  it('should return 401 when token expired', async () => {
    const token = jwt.sign({
      email
    }, 'incorrect_secret', {
      expiresIn: 0
    })
    const res = await request(app)
      .get(protectedRoute)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(res.statusCode).toEqual(401)
  })
})
