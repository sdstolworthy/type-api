# Logging

This API uses [Winston](https://www.npmjs.com/package/winston) to log events. Logging is controlled via log level (one of `error`, `warn`, `info`, `verbose`, `debug`, `silly`). By default, the application uses the `warn` log level. This can be changed by setting the `LOG_LEVEL` environment variable.

## Event tracking services

To add logs with supported event tracking services, set the corresponding environment variable:

- [Sentry.io](https://sentry.io/) - `SENTRY_DSN`

### Adding a new logging service

To add a new logging service, add a [custom transport](https://www.npmjs.com/package/winston#adding-custom-transports) to Winston in [src/config/logger](../src/config/logger/) and add it as a logger in [src/config/logger/index.ts](../src/config/logger/index.ts).
