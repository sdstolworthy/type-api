# Altamir API

Welcome to your new API!

To get started:

1. Clone this repository.

2. Remove `.git`.
```cli
rm -rf .git
```

3. Initialize a new git repository.
```cli
git init
git remote add origin <your-new-git-repo>
```

4. Push to your new repo.
```cli
git add .
git commit -m "First commit"
git push --set-upstream origin master
```

## About this API

This API generator uses [yarn](https://www.npmjs.com/package/yarn) along with [package.json](./package.json) to manage much of the scaffolding and service of the API. For example, running `yarn create:entity book` will create a GraphQL schema and a database entity for the `book` object.

This API has a number of relevant, life-enhancing features:

- Authentication
  - Username/password login
  - Password reset via email
  - JWT auth in the GraphQL routes
  - JWT invalidation after password resets
- Authorization
  - Role-based permissions
- Docker
  - [Dockerfile](./Dockerfile)
  - Multiple docker-compose files for ease of development
- [Cron jobs](./src/config/cron.ts)
- Logging
  - Uses a [logger](./src/config/logger/index.ts) instead of `console.log`; no more writing and deleting logs, just keep them in the code and adjust them according to the log level
- Environment variables
  - Set in development using the `.env` file
  - Interface with the application using a single [settings](./src/config/settings.ts) file
- [Global settings](./src/config/settings.ts)
- Tests!
- Documentation! (You're looking at it.)

## Routes

- `/auth/*` - standard express routes handling authentication on the `User` entity.
- `/graphql` - graphql endpoint

## Getting Started

After cloning the repository, install all dependencies:

```bash
yarn

# or

npm install
```

### Development

Running the dev server is simply:

```cli
yarn dev
```

There is also a full [docker-compose](https://docs.docker.com/compose/) development file ([docker-compose.development.yml](./docker-compose.development.yml)). Running this will spin up a full development environment. **All code will be tested against this dev environment.**

```cli
docker-compose -f docker-compose.development.yml up
```

#### Adding a new entity

Run the following from the root of the api:

```cli
yarn create:entity <entityName>
```

This will add a new directory under [/src/api/data](./src/api/data/) containing a new, working entity. GraphQL will automagically pick it up and register it with the schema.

## Authentication & Authorization

### Authentication

The API uses username & password along with JWT authentication.

#### Registering a new user

`POST /auth/register`

*In the `POST` body:*

- `email` - must be unique
- `password`

Returns a body containing `{ success: true }` if user was successfully created.

#### Logging in

`POST /auth/login`

*In the `POST` body:*

- `email`
- `password`

Returns a token in the body. This token is then used to remain authenticated through all requests to the API. Include the token as the [Authorization Bearer token header](https://tools.ietf.org/html/rfc6750) in your requests. (tldr: set the header `Authorization: "Bearer <token>"` using the token you received from logging in)

**The login token has an expiration period.** The token payload contains an `exp` value with the timestamp when the token will expire (standard JWT). Before the token expires it must be refreshed.

#### Refreshing a token

`POST /auth/refresh`

Using an _unexpired_ and _valid_ token, send an empty `POST` request to `/auth/refresh`. The response will contain a new token.
