const connectionOptions = require('./src/config/db').connectionOptions

/**
 * ormconfig.js
 * Keep this file so we can easily interact with the typeorm cli.
 */
module.exports = {
  ...connectionOptions,
  cli:  {
    migrationsDir: './src/api/migrations',
  },
}
