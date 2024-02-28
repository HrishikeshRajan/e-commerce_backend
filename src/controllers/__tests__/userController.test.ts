import request from 'supertest'
import app, { createDatabaseConnection } from '../../index'
import { StatusCodes } from 'http-status-codes'
import UserModel from '../../models/userModel'

beforeAll(async () => {
  void createDatabaseConnection(process.env.MONGODB_URL_DEV as string)
})

describe.skip('User Controller', () => {
  describe('Register API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an error response when user submit empty fields', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        fullname: '',
        email: '',
        password: ''
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.success).toBeFalsy()
      expect(res.body).toBeDefined()
    })
    it.skip('should return an error response when user submit illegal characters ', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        fullname: 'eval(10)',
        email: 'eval(20)',
        password: 'while(true){}'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.success).toBeFalsy()
      expect(res.body).toBeDefined()
    })
    it.skip('should return an error response when user submit invalid email address ', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeragmailcom',
        password: 'RedWood*&56*&'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.success).toBeFalsy()
      expect(res.body).toBeDefined()
    })
    it.skip('should return an error response when user submit characters less than minimum ', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        fullname: 'h',
        email: 'h@g.com',
        password: '1'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.success).toBeFalsy()
      expect(res.body).toBeDefined()
    })
    it.skip('should return an error response when input fields contain injected fields ', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        fullname: 'h',
        email: 'h@g.com',
        password: '1',
        testFiled: '10'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.success).toBeFalsy()
      expect(res.body).toBeDefined()
    })
    it.skip('should return an success response when user successfully login with status code 201', async () => {
      const res = await request(app).post('/api/v1/users/register').send({
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(res.statusCode).toBe(StatusCodes.CREATED)
      expect(res.body.success).toBeTruthy()
      expect(res.body.message.token).toBeDefined()
    })
    it.skip('should return an error response with status code 409 when user tries to register with already registered email address', async () => {
      const registerResponse = await request(app).post('/api/v1/users/register').send({
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(registerResponse.statusCode).toBe(StatusCodes.CREATED)
      expect(registerResponse.body.success).toBeTruthy()
      expect(registerResponse.body.message).toBeDefined()

      await request(app).get(`/api/v1/users/register/url?token=${registerResponse.body.message.token}`)

      const reRegisterResponse = await request(app).post('/api/v1/users/register').send({
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(reRegisterResponse.statusCode).toBe(StatusCodes.CONFLICT)
      expect(reRegisterResponse.body.success).toBeFalsy()
      expect(reRegisterResponse.body.message).toBeDefined()
    })
  })

  describe.skip('Verify Email API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response of 202 when user requsted with valid token', async () => {
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()
    })
    it('should return an error response of 403 when user submits expired token', async () => {
      const expiredToken = process.env.EXPIRED_TOKEN

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${expiredToken}`)
      expect(urlRes.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(urlRes.body.success).toBeFalsy()
      expect(urlRes.body.message).toBeDefined()
    })
    it('should return an error response of 403 when user submits expired token more than once at same time', async () => {
      const expiredToken = process.env.EXPIRED_TOKEN

      const urlRes1 = await request(app).get(`/api/v1/users/register/url?token=${expiredToken}`)
      expect(urlRes1.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(urlRes1.body.success).toBeFalsy()
      expect(urlRes1.body.message).toBeDefined()

      const urlRes2 = await request(app).get(`/api/v1/users/register/url?token=${expiredToken}`)
      expect(urlRes2.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(urlRes2.body.success).toBeFalsy()
      expect(urlRes2.body.message).toBeDefined()

      const urlRes3 = await request(app).get(`/api/v1/users/register/url?token=${expiredToken}`)
      expect(urlRes3.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(urlRes3.body.success).toBeFalsy()
      expect(urlRes3.body.message).toBeDefined()

      const urlRes4 = await request(app).get(`/api/v1/users/register/url?token=${expiredToken}`)
      expect(urlRes4.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(urlRes4.body.success).toBeFalsy()
      expect(urlRes4.body.message).toBeDefined()
    })
    it('should return an success response of 202 when user submits valid token more than once at same time', async () => {
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const noOfClicks = 5

      for (let i = 0; i < noOfClicks; i++) {
        const urlRes1 = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
        expect(urlRes1.statusCode).toBe(StatusCodes.ACCEPTED)
        expect(urlRes1.body.success).toBeTruthy()
        expect(urlRes1.body.message).toBeDefined()
      }
    })
    it('should return an error response of 422 when user submits without token', async () => {
      const token = ''

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(urlRes.body.success).toBeFalsy()
      expect(urlRes.body.message).toBeDefined()
    })
    it('should return an error response of 403 when user submits different token', async () => {
      const token = process.env.RANDOM_TOKEN

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(urlRes.body.success).toBeFalsy()
      expect(urlRes.body.message).toBeDefined()
    })
    it('should return an success response when user generates mutliple verification links and only latest link is valid', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }

      let latestToken = ''

      const numberOfRequestes = 5

      for (let i = 0; i < numberOfRequestes; i++) {
        const regRes = await request(app).post('/api/v1/users/register').send({
          fullname: user.fullname,
          email: user.email,
          password: user.password
        }).set('Accept', 'application/json')
          .expect('Content-Type', /json/)

        expect(regRes.statusCode).toBe(StatusCodes.CREATED)
        expect(regRes.body.success).toBeTruthy()
        expect(regRes.body.message.token).toBeDefined()
        latestToken = regRes.body.message.token
      }

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${latestToken}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()
    })
    it('should return an error response when user generates mutliple verification links and clicked the old link', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }

      let firstToken = null

      const numberOfRequestes = 5

      for (let i = 0; i < numberOfRequestes; i++) {
        const regRes = await request(app).post('/api/v1/users/register').send({
          fullname: user.fullname,
          email: user.email,
          password: user.password
        }).set('Accept', 'application/json')
          .expect('Content-Type', /json/)

        expect(regRes.statusCode).toBe(StatusCodes.CREATED)
        expect(regRes.body.success).toBeTruthy()
        expect(regRes.body.message.token).toBeDefined()
        if (firstToken === null) {
          firstToken = regRes.body.message.token
        }
      }

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${firstToken}`)
      expect(urlRes.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(urlRes.body.success).toBeFalsy()
      expect(urlRes.body.message).toBeDefined()
    })
  })

  describe.skip('Login API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user successfully login', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
    })
    it('should return an success response even when extra user input field is added', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password,
        test: 'eval(while(true){})'
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
    })
    it('should return an error response when user tries to login with unregistered email address', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikerajan3@gmail.com',
        password: 'RedWood*&56*&'
      }
      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(loginRes.body.message).toBeDefined()
    })
    it('should return an error response of 422 when user input field is empty', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: '',
        password: ''
      }).set('Accept', 'application/json')
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.message).toBeDefined()
    })
    it('should return an error response when user input field is less than minimum length', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'tgcom',
        password: 't'
      }).set('Accept', 'application/json')
      expect(res.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(res.body.message).toBeDefined()
    })
    it('should return an error response of 400 when user submitted invalid password', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: 'testone12233&&&'
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(loginRes.body.message).toBeDefined()
    })
  })

  describe.skip('Logout API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user requets for logout', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const accessToken = loginRes.header['set-cookie']

      const logoutRes = await request(app)
        .get('/api/v1/users/logout')
        .set('Cookie', [...accessToken])
        .send()

      expect(logoutRes.statusCode).toBe(StatusCodes.OK)
      expect(logoutRes.body.message.message).toBeDefined()
    })
    it('should return an error response when user sends a logout request without loggedin', async () => {
      const logoutRes = await request(app).get('/api/v1/users/logout')
      expect(logoutRes.statusCode).toBe(StatusCodes.UNAUTHORIZED)
      expect(logoutRes.body.message).toBeDefined()
    })
  })

  describe.skip('Forgot Password API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user submit registered email address', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
        email: user.email
      }).set('Accept', 'application/json')

      expect(forgotRes.statusCode).toBe(StatusCodes.OK)
      expect(forgotRes.body.message.token).toBeDefined()
    })
    it('should return an success response when user submit unregistered email address', async () => {
      const user = {
        email: 'Test@gmail.com'
      }
      const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
        email: user.email
      }).set('Accept', 'application/json')

      expect(forgotRes.statusCode).toBe(StatusCodes.OK)
      expect(forgotRes.body.success).toBeTruthy()
      expect(forgotRes.body.message).toBeDefined()
    })
    it('should return an error response when user submit empty field', async () => {
      const user = {
        email: ''
      }
      const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
        email: user.email
      }).set('Accept', 'application/json')

      expect(forgotRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(forgotRes.body.message).toBeDefined()
    })
    it('should return an error response when user submit illegal inputs', async () => {
      const user = {
        email: 'eval(while(true))'
      }
      const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
        email: user.email
      }).set('Accept', 'application/json')

      expect(forgotRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(forgotRes.body.message).toBeDefined()
    })
  })
  describe.skip('Forgot Password Reset API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user successfully resets the password', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
        email: user.email
      }).set('Accept', 'application/json')

      expect(forgotRes.statusCode).toBe(StatusCodes.OK)
      expect(forgotRes.body.message.token).toBeDefined()

      const userCred = {
        token: forgotRes.body.message.token,
        password: 'Root@#1234@#$'
      }
      const resetRes = await request(app).put('/api/v1/users/forgot/password').send({
        token: userCred.token,
        password: userCred.password
      }).set('Accept', 'application/json')
      expect(resetRes.statusCode).toBe(StatusCodes.OK)
      expect(resetRes.body.success).toBeTruthy()
      expect(resetRes.body.message.message).toBeDefined()
    })
    it('should return an error response when user submits expired token', async () => {
      const resetRes = await request(app).put('/api/v1/users/forgot/password').send({
        token: process.env.EXPIRED_FORGOT_PASSWORD_TOKEN,
        password: 'tes@#1234@#@'
      }).set('Accept', 'application/json')
      expect(resetRes.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(resetRes.body.success).toBeFalsy()
      expect(resetRes.body.message.message).toBeUndefined()
    })
    it('should return an error response when user submits empty input', async () => {
      const resetRes = await request(app).put('/api/v1/users/forgot/password').send({
        token: '',
        password: ''
      }).set('Accept', 'application/json')
      expect(resetRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(resetRes.body.success).toBeFalsy()
      expect(resetRes.body.message.message).toBeUndefined()
    })
    it('should return an success response when user submits latest token', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const cycle = 5
      let latestToken = ''
      for (let i = 0; i < cycle; i++) {
        const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
          email: user.email
        }).set('Accept', 'application/json')

        expect(forgotRes.statusCode).toBe(StatusCodes.OK)
        expect(forgotRes.body.message.token).toBeDefined()
        latestToken = forgotRes.body.message.token
      }
      const userCred = {
        token: latestToken,
        password: 'Root@#1234@#$'
      }
      const resetRes = await request(app).put('/api/v1/users/forgot/password').send({
        token: userCred.token,
        password: userCred.password
      }).set('Accept', 'application/json')
      expect(resetRes.statusCode).toBe(StatusCodes.OK)
      expect(resetRes.body.success).toBeTruthy()
      expect(resetRes.body.message.message).toBeDefined()
    })
    it('should return an error response when user generates multiple tokens and submits old token before expiry time', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const cycle = 5
      let firstToken = null
      for (let i = 0; i < cycle; i++) {
        const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
          email: user.email
        }).set('Accept', 'application/json')

        expect(forgotRes.statusCode).toBe(StatusCodes.OK)
        expect(forgotRes.body.message.token).toBeDefined()

        if (firstToken === null) {
          firstToken = forgotRes.body.message.token
        }
      }
      const userCred = {
        token: firstToken,
        password: 'Root@#1234@#$'
      }
      const resetRes = await request(app).put('/api/v1/users/forgot/password').send({
        token: userCred.token,
        password: userCred.password
      }).set('Accept', 'application/json')
      expect(resetRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(resetRes.body.success).toBeFalsy()
      expect(resetRes.body.message.message).toBeUndefined()
    })
    it.skip('should return an error response when user submit illegal inputs', async () => {
      const user = {
        email: 'eval(while(true))'
      }
      const forgotRes = await request(app).post('/api/v1/users/forgot/password').send({
        email: user.email
      }).set('Accept', 'application/json')

      expect(forgotRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(forgotRes.body.message).toBeDefined()
    })
  })

  describe.skip('Change Password API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user successfully changes the password', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
      const accessToken = loginRes.header['set-cookie']
      const changeRes = await request(app).put('/api/v1/users/change/password')
        .set('Cookie', [...accessToken])
        .send({
          currentPassword: user.password,
          newPassword: user.newPassword
        }).set('Accept', 'application/json')

      expect(changeRes.statusCode).toBe(StatusCodes.OK)
      expect(changeRes.body.message.message).toBeDefined()
      expect(changeRes.body.success).toBeTruthy()
    })
    it('should return an error response when user tires to send requests without loggedin', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const changeRes = await request(app).put('/api/v1/users/change/password')
        .send({
          currentPassword: user.password,
          newPassword: user.newPassword
        }).set('Accept', 'application/json')

      expect(changeRes.statusCode).toBe(StatusCodes.UNAUTHORIZED)
      expect(changeRes.body.message.message).toBeUndefined()
      expect(changeRes.body.success).toBeFalsy()
    })
    it('should return an error response when user tires to send requests with empty fields', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
      const accessToken = loginRes.header['set-cookie']
      const changeRes = await request(app).put('/api/v1/users/change/password')
        .set('Cookie', [...accessToken])
        .send({
          currentPassword: '',
          newPassword: ''
        }).set('Accept', 'application/json')

      expect(changeRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(changeRes.body.message.message).toBeUndefined()
      expect(changeRes.body.success).toBeFalsy()
    })
  })

  describe.skip('Add Address API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user successfully add the address', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
      const accessToken = loginRes.header['set-cookie']
      const changeRes = await request(app).post('/api/v1/users/address')
        .set('Cookie', [...accessToken])
        .send({

          fullname: 'Hrishikesh Rajan',
          city: 'Austin',
          homeAddress: '44 E. West Street Ashland, OH 44805 ',
          state: 'Kerala',
          postalCode: '673001',
          phoneNo: '9084422881',
          country: 'India'

        }).set('Accept', 'application/json')
      expect(changeRes.statusCode).toBe(StatusCodes.OK)
      expect(changeRes.body.message).toBeDefined()
      expect(changeRes.body.success).toBeTruthy()
    })
    it('should return an error response when user submits empty inputs', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
      const accessToken = loginRes.header['set-cookie']
      const changeRes = await request(app).post('/api/v1/users/address')
        .set('Cookie', [...accessToken])
        .send({

          fullname: '',
          city: '',
          homeAddress: '',
          state: '',
          postalCode: '',
          phoneNo: '',
          country: ''

        }).set('Accept', 'application/json')

      expect(changeRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(changeRes.body.message).toBeDefined()
      expect(changeRes.body.success).toBeFalsy()
    })
  })

  describe.skip('fetch Address API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response of 200 ok with user addresses', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const myAddressRes = await request(app).get('/api/v1/users/addresses').set('Cookie', [...accessToken])
      expect(myAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(myAddressRes.body.success).toBeTruthy()
      expect(myAddressRes.body.message.address).toBeDefined()
    })
    it('should return an success response of 200 ok with user addresses and _id field should be defined', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const myAddressRes = await request(app).get('/api/v1/users/addresses').set('Cookie', [...accessToken])
      expect(myAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(myAddressRes.body.success).toBeTruthy()
      expect(myAddressRes.body.message.address).toBeDefined()

      const len = myAddressRes.body.message.address.length

      for (let index = 0; index < len; index++) {
        expect(myAddressRes.body.message.address[index]._id).toBeDefined()
      }
    })
  })
  describe.skip('Edit Address API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response when user updates fields', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const myAddressRes = await request(app).get('/api/v1/users/addresses').set('Cookie', [...accessToken])
      expect(myAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(myAddressRes.body.success).toBeTruthy()
      expect(myAddressRes.body.message.address).toBeDefined()

      const len = myAddressRes.body.message.address.length

      for (let index = 0; index < len; index++) {
        expect(myAddressRes.body.message.address[index]._id).toBeDefined()
      }

      const addressId = myAddressRes.body.message.address[0]._id

      const changeAddressRes = await request(app).put('/api/v1/users/address')
        .set('Cookie', [...accessToken])
        .send({
          addressId,
          fullname: '',
          city: 'Kalady',
          homeAddress: '',
          state: 'Kerala',
          postalCode: '',
          phoneNo: '',
          country: 'India'

        }).set('Accept', 'application/json')

      expect(changeAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(changeAddressRes.body.message).toBeDefined()
      expect(changeAddressRes.body.success).toBeTruthy()

      const address = changeAddressRes.body.message.address.find((address: any) => addressId.toString() === address._id.toString())
      expect(address._id).toBe(addressId)
      expect(address.city).toBe('Kalady')
      expect(address.state).toBe('Kerala')
    })
    it('should return an error response when user submits empty inputs', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()
      const accessToken = loginRes.header['set-cookie']
      const changeRes = await request(app).put('/api/v1/users/address')
        .set('Cookie', [...accessToken])
        .send({

          fullname: '',
          city: '',
          homeAddress: '',
          state: '',
          postalCode: '',
          phoneNo: '',
          country: ''

        }).set('Accept', 'application/json')

      expect(changeRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(changeRes.body.message).toBeDefined()
      expect(changeRes.body.success).toBeFalsy()
    })
  })
  describe.skip('Delete Address API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })
    it('should return an success response with address except the deleted address', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const myAddressRes = await request(app).get('/api/v1/users/addresses').set('Cookie', [...accessToken])
      expect(myAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(myAddressRes.body.success).toBeTruthy()
      expect(myAddressRes.body.message.address).toBeDefined()

      const len = myAddressRes.body.message.address.length

      for (let index = 0; index < len; index++) {
        expect(myAddressRes.body.message.address[index]._id).toBeDefined()
      }

      const addressId = myAddressRes.body.message.address[0]._id

      const deleteAddressRes = await request(app).delete('/api/v1/users/address/' + addressId)
        .set('Cookie', [...accessToken])
        .set('Accept', 'application/json')

      expect(deleteAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(deleteAddressRes.body.message.address).toBeDefined()
      expect(deleteAddressRes.body.success).toBeTruthy()

      const address = deleteAddressRes.body.message.address.find((address: any) => addressId.toString() === address._id.toString())

      expect(address).toBeUndefined()
      expect(deleteAddressRes.statusCode).toBe(StatusCodes.OK)
    })
    it('should return an success response with address except the deleted address', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const myAddressRes = await request(app).get('/api/v1/users/addresses').set('Cookie', [...accessToken])
      expect(myAddressRes.statusCode).toBe(StatusCodes.OK)
      expect(myAddressRes.body.success).toBeTruthy()
      expect(myAddressRes.body.message.address).toBeDefined()

      const len = myAddressRes.body.message.address.length

      for (let index = 0; index < len; index++) {
        expect(myAddressRes.body.message.address[index]._id).toBeDefined()
      }

      const addressId = '123456'

      const deleteAddressRes = await request(app).delete('/api/v1/users/address/' + addressId)
        .set('Cookie', [...accessToken])
        .set('Accept', 'application/json')

      expect(deleteAddressRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(deleteAddressRes.body.message.address).toBeUndefined()
      expect(deleteAddressRes.body.success).toBeFalsy()
    })
  })
  describe.skip('Show User Profile API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })

    it('should return an success response with user profile', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const userProfileRes = await request(app).get('/api/v1/users/profile').set('Cookie', [...accessToken]).set('Accept', 'application/json')
      expect(userProfileRes.statusCode).toBe(StatusCodes.OK)
      expect(userProfileRes.body.message).toBeDefined()
      expect(userProfileRes.body.success).toBeTruthy()
    })
    it('should return an error response for unauthorized requests', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const userProfileRes = await request(app).get('/api/v1/users/profile').set('Accept', 'application/json')
      expect(userProfileRes.statusCode).toBe(StatusCodes.UNAUTHORIZED)
      expect(userProfileRes.body.message).toBeDefined()
      expect(userProfileRes.body.success).toBeFalsy()
    })
  })
  describe.skip('Edit User Profile API', () => {
    afterEach(async () => {
      await UserModel.deleteMany({})
    })

    it('should return an success response when user profile', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const userProfileRes = await request(app).put('/api/v1/users/profile')
        .set('Cookie', [...accessToken])
        .send({

          fullname: 'Test User',
          username: 'testuser123',
          gender: 'Male'

        })
        .set('Accept', 'application/json')

      expect(userProfileRes.statusCode).toBe(StatusCodes.OK)
      expect(userProfileRes.body.message).toBeDefined()
      expect(userProfileRes.body.success).toBeTruthy()
    })
    it('should return an error response when user submits empty in', async () => {
      const user = {
        fullname: 'Hrishikesh Rajan',
        email: 'hrishikeraj@gmail.com',
        password: 'RedWood*&56*&',
        newPassword: 'Water@#1234@#'
      }
      const regRes = await request(app).post('/api/v1/users/register').send({
        fullname: user.fullname,
        email: user.email,
        password: user.password

      }).set('Accept', 'application/json')
        .expect('Content-Type', /json/)

      expect(regRes.statusCode).toBe(StatusCodes.CREATED)
      expect(regRes.body.success).toBeTruthy()
      expect(regRes.body.message.token).toBeDefined()

      const urlRes = await request(app).get(`/api/v1/users/register/url?token=${regRes.body.message.token}`)
      expect(urlRes.statusCode).toBe(StatusCodes.ACCEPTED)
      expect(urlRes.body.success).toBeTruthy()
      expect(urlRes.body.message).toBeDefined()

      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json')

      expect(loginRes.statusCode).toBe(StatusCodes.OK)
      expect(loginRes.body.message).toBeDefined()
      expect(loginRes.headers['set-cookie']).toBeDefined()

      const addresses = [
        {
          fullname: 'John Smith',
          city: 'Mumbai',
          homeAddress: '123 Sunshine Lane',
          state: 'Maharashtra',
          postalCode: '400001',
          phoneNo: '9876543210',
          country: 'India'
        },
        {
          fullname: 'ABC Corporation',
          city: 'Delhi',
          homeAddress: '456 Business Street',
          state: 'Delhi',
          postalCode: '110001',
          phoneNo: '8765432109',
          country: 'India'
        },
        {
          fullname: 'Maria Rodriguez',
          city: 'Goa',
          homeAddress: '789 Vacation Road',
          state: 'Goa',
          postalCode: '403001',
          phoneNo: '7654321098',
          country: 'India'
        },
        {
          fullname: 'Emily Johnson',
          city: 'Bangalore',
          homeAddress: '234 Campus Avenue',
          state: 'Karnataka',
          postalCode: '560001',
          phoneNo: '6543210987',
          country: 'India'
        },
        {
          fullname: 'David Brown',
          city: 'Hyderabad',
          homeAddress: '567 Tech Boulevard',
          state: 'Telangana',
          postalCode: '500001',
          phoneNo: '9876543210',
          country: 'India'
        }
      ]

      const accessToken = loginRes.header['set-cookie']

      for (let i = 0; i < addresses.length; i++) {
        const changeRes = await request(app).post('/api/v1/users/address')
          .set('Cookie', [...accessToken])
          .send({

            fullname: addresses[i].fullname,
            city: addresses[i].city,
            homeAddress: addresses[i].homeAddress,
            state: addresses[i].state,
            postalCode: addresses[i].postalCode,
            phoneNo: addresses[i].phoneNo,
            country: addresses[i].country

          }).set('Accept', 'application/json')

        expect(changeRes.statusCode).toBe(StatusCodes.OK)
        expect(changeRes.body.message).toBeDefined()
        expect(changeRes.body.success).toBeTruthy()
      }

      const userProfileRes = await request(app).put('/api/v1/users/profile')
        .set('Cookie', [...accessToken])
        .send({

          fullname: '',
          gender: ''

        })
        .set('Accept', 'application/json')

      expect(userProfileRes.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
      expect(userProfileRes.body.message).toBeDefined()
      expect(userProfileRes.body.success).toBeFalsy()
    })
  })
})
