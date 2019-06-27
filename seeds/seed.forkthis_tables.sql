BEGIN;

TRUNCATE
    users,
    folders,
    ingredients,
    instructions,
    recipes,
    recipe_items,
    recipe_steps
    RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, nickname)
VALUES
    ('cyshih', 'Password123!', 'Charlotte');

INSERT INTO folders (folder_name)
VALUES
    ('Breakfast'),
    ('Lunch'),
    ('Dinner'),
    ('Dessert');

INSERT INTO recipes (title, author_id, folder_id)
VALUES
    ('Scrambled Eggs', 1, 1),
    ('Spam Fried Rice', 1, 3);

INSERT INTO ingredients (item)
VALUES
    ('Eggs'),
    ('Olive oil'),
    ('Milk'),
    ('Salt and pepper (to taste)'),
    ('Rice'),
    ('Eggs'),
    ('Spam, diced'),
    ('Frozen veggies'),
    ('Soy sauce (to taste)'),
    ('Powdered or freshly grated ginger (to taste)'),
    ('Salt and pepper (to taste)'),
    ('Roasted sesame seeds'),
    ('Freshly sliced green onion');

INSERT INTO recipe_items (recipe_id, item_id, quantity, unit)
VALUES
    (1, 1, '3', ''),
    (1, 2, '3', 'Tbsp.'),
    (1, 3, '1/4', 'Cups'),
    (1, 4, '', ''),
    (2, 5, '2', 'Cups'),
    (2, 6, '2', ''),
    (2, 7, '1', 'can'),
    (2, 8, '1', 'cup'),
    (2, 9, '', ''),
    (2, 10, '', ''),
    (2, 11, '', ''),
    (2, 12, '', ''),
    (2, 13, '', '');

INSERT INTO instructions (step)
VALUES
    ('Heat olive oil in pan on low heat until shimmering. Meanwhile, crack eggs into a bowl, and whip until foamy.'),
    ('Add egg-and-milk batter to pan. Stir constantly, taking care not to let eggs burn.'),
    ('When eggs are cooked through but not rubbery, remove from heat and salt and pepper to taste.'),
    ('In a large pan, toss diced Spam cubes with soy sauce until edges become crispy - about 5 minutes. Set aside.'),
    ('Scramble eggs and cook in same pan.'),
    ('Add Spam and frozen veggies to eggs and toss until well-incorporated and veggies are thawed.'),
    ('Add rice into pan and toss until well-incorporated, seasoning to taste with soy sauce, ginger, and salt and pepper.'),
    ('Top with roasted sesame seeds and a handful of freshly sliced green onions, and enjoy!');

INSERT INTO recipe_steps (recipe_id, step_id, sort_order)
VALUES
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 3),
    (2, 4, 1),
    (2, 5, 2),
    (2, 6, 3),
    (2, 7, 4),
    (2, 8, 5);

COMMIT;
