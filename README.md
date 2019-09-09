# Fork This! API

API for Fork This!

[Fork This! Front-End Repository](https://github.com/charlotteshih/forkthis-client)

## Tech Stack

- [Node](https://github.com/nodejs/node)
- [Express](https://github.com/expressjs/express)
- [PostgreSQL](https://www.postgresql.org/)
- [Knex.js](https://knexjs.org/)

## API Tree

```
/api
├── /folders
│   └── GET
│       ├── /
│       └── /:folder_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /:folder_id
│   └── DELETE
│       └── /:folder_id
|
├── /ingredients
│   └── GET
│       ├── /
│       └── /:rcp_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /item/:ing_id
│   └── DELETE
│       └── /item/:ing_id
|
├── /recipes
│   └── GET
│       ├── /
│       └── /:rcp_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /:rcp_id
│   └── DELETE
│       └── /:rcp_id
|
├── /restaurants
│   └── GET
│       ├── /
│       ├── /:restaurant_id
│       └── /:restaurant_id/orders
│   └── POST
│       └── /
│   └── PATCH
│       └── /:restaurant_id
│   └── DELETE
│       └── /:restaurant_id
|
├── /steps
│   └── GET
│       ├── /
│       └── /:rcp_id
│   └── POST
│       └── /
│   └── PATCH
│       └── /step/:step_id
│   └── DELETE
│       └── /step/:step_id
```