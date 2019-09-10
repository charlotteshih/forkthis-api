const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Folders endpoints', function () {
  let db;

  const { testFolders } = helpers.makeFixtures()
  const seedFolders = helpers.makeFoldersArray()

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

  describe('GET /api/folders', () => {
    context('Given there are folders in the database', () => {
      beforeEach('Insert folders', () => {
        helpers.seedFolders(db, seedFolders)
      })

      it(`Responds with 200 and all of the folders`, () => {
        return supertest(app).get('/api/folders').expect(200, testFolders)
      })
    })
  })

  describe('GET /api/folders/:folder_id', () => {
    context('Given no folders', () => {
      it('Responds with 404', () => {
        const folderId = 123
        return supertest(app).get(`/api/folders/${folderId}`).expect(404)
      })
    })

    context('Given there are folders', () => {
      beforeEach('Insert folders', () => {
        helpers.seedFolders(db, seedFolders);
      })

      it('Responds with 200 and the specified folder', () => {
        return supertest(app).get('/api/folders/1').expect(200, testFolders[0])
      })
    })
  })

  describe('POST /api/folders', () => {
    context('Given no folders', () => {
      it('Responds with 201 and a folder object', () => {
        const folderInfo = {
          id: 123,
          folder_name: 'Test Folder'
        }
        return supertest(app).post('/api/folders').send(folderInfo).expect(201, folderInfo)
      })
    })
  })

  describe('PATCH /api/folders/:folder_id', () => {
    context('Given there are folders in the database', () => {
      beforeEach('Insert folders', () => {
        helpers.seedFolders(db, seedFolders)
      })

      it('Responds with 204', () => {
        const folderInfo = {
          folder_name: 'New Folder Name'
        }
        return supertest(app).patch('/api/folders/2').send(folderInfo).expect(204)
      })
    })
  })

  describe('DELETE /api/folders/:folder_id', () => {
    context('Given there are folders in the database', () => {
      beforeEach('Insert folders', () => {
        helpers.seedFolders(db, seedFolders)
      })

      it('Responds with 204', () => {
        return supertest(app).delete('/api/folders/1').expect(204)
      })
    })
  })
})