function makeFoldersArray() {
  return [
    {
      id: 1,
      folder_name: 'Folder 1'
    },
    {
      id: 2,
      folder_name: 'Folder 2'
    },
    {
      id: 3,
      folder_name: 'Folder 3'
    }
  ]
}

function makeRecipesArray() {
  return [
    {
      id: 1,
      title: 'Recipe 1',
      folder_id: 3
    },
    {
      id: 2,
      title: 'Recipe 2',
      folder_id: 1
    },
    {
      id: 3,
      title: 'Recipe 3',
      folder_id: 2
    }
  ]
}

function makeIngredientsArray() {
  return [
    {
      id: 1,
      recipe_id: 1,
      quantity: '1',
      unit: 'Tbsp',
      item: 'Sugar'
    },
    {
      id: 2,
      recipe_id: 2,
      quantity: '9',
      unit: '',
      item: 'Eggs'
    },
    {
      id: 3,
      recipe_id: 3,
      quantity: '4',
      unit: 'Sticks',
      item: 'Butter'
    },
  ]
}

function makeStepsArray() {
  return [
    {
      id: 1,
      recipe_id: 1,
      sort_order: 1,
      step: 'Cook'
    },
    {
      id: 2,
      recipe_id: 2,
      sort_order: 1,
      step: 'Eat'
    },
    {
      id: 3,
      recipe_id: 3,
      sort_order: 1,
      step: 'Yum'
    },
  ]
}

function makeFixtures() {
  const testFolders = makeFoldersArray()
  const testRecipes = makeRecipesArray()
  const testIngredients = makeIngredientsArray()
  const testSteps = makeStepsArray()
  return { testFolders, testRecipes, testIngredients, testSteps }
}

function seedFolders(db, folders) {
  return db
    .into("folders")
    .insert(folders)
    .then(() => {
      db.raw(`SELECT setval('folders_id_seq', ?)`, [
        folders[folders.length - 1].id
      ]);
    });
}

function seedRecipes(db, recipes) {
  return db
    .into("recipes")
    .insert(recipes)
    .then(() => {
      db.raw(`SELECT setval('recipes_id_seq', ?)`, [
        recipes[recipes.length - 1].id
      ]);
    });
}

function seedIngredients(db, ingredients) {
  return db
    .into('ingredients')
    .insert(ingredients)
    .then(() => {
      db.raw(`SELECT setval('ingredients_id_seq', ?)`, [
        ingredients[ingredients.length - 1].id
      ])
    })
}

function seedSteps(db, steps) {
  return db
    .into('steps')
    .insert(steps)
    .then(() => {
      db.raw(`SELECT setval('steps_id_seq', ?)`, [
        steps[steps.length - 1].id
      ])
    })
}

function cleanTables(db) {
  return db.raw(
      `BEGIN;
      
      TRUNCATE
        steps,
        ingredients,
        recipes,
        folders
        RESTART IDENTITY CASCADE;
      
      ALTER SEQUENCE steps_id_seq MINVALUE 0 START WITH 1;
      ALTER SEQUENCE ingredients_id_seq MINVALUE 0 START WITH 1;
      ALTER SEQUENCE recipes_id_seq MINVALUE 0 START WITH 1;
      ALTER SEQUENCE folders_id_seq MINVALUE 0 START WITH 1;

      SELECT setval('steps_id_seq', 0);
      SELECT setval('ingredients_id_seq', 0);
      SELECT setval('recipes_id_seq', 0);
      SELECT setval('folders_id_seq', 0);

      COMMIT;`
    )
}

module.exports = {
  makeFoldersArray,
  makeRecipesArray,
  makeIngredientsArray,
  makeStepsArray,
  makeFixtures,
  seedFolders,
  seedRecipes,
  seedIngredients,
  seedSteps,
  cleanTables,
}