module.exports = {
  // type: 'sqljs',
  // location: './db.sql',
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  autoSave: true,
  synchronize: true,
  logging: 'all',
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
