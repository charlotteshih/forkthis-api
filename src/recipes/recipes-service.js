const xss = require('xss')

const RecipesService = {
  getAllRecipes(db) {
    return db
    .select('*')
      .from('recipes')
      .orderBy('recipes.id')
  },

  getRecipeById(db, id) {
    return RecipesService.getAllRecipes(db)
      .where('recipes.id', id)
      .first()
  },

  getRcpIngredients(db, rcp_id) {
    return db
      .from('ingredients AS ing')
      .select(
        'ing.quantity',
        'ing.unit',
        'ing.item'
      )
      .join(
        'recipes AS rcp',
        'rcp.id',
        'ing.recipe_id'
      )
      .where('rcp.id', rcp_id)
      .orderBy('ing.id')
  },

  getRcpSteps(db, rcp_id) {
    return db
      .from('steps')
      .select(
        'steps.sort_order',
        'steps.step'
      )
      .join(
        'recipes AS rcp',
        'rcp.id',
        'steps.recipe_id'
      )
      .where('rcp.id', rcp_id)
      .orderBy('steps.sort_order')
  },

  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => rows[0])
  },

  insertIngredients(db, newIngs) {
    return db
      .insert(newIngs)
      .into('ingredients')
      .returning('*')
      .then(rows => rows[0])
  },

  insertSteps(db, newSteps) {
    return db
      .insert(newSteps)
      .into('steps')
      .returning('*')
      .then(rows => rows[0])
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