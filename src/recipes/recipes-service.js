const xss = require('xss')
// const Treeize = require('treeize')

const RecipesService = {
  getAllRecipes(db) {
    return db
    .select('*')
      .from('recipes')
      .orderBy('recipes.id')
  },
  // getAllRecipes(db) {
  //   return db
  //     .from('recipes AS rcp')
  //     .join(
  //       'ingredients AS ing',
  //       'ing.recipe_id',
  //       'rcp.id'
  //     )
  //     .join(
  //       'steps',
  //       'steps.recipe_id',
  //       'rcp.id'
  //     )
  //     .select(
  //       'rcp.title',
  //       'rcp.folder_id',
  //       ...rcpIngs,
  //       ...rcpSteps
  //     )
  // },

  getRecipeById(db, id) {
    return RecipesService.getAllRecipes(db)
      .where('recipes.id', id)
      .first()
  },

  getRcpIngredients(db, rcp_id) {
    return db
      .from('ingredients AS ing')
      .select(
        'ing.id',
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
        'steps.id',
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

  updateIngredients(db, id, ingToUpdate) {
    return db('ingredients').where({ id }).update(ingToUpdate)
  },

  updateSteps(db, id, stepToUpdate) {
    return db('steps').where({ id }).update(stepToUpdate)
  },

  deleteRecipe(db, id) {
    return db('recipes').where({ id }).delete()
  },

  deleteIngredient(db, id) {
    return db('ingredients').where({ id }).delete()
  },

  deleteStep(db, id) {
    return db('steps').where({ id }).delete()
  },

  serializeRecipes(recipes) {
    return recipes.map(this.serializeRecipe)
  },

  serializeRecipe(recipe) {
    return {
      id: recipe.id,
      title: xss(recipe.title),
      folder_id: recipe.folder_id
    }
    // const tree = new Treeize()
    // const rcpTree = tree.grow([ recipe ]).getData()[0]

    // return {
    //   id: rcpTree.id,
    //   title: xss(rcpTree.title),
    //   folder_id: rcpTree.folder_id,
    //   ingredients: rcpTree.ingredients || [],
    //   steps: rcpTree.steps || []
    // }
  },

  serializeIngredients(ingredients) {
    return ingredients.map(this.serializeIngredient)
  },

  serializeIngredient(ingredient) {
    return {
      id: ingredient.id,
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
      id: step.id,
      order: step.sort_order,
      step: xss(step.step)
    }
  }
}

// const rcpIngs = [
//   'ing.quantity AS ingredients:quantity',
//   'ing.unit AS ingredients:unit',
//   'ing.item AS ingredients:item'
// ]

// const rcpSteps = [
//   'steps.sort_order AS steps:sort_order',
//   'steps.step AS steps:step'
// ]

module.exports = RecipesService