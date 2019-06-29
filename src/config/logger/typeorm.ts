/* tslint:disable no-string-literal */
import { Logger, QueryRunner } from 'typeorm'
import { logger } from './index'

// https://github.com/typeorm/typeorm/issues/2324#issue-331321597
export class TypeORMLogger implements Logger {
  public log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner,
  ): any {
    let l
    switch (level) {
      case 'log':
        l = logger.debug
        break
      case 'info':
        l = logger.info
        break
      case 'warn':
        l = logger.warn
        break
      default:
        l = logger.debug
        break
    }
    l(message)
  }

  public logQuery(
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    logger.debug('Executing query:')
    logger.debug({ query, parameters })
  }

  public logMigration(message: string, queryRunner?: QueryRunner): any {
    logger.debug(`Executing migration: ${message}`)
  }

  public logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    logger.error('Query error:')
    logger.error({ query, parameters })
  }

  public logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ): any {
    logger.warn(`Slow query [${time.toString()}]:`)
    logger.warn({ query, parameters, time })
  }

  public logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
    logger.debug(`Schema build: ${message}`)
  }
}
