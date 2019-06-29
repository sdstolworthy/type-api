/* tslint:disable no-console */
import chalk from 'chalk'
import * as program from 'commander'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as path from 'path'
import * as validator from 'validator'
import * as walk from 'walk'
import Handlebars from './helpers/handlebars'

const templateDir: string = __dirname + '/templates'

const throwError = (message: string) => {
  console.error(`${chalk.bgRed.white.bold(' ERROR ')} ${message}`)
  process.exit(1)
}

const logInfo = (message: string) => {
  console.log(`${chalk.bgBlue.white.bold(' INFO ')} ${message}`)
}

const logSuccess = (message: string) => {
  console.log(`${chalk.bgGreen.white.bold(' SUCCESS ')} ${message}`)
}

program
  .command('create:entity <name>')
  .description('Create a new entity with the given name.')
  .option('-f, --force', 'Force the acceptance of the given entity name')
  .action((name: string, args: any) => {
    const entityName: string = name[0].toLowerCase() + name.slice(1) // make first letter lowercase
    const entityPath: string = __dirname + '/../../api/data'
    const entityTemplateDir: string = templateDir + '/entity'

    console.log(chalk.grey(`entityName: ${entityName}`))
    console.log(chalk.grey(`entityPath: ${entityPath}`))
    console.log(chalk.grey(`force: ${args.force}`))

    if (!validator.isAlpha(entityName)) {
      throwError('Please provide an entity name with only letters.')
    }

    if (entityName.slice(-1) === 's' && !args.force) {
      throwError(
        'That name ends with an "s" which looks funky. Use "-f" to use the name anyways.',
      )
    }

    if (fs.existsSync(`${entityPath}/${entityName}`)) {
      throwError(
        "That entity (or a directory named the same thing) already exists. Please don't make me kill it",
      )
    }

    const walker = walk.walk(entityTemplateDir)

    walker.on('file', (root, fileStats, next) => {
      const source: string = fs
        .readFileSync(`${root}/${fileStats.name}`)
        .toString()
      const template = Handlebars.compile(source)
      const filePath: string = `${entityPath}/${entityName}`

      const filesToExcludeFromPrepending: string[] = ['index', 'index.spec']

      const rawFileName: string = path.parse(fileStats.name).name
      const fileName =
        filesToExcludeFromPrepending.indexOf(rawFileName) !== -1
          ? `${rawFileName}.ts`
          : `${entityName}.${rawFileName}.ts`

      mkdirp.sync(filePath)
      fs.writeFileSync(`${filePath}/${fileName}`, template({ entityName }))

      logInfo(`Created ${fileName}`)

      next()
    })
    walker.on('errors', (root, nodeStatsArray, next) => {
      next()
    })
    walker.on('end', () => {
      logSuccess('All done! Enjoy!')
    })
  })

program
  .command('create:test <name>')
  .description('Create a new e2e test with the given name.')
  .action((name: string) => {
    const testName: string = name
    const lowercaseTestName: string = name[0].toLowerCase() + name.slice(1)
    const testPath: string = __dirname + '/../../../test'
    const e2eTestTemplate: string = templateDir + '/tests/spec.e2e.hbs'
    const templateFileName: string = path.parse(e2eTestTemplate).name
    const source: string = fs.readFileSync(e2eTestTemplate).toString()
    const template = Handlebars.compile(source)

    const targetFileName: string = `${lowercaseTestName}.${templateFileName}.ts`

    fs.writeFileSync(`${testPath}/${targetFileName}`, template({ testName }))

    logSuccess('Test created. Enjoy!')
  })

program.parse(process.argv)
