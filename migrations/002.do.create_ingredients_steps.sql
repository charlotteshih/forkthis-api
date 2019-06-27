CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    quantity TEXT,
    unit TEXT,
    item TEXT NOT NULL
);

CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    sort_order INTEGER NOT NULL,
    step TEXT NOT NULL
);