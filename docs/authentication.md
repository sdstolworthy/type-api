# Authentication

This API uses 2 basic forms of authentication: local (username & password) and JWT.

## Registering a new user

`POST /auth/register`

*In the `POST` body:*

- `email` - must be unique
- `password`

Returns a body containing `{ success: true }` if user was successfully created.

## Logging in

`POST /auth/login`

*In the `POST` body:*

- `email`
- `password`

Returns a token in the body. This token is then used to remain authenticated through all requests to the API. Include the token as the [Authorization Bearer token header](https://tools.ietf.org/html/rfc6750) in your requests. (tldr: set the header `Authorization: "Bearer <token>"` using the token you received from logging in)

**The login token has an expiration period.** The token payload contains an `exp` value with the timestamp when the token will expire (standard JWT). Before the token expires it must be refreshed.

## Refreshing a token

`POST /auth/refresh`

Using an _unexpired_ and _valid_ token, send an empty `POST` request to `/auth/refresh`. The response will contain a new token.
