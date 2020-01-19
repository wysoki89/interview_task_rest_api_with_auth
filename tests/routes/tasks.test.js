const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../app')
const db = require('../../db')

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

jest.mock('../../middleware/auth', () => () => (req, res, next) => {
  req.user = {
    email: 'fake_email'
  }
  return next()
})

describe('tasks', () => {
  const password = 'fake_password'
  const email = 'fake_email'
  const user = {
    email,
    password,
    tasks: []
  }
  const token = jwt.sign({
    email
  }, mockSettings.JWT_SECRET, {
    expiresIn: mockSettings.JWT_SECRET_EXPIRY
  })
  beforeEach(() => {
    jest.resetModules()
    db.User.findOne = jest.fn().mockReturnValue(user)
    db.User.updateOne = jest.fn()
  })
  describe('GET /tasks', () => {
    it('should return 200 and return tasks when token is correct', async () => {
      const res = await request(app)
        .get('/tasks/')
        .set('Authorization', `Bearer ${token}`)
        .send()
      expect(res.statusCode).toEqual(200)
      expect(db.User.findOne).toHaveBeenCalledTimes(1)
      expect(res.body).toEqual({
        tasks: user.tasks
      })
    })
  })
  describe('POST /tasks', () => {
    const now = new Date()
    const title = 'fake_title'
    const description = 'fake_desc'
    const deadline = now.toISOString()
    const reminderDate = now.toISOString()
    const isCompleted = false
    const task = {
      title,
      description,
      deadline,
      reminderDate,
      isCompleted
    }
    it('should return 400 and not create task when no property is passed', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({})
      expect(res.statusCode).toEqual(400)
      expect(res.body).toEqual({
        error: 'no-properties-passed'
      })
      expect(db.User.updateOne).toHaveBeenCalledTimes(0)
    })
    it('should return 400 and not create task when deadline is of wrong type', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          task: {
            ...task,
            deadline: 'fake_deadline'
          }
        })
      expect(res.statusCode).toEqual(400)
      expect(db.User.updateOne).toHaveBeenCalledTimes(0)
    })
    it('should return 200 and create task when at least one parameter is present and parameters are of correct type', async () => {
      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(task)
      expect(res.statusCode).toEqual(200)
      expect(db.User.updateOne).toHaveBeenCalledWith({
        email: user.email
      }, {
        tasks: [task]
      })
    })
  })
  describe('PATCH /tasks', () => {
    const title = 'fake_title_updated'
    const now = new Date()
    const description = 'fake_desc'
    const deadline = now.toISOString()
    const reminderDate = now.toISOString()
    const isCompleted = false
    const uid = 'fake_uid'
    const task = {
      uid,
      title,
      description,
      deadline,
      reminderDate,
      isCompleted
    }
    it('should return 400 and not update task when no property is passed', async () => {
      const res = await request(app)
        .patch(`/tasks/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({})
      expect(res.statusCode).toEqual(400)
      expect(db.User.updateOne).toHaveBeenCalledTimes(0)
    })
    it('should return 400 and not update task when deadline is of wrong type', async () => {
      const res = await request(app)
        .patch(`/tasks/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          task: {
            ...task,
            deadline: 'fake_deadline'
          }
        })
      expect(res.statusCode).toEqual(400)
      expect(db.User.updateOne).toHaveBeenCalledTimes(0)
    })
    it('should return 400 when task not found', async () => {
      const res = await request(app)
        .patch(`/tasks/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          task: {
            ...task,
            deadline: 'fake_deadline'
          }
        })
      expect(res.statusCode).toEqual(400)
      expect(db.User.updateOne).toHaveBeenCalledTimes(0)
    })
    it('should return 200 and update task when at least one parameter is present and parameters are of correct type', async () => {
      const updatedTask = {
        ...task,
        title: 'updated_title'
      }
      delete updatedTask.uid
      const res = await request(app)
        .patch(`/tasks/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTask)
      expect(res.statusCode).toEqual(200)
      expect(db.User.updateOne).toHaveBeenCalledWith({ email }, { tasks: [updatedTask] })
    })
  })
  describe('DELETE /tasks', () => {
    const uid = 'fake_uid'
    it('should return 400 and not delete task when task not found', async () => {
      db.User.findOne.mockReturnValueOnce(null)
      const res = await request(app)
        .delete(`/tasks/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
      expect(res.statusCode).toEqual(400)
      expect(db.User.updateOne).toHaveBeenCalledTimes(0)
    })
    it('should return 200 and delete task when task found', async () => {
      const res = await request(app)
        .delete(`/tasks/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send()
      expect(res.statusCode).toEqual(200)
      expect(db.User.updateOne).toHaveBeenCalledWith({ email }, { tasks: [] })
    })
  })
})