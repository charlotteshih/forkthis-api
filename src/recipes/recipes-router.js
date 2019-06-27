const express = require('express')
const path = require('path')
const RecipesService = require('./recipes-service')

const recipesRouter = express.Router()
const jsonParser = express.json()

recipesRouter.route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(RecipesService.serializeRecipes(recipes))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, folder_id } = req.body
    const newRecipe = { title, folder_id }

    for (const [key, value] of Object.entries(newRecipe)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key} in request body.` }
        })
      }
    }
    RecipesService.insertRecipe(
      req.app.get('db'),
      newRecipe
    )
      .then(recipe => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/${recipe.id}`)
          .json(RecipesService.serializeRecipe(recipe))
      })
      .catch(next)
  })

recipesRouter.route('/:rcp_id')
  .all(checkRcpExists)
  .get((req, res) => {
    return res.json(RecipesService.serializeRecipe(res.recipe))
  })
  .post(jsonParser, (req, res, next) => {
    const { quantity, unit, item } = req.body
    const newIngredients = { quantity, unit, item }

    RecipesService.insertIngredients(
      req.app.get('db'),
      newIngredients
    )
      .then(ing => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/ingredients`)
          .json(RecipesService.serializeIngredients(ing))
      })
      .catch(next)
  })
  // POST request for new steps????
  // .post()
  .patch(jsonParser, (req, res, next) => {
    const db = req.app.get('db')
    const recipe_id = req.params.rcp_id
    const name = req.body
    const recipeToUpdate = name
    const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body is empty.` }
      })
    }
    RecipesService.updateRecipe(db, recipe_id, recipeToUpdate)
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })
  .delete((req, res, next) => {
    RecipesService.deleteRecipe(
      req.app.get('db'),
      req.params.rcp_id
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })

recipesRouter.route('/:rcp_id/ingredients')
  .all(checkRcpExists)
  .get((req, res, next) => {
    RecipesService.getRcpIngredients(
      req.app.get('db'),
      req.params.rcp_id
    )
      .then(ingredients => {
        res.json(RecipesService.serializeIngredients(ingredients))
      })
      .catch(next)
  })
  // .patch()

recipesRouter.route('/:rcp_id/steps')
  .all(checkRcpExists)
  .get((req, res, next) => {
    RecipesService.getRcpSteps(
      req.app.get('db'),
      req.params.rcp_id
    )
      .then(steps => {
        res.json(RecipesService.serializeSteps(steps))
      })
      .catch(next)
  })
  // .post()
  // .patch()

async function checkRcpExists(req, res, next) {
  try {
    const recipe = await RecipesService.getRecipeById(
      req.app.get('db'),
      req.params.rcp_id
    )

    if(!recipe) {
      return res.status(404).json({
        error: `Recipe doesn't exist.`
      })
    }

    res.recipe = recipe
    next()
  } catch(error) {
    next(error)
  }
}

module.exports = recipesRouter