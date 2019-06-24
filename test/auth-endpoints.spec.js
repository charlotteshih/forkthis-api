const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', function() {
  let db

  const { testUsers } = helpers.makeFixtures()
  const testUser = testUsers[0]

  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  // before('Cleanup', () => helpers.cleanTables(db))
  // afterEach('Cleanup', () => helpers.cleanTables(db))
  after('Disconnect from db', () => db.destroy())

  describe(`POST /api/authorization/login`, () => {
    beforeEach('Insert users', () => {
      helpers.seedUsers(db, testUsers)
    })

    const requiredFields = ['username', 'password', 'nickname']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
        nickname: testUser.nickname
      }

      it(`Responds with 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/authorization/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body.`
          })
      })
    })

    it(`Responds 400 'Incorrect username or password.' when bad password`, () => {
      const userInvalidPass = {
        username: testUser.username,
        nickname: testUser.nickname,
        password: 'incorrect'
      }

      return supertest(app)
        .post('/api/authorization/login')
        .send(userInvalidPass)
        .expect(400, { error: 'Incorrect username or password.' })
    })

    it(`Responds 200 and JWT auth token user secret when valid credentials`, () => {
      const userValidCreds = {
        username: testUser.username,
        nickname: testUser.nickname,
        password: testUser.password
      }

      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256'
        }
      )

      return supertest(app)
        .post('/api/authorization/login')
        .send(userValidCreds)
        .expect(200, { authToken: expectedToken })
    })
  })
})