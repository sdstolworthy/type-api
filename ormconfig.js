// This file must interact with process.env vars to avoid errors when compiling
const srcOrDist = process.env.NODE_ENV === 'production' ? 'dist' : 'src'

module.exports = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
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
