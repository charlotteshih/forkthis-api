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

const morganOption = (NODE_ENV === 'production')
	? 'tiny'
	: 'common';

app.use(cors())
app.options('*', cors())
app.use(helmet())
app.use(morgan(morganOption))

app.use('/api/recipes', recipesRouter)
app.use('/api/folders', foldersRouter)
app.use('/api/ingredients', ingredientsRouter)
app.use('/api/steps', stepsRouter)

app.get("/", (req, res) => {
  res.send("Hello, world!");
})

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