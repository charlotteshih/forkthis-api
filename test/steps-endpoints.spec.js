const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Steps endpoints', function () {
  let db;

  const seedSteps = helpers.makeStepsArray()

  before('Make knex instance', () => {
    db = knex({
      client: `pg`,
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('Disconnect from db', () => db.destroy())
  before('Cleanup', () => helpers.cleanTables(db))
  afterEach('Cleanup', () => helpers.cleanTables(db))

  describe('GET /api/steps', () => {
    context('Given there are steps in the database', () => {
      beforeEach('Insert steps', () => {
        helpers.seedSteps(db, seedSteps)
      })

      it(`Responds with 200`, () => {
        return supertest(app).get('/api/steps').expect(200)
      })
    })
  })

  describe('POST /api/steps', () => {
    context('Given no steps', () => {
      it('Responds with 201 and a step object', () => {
        const stepInfo = {
          id: 123,
          recipe_id: 2,
          sort_order: 1,
          step: 'Yummmmmmmmm',
        }
        return supertest(app).post('/api/steps').send(stepInfo).expect(201, stepInfo)
      })
    })
  })

  describe('PATCH /api/steps/step/:step_id', () => {
    context('Given there are steps in the database', () => {
      beforeEach('Insert steps', () => {
        helpers.seedSteps(db, seedSteps)
      })

      it('Responds with 204', () => {
        const stepInfo = {
          step: 'EAT!!!'
        }
        return supertest(app).patch('/api/steps/2').send(stepInfo).expect(204)
      })
    })
  })

  describe('DELETE /api/steps/step/:step_id', () => {
    context('Given there are steps in the database', () => {
      beforeEach('Insert steps', () => {
        helpers.seedSteps(db, seedSteps)
      })

      it('Responds with 204', () => {
        return supertest(app).delete('/api/steps/1').expect(204)
      })
    })
  })
})