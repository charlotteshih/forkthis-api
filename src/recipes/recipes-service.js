const xss = require('xss')

const RecipesService = {
  getAllRecipes(db) {
    return db
      .from('recipes AS rcp')
      .select(
        // '*',
        'rcp.id',
        'rcp.title',
        'rcp.author_id',
        'folders.folder_name',
        'items.quantity',
        'items.unit',
        'ing.item',
        'steps.sort_order',
        'inst.step'
      )
      .join(
        'folders',
        'rcp.folder_id',
        'folders.id'
      )
      .rightJoin(
        'recipe_items AS items',
        'rcp.id',
        'items.recipe_id'
      )
      .join(
        'ingredients as ing',
        'items.item_id',
        'ing.id'
      )
      .rightJoin(
        'recipe_steps AS steps',
        'rcp.id',
        'steps.recipe_id'
      )
      .join(
        'instructions AS inst',
        'steps.step_id',
        'inst.id'
      )
      .groupBy(
        'rcp.id',
        'folders.folder_name',
        'items.quantity',
        'items.unit',
        'ing.item',
        'steps.sort_order',
        'inst.step'
      )
      // .orderBy('steps.sort_order')
      // .options({ nestTables: true })
  }
}

module.exports = RecipesService