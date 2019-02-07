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

## Resetting a forgotten password

Resetting a forgotten password is a multi-step process.

### 1. Request a password reset token

`POST /auth/forgot`

*In the `POST` body:*

- `email`

Assuming that the user exists, an email will be sent to the email with a token to initiate a password reset. In the database, `user.resetPasswordToken` is set to a fairly random string, and `user.resetPasswordExpires` is set to a timestamp one hour from the current time. The mailer used is in [src/config/mailer](../src/config/mailer/). This mailer uses templates to form nice-looking emails for the user.

### 2. Use the token to reset the user's password

`POST /auth/reset/<token>`

*In the `POST` body:*

- `password`

Assuming that the token (1) is attached to a valid user and (2) is not expired (via `user.resetPasswordExpires`), `user.password` will be reset to the password sent in the POST body. Upon success, an email is sent to the user to inform them that their password was reset.
