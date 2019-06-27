const xss = require('xss')
const Treeize = require('treeize')

const RecipesService = {
  getAllRecipes(db) {
    return db
      .from('recipes AS rcp')
      .select(
        'rcp.id',
        'rcp.title',
        'rcp.folder_id'
      )
      .orderBy('rcp.id')
  },

  getRecipeById(db, id) {
    return RecipesService.getAllRecipes(db)
      .where('rcp.id', id)
      .first()
  },

  getRcpIngredients(db, rcp_id) {
    return db
      .from('recipe_items as ri')
      .where('ri.recipe_id', rcp_id)
      .select(
        'ri.quantity',
        'ri.unit',
        'ing.item'
      )
      .join(
        'ingredients AS ing',
        'ing.id',
        'ri.item_id'
      )
      .orderBy('ri.item_id')
  },

  getRcpSteps(db, rcp_id) {
    return db
      .from('recipe_steps as rs')
      .where('rs.recipe_id', rcp_id)
      .select(
        'rs.sort_order',
        'ins.step'
      )
      .join(
        'instructions AS ins',
        'ins.id',
        'rs.step_id'
      )
      .orderBy('rs.sort_order')
  },

  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => rows[0])
  },

  insertIngredients(db, id, newIngredients) {
    return db('recipe_items').where({ id }).update(newIngredients)
  },

  insertSteps(db, id, newSteps) {
    return db('recipe_steps').where({ id }).update(newSteps)
  },

  updateRecipe(db, id, newRecipeFields) {
    return db('recipes').where({ id }).update(newRecipeFields)
  },

  updateIngredients() {},

  updateSteps() {},

  deleteRecipe(db, id) {
    return db('recipes').where({ id }).delete()
  },

  deleteIngredients() {},

  deleteSteps() {},

  serializeRecipes(recipes) {
    return recipes.map(this.serializeRecipe)
  },

  serializeRecipe(recipe) {
    return {
      id: recipe.id,
      title: xss(recipe.title),
      folder_id: recipe.folder_id
    }
  },

  serializeIngredients(ingredients) {
    return ingredients.map(this.serializeIngredient)
  },

  serializeIngredient(ingredient) {
    return {
      quantity: xss(ingredient.quantity),
      unit: xss(ingredient.unit),
      item: xss(ingredient.item)
    }
  },

  serializeSteps(steps) {
    return steps.map(this.serializeStep)
  },

  serializeStep(step) {
    return {
      order: step.sort_order,
      step: xss(step.step)
    }
  }
}

// const folderInfo = [
//   'fld.id AS folder:id',
//   'fld.folder_name AS folder:name'
// ]

module.exports = RecipesService