CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    folder_name TEXT NOT NULL
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    folder_id INTEGER REFERENCES folders(id) NOT NULL
);