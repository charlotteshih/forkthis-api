require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const recipesRouter = require('./recipes/recipes-router')
const foldersRouter = require('./folders/folders-router')
const ingredientsRouter = require('./ingredients/ingredients-router')
const stepsRouter = require('./steps/steps-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.use('/api/recipes', recipesRouter)
app.use('/api/folders', foldersRouter)
app.use('/api/ingredients', ingredientsRouter)
app.use('/api/steps', stepsRouter)

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