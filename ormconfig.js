module.exports = {
  type: 'sqljs',
  location: './db.sql',
  autoSave: true,
  synchronize: true,
  logging: true,
  entities: [
    'src/**/*.entity.ts',
  ],
  migrations: [
    'src/migraion/**/*.ts',
  ],
  subscribers: [
    'src/subscriber/**/*.ts',
  ],
}
