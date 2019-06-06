/**
 * ormconfig.js
 * Keep this file so we can easily interact with the typeorm cli.
 */
const connectionOptions = require('./src/config/db').connectionOptions

module.exports = {
  ...connectionOptions,
  cli:  {
    migrationsDir: './src/api/migrations',
  },
}
