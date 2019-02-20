/* tslint:disable no-unused-expression */
import { Connection } from 'typeorm'
import Database from './index'
import { connectionOptions } from './index'

describe('database config', () => {
  const database: Database = new Database()

  it('should export connectionOptions', () => {
    expect(connectionOptions).toBeDefined
  })

  it('should use the postgres database', () => {
    expect(connectionOptions.type).toBe('postgres')
  })

  it('should run migrations', () => {
    expect(connectionOptions.migrationsRun).toBeTruthy
  })

  it('should not automatically synchronize the database schema', () => {
    expect(connectionOptions.synchronize).toBeFalsy
  })

  it('should have an init() function', () => {
    expect(typeof database.init).toBe('function')
  })

  it('should have a close() function', () => {
    expect(typeof database.close).toBe('function')
  })
})
