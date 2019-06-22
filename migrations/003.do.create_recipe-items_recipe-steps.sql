CREATE TABLE recipe_items (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    item_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (recipe_id, item_id)
);

CREATE TABLE recipe_steps (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    step_id INTEGER REFERENCES instructions(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (recipe_id, step_id)
);