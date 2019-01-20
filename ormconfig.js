const settings = require('./src/config/settings').default

module.exports = {
  // type: 'sqljs',
  // location: './db.sql',
  type: 'postgres',
  url: settings.dbPostgresUrl,
  autoSave: true,
  synchronize: true,
  logging: 'all',
  entityPrefix: settings.dbTablePrefix,
  entities: [
    'src/**/*.entity.ts',
  ],
  migrations: [
    'src/migrations/**/*.ts',
  ],
  subscribers: [
    'src/subscribers/**/*.ts',
  ],
  cli: {
    migrationsDir: 'src/migrations',
  },
}
