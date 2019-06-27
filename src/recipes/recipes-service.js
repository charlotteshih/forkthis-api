const xss = require('xss')
const Treeize = require('treeize')

const RecipesService = {
  getAllRecipes(db) {
    return db
      .from('recipes AS rcp')
      .select(
        'rcp.id',
        'rcp.title',
        ...userInfo,
        ...folderInfo
      )
      .join(
        'users AS usr',
        'usr.id',
        'rcp.author_id'
      )
      .join(
        'folders as fld',
        'fld.id',
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
  },

  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => rows[0])
  },

  treeizeRecipes(recipes) {
    return recipes.map(this.treeizeRecipe)
  },

  treeizeRecipe(recipe) {
    const tree = new Treeize()
    const rcpTree = tree.grow([ recipe ]).getData()[0]

    return {
      id: rcpTree.id,
      title: xss(rcpTree.title),
      folder: rcpTree.folder_name,
      author: rcpTree.author || {},
      folder: rcpTree.folder || {}
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

const userInfo = [
  'usr.id AS author:id',
  'usr.username AS author:username',
  'usr.nickname AS author:nickname'
]

const folderInfo = [
  'fld.id AS folder:id',
  'fld.folder_name AS folder:name'
]

module.exports = RecipesService