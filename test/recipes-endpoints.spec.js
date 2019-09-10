const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Recipes endpoints', function () {
  let db;

  const { testRecipes } = helpers.makeFixtures()
  const seedRecipes = helpers.makeRecipesArray()

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

  describe('GET /api/recipes', () => {
    context('Given there are recipes in the database', () => {
      beforeEach('Insert recipes', () => {
        helpers.seedRecipes(db, seedRecipes)
      })

      it(`Responds with 200`, () => {
        return supertest(app).get('/api/recipes').expect(200)
      })
    })
  })

  describe('GET /api/recipes/:rcp_id', () => {
    context('Given no recipes', () => {
      it('Responds with 404', () => {
        const rcpId = 123
        return supertest(app).get(`/api/recipes/${rcpId}`).expect(404)
      })
    })

    context('Given there are recipes', () => {
      beforeEach('Insert recipes', () => {
        helpers.seedRecipes(db, seedRecipes);
      })

      it('Responds with 200 and the specified recipe', () => {
        return supertest(app).get('/api/recipes/1').expect(200, testRecipes[0])
      })
    })
  })

  describe('POST /api/recipes', () => {
    context('Given no recipes', () => {
      it('Responds with 201 and a recipe object', () => {
        const rcpInfo = {
          id: 123,
          title: 'Test Recipe',
          folder_id: 1
        }
        return supertest(app).post('/api/recipes').send(rcpInfo).expect(201, rcpInfo)
      })
    })
  })

  describe('PATCH /api/recipes/:rcp_id', () => {
    context('Given there are recipes in the database', () => {
      beforeEach('Insert recipes', () => {
        helpers.seedRecipes(db, seedRecipes)
      })

      it('Responds with 204', () => {
        const rcpInfo = {
          title: 'New Recipe Name'
        }
        return supertest(app).patch('/api/recipes/2').send(rcpInfo).expect(204)
      })
    })
  })

  describe('DELETE /api/recipes/:rcp_id', () => {
    context('Given there are recipes in the database', () => {
      beforeEach('Insert recipes', () => {
        helpers.seedRecipes(db, seedRecipes)
      })

      it('Responds with 204', () => {
        return supertest(app).delete('/api/recipes/1').expect(204)
      })
    })
  })
})