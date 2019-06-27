const express = require('express')
const path = require('path')
const RecipesService = require('./recipes-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const recipesRouter = express.Router()
const jsonParser = express.json()

recipesRouter.route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(RecipesService.treeizeRecipes(recipes))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    for (const [key, value] of Object.entries(req.body)) {
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
      .then(recipe => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/${recipe.id}`)
          .json(RecipesService.treeizeRecipe(recipe))
      })
      .catch(next)
  })

recipesRouter.route('/:rcp_id')
  // .all(requireAuth)
  .all(checkRcpExists)
  .get((req, res) => {
    return res.json(RecipesService.treeizeRecipe(res.recipe))
  })
  // .patch()
  // .delete()

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
  // .post()

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