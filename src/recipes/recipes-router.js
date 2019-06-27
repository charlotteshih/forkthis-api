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
    const newRecipe = req.body
    for (const [key, value] of Object.entries(newRecipe)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key} in request body.` }
        })
      }
    }
    RecipesService.insertRecipe(
      req.app.get('db'),
      req.body
    )
      .then(newRecipe => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/${newRecipe.id}`)
          .json(RecipesService.serializeRecipe(newRecipe))
      })
      .catch(next)
  })

recipesRouter.route('/:rcp_id')
  .all(checkRcpExists)
  .get((req, res) => {
    return res.json(RecipesService.serializeRecipe(res.recipe))
  })
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
  // NOTE: THIS IS ONLY ABLE TO POST ONE OBJECT AT A TIME.
  //       HAVE TO FIGURE OUT HOW TO POST ARRAY OF OBJECTS.
  .post(jsonParser, (req, res, next) => {
    RecipesService.insertIngredients(
      req.app.get('db'),
      req.body
    )
      .then(ing => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/${ing.id}`)
          .json(RecipesService.serializeIngredient(ing))
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
  // NOTE: THIS IS ONLY ABLE TO POST ONE OBJECT AT A TIME.
  //       HAVE TO FIGURE OUT HOW TO POST ARRAY OF OBJECTS.
  .post(jsonParser, (req, res, next) => {
    RecipesService.insertSteps(
      req.app.get('db'),
      req.body
    )
      .then(step => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/steps`)
          .json(RecipesService.serializeStep(step))
      })
      .catch(next)
  })
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