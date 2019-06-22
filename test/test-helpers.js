const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'testuser1',
      nickname: 'Test 1',
      password: 'Password1!'
    },
    {
      id: 2,
      username: 'testuser2',
      nickname: 'Test 2',
      password: 'Password2!'
    },
    {
      id: 3,
      username: 'testuser3',
      nickname: 'Test 3',
      password: 'Password3!'
    },
    {
      id: 4,
      username: 'testuser4',
      nickname: 'Test 4',
      password: 'Password4!'
    }
  ]
}

// MAKE MORE FIXTURES AS I ADD MORE ENDPOINTS
function makeFixtures() {
  const testUsers = makeUsersArray()
  return { testUsers }
}

// TRUNCATE MORE TABLES AS I ADD MORE ENDPOINTS
function cleanTables(db) {
  return db.transaction(trx => {
    trx.raw(
      `TRUNCATE users`
    )
    .then(() => {
      Promise.all([
        trx.raw(`ALTER SEQUENCE users minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('users', 0)`)
      ])
    })
  })
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))

  return db
    .insert(preppsedUsers)
    .into('users')
    .then(() => {
      db.raw(`SELECT setval('users', ?)`, [users[users.length - 1].id])
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,

  makeFixtures,
  cleanTables,
  seedUsers,

  makeAuthHeader
}