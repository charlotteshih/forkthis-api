BEGIN;

TRUNCATE
    folders,
    recipes,
    ingredients,
    steps
    RESTART IDENTITY CASCADE;

INSERT INTO folders (folder_name)
VALUES
    ('Breakfast'),
    ('Lunch'),
    ('Dinner'),
    ('Dessert');

INSERT INTO recipes (title, folder_id)
VALUES
    ('Scrambled Eggs', 1),
    ('Spam Fried Rice', 3);

INSERT INTO ingredients (recipe_id, quantity, unit, item)
VALUES
    (1, '3', '', 'Eggs'),
    (1, '3', 'Tbsp.', 'Olive oil'),
    (1, '1/4', 'Cups', 'Milk'),
    (1, '', '', 'Salt and pepper (to taste)'),
    (2, '2', 'Cups', 'Rice'),
    (2, '2', '', 'Eggs'),
    (2, '1', 'can', 'Spam, diced'),
    (2, '1', 'cup', 'Frozen veggies'),
    (2, '', '', 'Soy sauce (to taste)'),
    (2, '', '', 'Powdered or freshly grated ginger (to taste)'),
    (2, '', '', 'Salt and pepper (to taste)'),
    (2, '', '', 'Roasted sesame seeds'),
    (2, '', '', 'Freshly sliced green onion');

INSERT INTO steps (recipe_id, sort_order, step)
VALUES
    (1, 1, 'Heat olive oil in pan on low heat until shimmering. Meanwhile, crack eggs into a bowl, and whip until foamy.'),
    (1, 2, 'Add egg-and-milk batter to pan. Stir constantly, taking care not to let eggs burn.'),
    (1, 3, 'When eggs are cooked through but not rubbery, remove from heat and salt and pepper to taste.'),
    (2, 1, 'In a large pan, toss diced Spam cubes with soy sauce until edges become crispy - about 5 minutes. Set aside.'),
    (2, 2, 'Scramble eggs and cook in same pan.'),
    (2, 3, 'Add Spam and frozen veggies to eggs and toss until well-incorporated and veggies are thawed.'),
    (2, 4, 'Add rice into pan and toss until well-incorporated, seasoning to taste with soy sauce, ginger, and salt and pepper.'),
    (2, 5, 'Top with roasted sesame seeds and a handful of freshly sliced green onions, and enjoy!');

COMMIT;