const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Ingredients endpoints', function () {
  let db;

  const seedIngredients = helpers.makeIngredientsArray()

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

  describe('GET /api/ingredients', () => {
    context('Given there are ingredients in the database', () => {
      beforeEach('Insert ingredients', () => {
        helpers.seedIngredients(db, seedIngredients)
      })

      it(`Responds with 200`, () => {
        return supertest(app).get('/api/ingredients').expect(200)
      })
    })
  })

  describe('POST /api/ingredients', () => {
    context('Given no ingredients', () => {
      it('Responds with 201 and an ingredient object', () => {
        const ingInfo = {
          id: 123,
          recipe_id: 2,
          quantity: 'Some',
          unit: '',
          item: 'Test Recipe',
        }
        return supertest(app).post('/api/ingredients').send(ingInfo).expect(201, ingInfo)
      })
    })
  })

  describe('PATCH /api/ingredients/item/:ing_id', () => {
    context('Given there are ingredients in the database', () => {
      beforeEach('Insert ingredients', () => {
        helpers.seedIngredients(db, seedIngredients)
      })

      it('Responds with 204', () => {
        const ingInfo = {
          quantity: '100000'
        }
        return supertest(app).patch('/api/ingredients/2').send(ingInfo).expect(204)
      })
    })
  })

  describe('DELETE /api/ingredients/item/:ing_id', () => {
    context('Given there are ingredients in the database', () => {
      beforeEach('Insert ingredients', () => {
        helpers.seedIngredients(db, seedIngredients)
      })

      it('Responds with 204', () => {
        return supertest(app).delete('/api/ingredients/1').expect(204)
      })
    })
  })
})