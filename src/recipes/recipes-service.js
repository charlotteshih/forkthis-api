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

  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into('recipes')
      .returning('*')
      .then(rows => rows[0])
  },

  updateRecipe(db, id, newRecipeFields) {
    return db('recipes').where({ id }).update(newRecipeFields)
  },

  deleteRecipe(db, id) {
    return db('recipes').where({ id }).delete()
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