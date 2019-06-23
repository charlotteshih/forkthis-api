const xss = require('xss')
const Treeize = require('treeize')

const RecipesService = {
  getAllRecipes(db) {
    return db
      .from('recipes AS rcp')
      .select(
        // '*',
        'rcp.id',
        'rcp.title',
        'folders.folder_name',
        ...userInfo,
        ...ingList,
        ...stepList
        // 'items.quantity',
        // 'items.unit',
        // 'ing.item',
        // 'steps.sort_order',
        // 'inst.step'
      )
      .innerJoin(
        'users',
        'rcp.author_id',
        'users.id'
      )
      .innerJoin(
        'folders',
        'rcp.folder_id',
        'folders.id'
      )
      .innerJoin(
        'recipe_items AS items',
        'rcp.id',
        'items.recipe_id'
      )
      .innerJoin(
        'ingredients as ing',
        'items.item_id',
        'ing.id'
      )
      .innerJoin(
        'recipe_steps AS steps',
        'rcp.id',
        'steps.recipe_id'
      )
      .innerJoin(
        'instructions AS inst',
        'steps.step_id',
        'inst.id'
      )
      // .groupBy(
      //   'rcp.id',
      //   'users.id',
      //   'folders.id',
      //   'ing.id',
      //   'items.quantity',
      //   'items.unit',
      //   'items.recipe_id',
      //   'steps.recipe_id',
      //   'steps.sort_order',
      //   'inst.id'
      // )
      .orderBy('steps.sort_order')
  },

  serializeRecipes(recipes) {
    return recipes.map(this.serializeRecipe)
  },

  serializeRecipe(recipe) {
    const rcpTree = new Treeize()
    const rcpData = rcpTree.grow([ recipe ]).getData()[0]

    return {
      id: rcpData.id,
      title: xss(rcpData.title),
      folder: rcpData.folder_name,
      author: rcpData.author || {},
      ingredients: rcpData.ingredients || [],
      steps: rcpData.steps || []
    }
  }
}

const userInfo = [
  'users.id AS author:id',
  'users.username AS author:username',
  'users.nickname AS author:nickname'
]

const ingList = [
  'items.quantity AS ingredients:quantity',
  'items.unit AS ingredients:unit',
  'ing.item AS ingredients:item',
]

const stepList = [
  'steps.sort_order AS steps:sort_order',
  'inst.step AS steps:step'
]

module.exports = RecipesService