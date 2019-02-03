/**
 * ormconfig.js
 * Keep this file so we can easily interact with the typeorm cli.
 */

// This file must interact with process.env vars to avoid errors when compiling
const env = process.env.NODE_ENV || 'development'
const srcOrDist = env === 'production' ? 'dist' : 'src'

module.exports = {
  // use postgres for timestamp columns
  type: 'postgres',
  url: env === 'test' ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL,

  // only drop schema in test environment; this keeps tests separate
  dropSchema: env === 'test' ? true : false,
  autoSave: true,
  synchronize: true,
  entityPrefix: 'app_',
  entities: [
    `${srcOrDist}/**/*.entity.?s`,
  ],
  migrations: [
    `${srcOrDist}/migrations/**/*.?s`,
  ],
  subscribers: [
    `${srcOrDist}/subscribers/**/*.?s`,
  ],
  cli: {
    migrationsDir: `${srcOrDist}/migrations`,
  },
}
