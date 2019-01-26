# Altamir API

Welcome to your new API!

## Routes

- `/auth/*` - standard express routes handling authentication on the `User` entity.
- `/graphql` - graphql endpoint

## Getting Started

### Development

```cli
yarn dev
```

#### Adding a new entity

Run the following from the root of the api:

```cli
yarn create:entity <entityName>
```

This will add a new directory under [/src/api/data](./src/api/data/) containing a new, working entity. GraphQL will automagically pick it up.

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
