const express = require('express')
const path = require('path')
const IngredientsService = require('./ingredients-service')

const ingredientsRouter = express.Router()
const jsonParser = express.json()

ingredientsRouter.route('/')
  .get((req, res, next) => {
    IngredientsService.getAllIngredients(req.app.get('db'))
      .then(ings => {
        res.json(IngredientsService.serializeIngredients(ings))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const data = req.body.ing
    const { recipe_id, quantity, unit, item } = data
    const newIng = { recipe_id, quantity, unit, item }

    IngredientsService.insertIngredients(
      req.app.get('db'),
      newIng
    )
      .then(ing => {
        res.status(201)
          .location(path.posix.join(req.originalUrl), `/item/${ing.id}`)
          .json(IngredientsService.serializeIngredient(ing))
      })
      .catch(next)
  });

ingredientsRouter.route('/:rcp_id')
  .all(checkRcpExists)
  .get((req, res) => {
    return res.json(IngredientsService.serializeIngredients(res.rcp))
  })

ingredientsRouter.route('/item/:ing_id')
  .all(checkIngExists)
  .patch(jsonParser, (req, res, next) => {
    const { recipe_id, quantity, unit, item } = req.body
    const ingToUpdate = { recipe_id, quantity, unit, item }
    const numberOfValues = Object.values(ingToUpdate).filter(Boolean).length

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain either 'recipe_id', 'quantity', 'unit', or 'item'.` }
      })
    }
    IngredientsService.updateIngredients(
      req.app.get('db'),
      req.params.ing_id,
      ingToUpdate
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })
  .delete((req, res, next) => {
    IngredientsService.deleteIngredients(
      req.app.get('db'),
      req.params.ing_id
    )
      .then(numRowsAffected => res.status(204).end())
      .catch(next)
  })

async function checkRcpExists(req, res, next) {
  try {
    const rcp = await IngredientsService.getIngByRcpId(
      req.app.get('db'),
      req.params.rcp_id
    )
    if (!rcp) {
      return res.status(404).json({
        error: `Recipe doesn't exist.`
      })
    }
    res.rcp = rcp
    next()
  } catch (error) {
    next(error)
  }
}

async function checkIngExists(req, res, next) {
  try {
    const ing = await IngredientsService.getIngById(
      req.app.get('db'),
      req.params.ing_id
    )
    if (!ing) {
      return res.status(404).json({
        error: `Ingredient doesn't exist.`
      })
    }
    res.ing = ing
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = ingredientsRouter