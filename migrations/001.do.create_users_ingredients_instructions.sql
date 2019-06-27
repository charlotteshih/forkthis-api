CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    item TEXT NOT NULL
);

CREATE TABLE instructions (
    id SERIAL PRIMARY KEY,
    step TEXT NOT NULL
);

CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    folder_name TEXT NOT NULL
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    folder_id INTEGER REFERENCES folders(id) NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);