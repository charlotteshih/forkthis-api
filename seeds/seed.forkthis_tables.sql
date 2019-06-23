BEGIN;

TRUNCATE
    users,
    ingredients,
    instructions,
    folders,
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
    ('Scrambled Eggs', 1, 1);

INSERT INTO recipe_items (recipe_id, item_id, quantity, unit)
VALUES
    (1, 1, '3', ''),
    (1, 2, '3', 'Tbsp.'),
    (1, 3, '1/4', 'Cups'),
    (1, 4, '', '');

INSERT INTO ingredients (item)
VALUES
    ('Eggs'),
    ('Olive oil'),
    ('Milk'),
    ('Salt and pepper (to taste)');

INSERT INTO recipe_steps (recipe_id, step_id, sort_order)
VALUES
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 3);

INSERT INTO instructions (step)
VALUES
    ('Heat olive oil in pan on low heat until shimmering. Meanwhile, crack eggs into a bowl, and whip until foamy.'),
    ('Add egg-and-milk batter to pan. Stir constantly, taking care not to let eggs burn.'),
    ('When eggs are cooked through but not rubbery, remove from heat and salt and pepper to taste.');

COMMIT;