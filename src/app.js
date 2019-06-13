require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const recipesRouter = require('./recipes/recipes-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router.js')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use('/api/recipes', recipesRouter)
app.use('/api/users', usersRouter)
app.use('/api/authorization', authRouter)

app.use(errorHandler)

function errorHandler(error, req, res, next) {
	let response

	if (NODE_ENV === 'production') {
		response = { error: { message: 'Server error' } }
	}

	console.error(error)
	response = { message: error.message, error }

	res.status(500).json(response)
}

module.exports = app