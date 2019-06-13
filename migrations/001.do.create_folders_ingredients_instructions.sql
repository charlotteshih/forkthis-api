CREATE TABLE folders (
    id SERIAL PRIMARY KEY,
    folder_name TEXT NOT NULL
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    item TEXT NOT NULL
);

CREATE TABLE instructions (
    id SERIAL PRIMARY KEY,
    step TEXT NOT NULL
);