const xss = require('xss')

const IngredientsService = {
  getAllIngredients(db) {
    return db
      .select('*')
      .from('ingredients')
  },

  getIngByRcpId(db, rcp_id) {
    return IngredientsService.getAllIngredients(db)
      .where('ingredients.recipe_id', rcp_id)
  },

  getIngById(db, ing_id) {
    return IngredientsService.getAllIngredients(db)
      .where('ingredients.id', ing_id)
  },

  insertIngredients(db, newIngs) {
    return db
      .insert(newIngs)
      .into('ingredients')
      .returning('*')
      .then(rows => rows[0])
  },

  updateIngredients(db, id, ingToUpdate) {
    return db('ingredients').where({ id }).update(ingToUpdate)
  },

  deleteIngredients(db, id) {
    return db('ingredients').where({ id }).delete()
  },

  serializeIngredients(ingredients) {
    return ingredients.map(this.serializeIngredient)
  },

  serializeIngredient(ingredient) {
    return {
      id: ingredient.id,
      recipe_id: ingredient.recipe_id,
      quantity: xss(ingredient.quantity),
      unit: xss(ingredient.unit),
      item: xss(ingredient.item)
    }
  }
}

module.exports = IngredientsService