const express = require('express')
const RecipesService = require('./recipes-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const recipesRouter = express.Router()

recipesRouter.route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(RecipesService.treeizeRecipes(recipes))
      })
      .catch(next)
  })
  // .post()

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