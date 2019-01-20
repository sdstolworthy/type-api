# Altamir API

Welcome to your new API!

## Routes

- `/auth/*` - standard express routes handling authentication on the `User` entity.
- `/graphql` - graphql endpoint

## Usage

### Development

```cli
yarn dev
```

GraphQL playground at `GET /playground`.

#### Adding a new entity

Run the following from the root of the api:

```cli
yarn entity <entityName>
```

This will add a new directory under [/src/api/data](./src/api/data/) containing a new, working entity. GraphQL will automagically pick it up.
