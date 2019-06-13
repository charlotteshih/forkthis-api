BEGIN;

TRUNCATE
    folders,
    ingredients,
    instructions,
    recipes,
    users,
    recipe_items,
    recipe_steps
    RESTART IDENTITY CASCADE;

INSERT INTO folders (folder_name)
VALUES
    ('Quick and easy'),
    ('A little more effort'),
    ('Special Occasion'),
    ('Baking');

INSERT INTO ingredients (item)
VALUES
    ('Eggs'),
    ('Olive oil'),
    ('Milk'),
    ('Salt and pepper (to taste)');

INSERT INTO instructions (step)
VALUES
    ('Heat olive oil in pan on low heat until shimmering. Meanwhile, crack eggs into a bowl, and whip until foamy.'),
    ('Add egg-and-milk batter to pan. Stir constantly, taking care not to let eggs burn.'),
    ('When eggs are cooked through but not rubbery, remove from heat and salt and pepper to taste.');

INSERT INTO users (username, password, nickname)
VALUES
    ('cyshih', 'Password123!', 'Charlotte');

INSERT INTO recipes (title, author_id, folder_id, serving_size)
VALUES
    ('Scrambled Eggs', 1, 1, 1);

INSERT INTO recipe_items (recipe_id, item_id, quantity, unit)
VALUES
    (1, 1, '2', NULL),
    (1, 2, '3', 'Tbsp.'),
    (1, 3, '1/4', 'cups'),
    (1, 4, NULL, NULL);

INSERT INTO recipe_steps (recipe_id, step_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3);

COMMIT;