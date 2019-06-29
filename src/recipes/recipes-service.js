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
  }
}

module.exports = RecipesService