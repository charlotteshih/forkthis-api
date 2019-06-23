const express = require('express')
const RecipesService = require('./recipes-service')
const Treeize = require('treeize')

const recipesRouter = express.Router()

recipesRouter.route('/')
  .get((req, res, next) => {
    RecipesService.getAllRecipes(req.app.get('db'))
      .then(recipes => {
        res.json(RecipesService.serializeRecipes(recipes))
      })
      // .then(recipes => res.json(recipes))
      // .then(recipesJson => {
      //   let recipes = new Treeize()
      //   recipes.grow(recipesJson).getData()
      // })
      .catch(next)
  })


module.exports = recipesRouter