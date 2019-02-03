/* tslint:disable no-unused-expression */
import { expect } from 'chai'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import 'mocha'
import * as readline from 'readline'
import * as util from 'util'
import * as walk from 'walk'
import { logger } from './config/logger'

const readFile = util.promisify(fs.readFile)

describe('circleci and docker-compose', () => {
  it('should reference the same postgres docker image', (done) => {
    try {
      const circleciConfig: any = yaml.safeLoad(fs.readFileSync('.circleci/config.yml'))
      const dockerComposeDev: any = yaml.safeLoad(fs.readFileSync('docker-compose.development.yml'))
      const dockerComposeTest: any = yaml.safeLoad(fs.readFileSync('docker-compose.test.yml'))

      const circleciBuildPostgresImg: string = circleciConfig.jobs.build.docker[1].image
      const dockerComposeDevPostgresImg: string = dockerComposeDev.services.db_dev.image
      const dockerComposeTestPostgresImg: string = dockerComposeTest.services.db_test.image

      expect(dockerComposeDevPostgresImg).to.equal(circleciBuildPostgresImg)
      expect(dockerComposeTestPostgresImg).to.equal(circleciBuildPostgresImg)
    } catch (e) {
      logger.error(e)
    }
    done()
  })

  it('should reference the same node docker image', (done) => {
    const circleciConfig = yaml.safeLoad(fs.readFileSync('.circleci/config.yml'))
    const circleciBuildNodeImage = circleciConfig.jobs.build.docker[0].image

    const lineReader = readline.createInterface({
      input: fs.createReadStream('Dockerfile'),
    })

    lineReader.on('line', (line) => {
      const parsed = line.split(' ')

      if (parsed[0] === 'FROM') {
        // the docker image
        expect(parsed[1]).to.equal(circleciBuildNodeImage)
        done()
      }
    })
  })
})

describe('all app files', () => {
  it('should not call "console.*"', (done) => {
    const violatingString = 'console.'
    const violatingFiles = []
    const ignoredFiles = [
      'global.spec.ts', // this file
    ]
    const ignoredDirectories = ['node_modules']
    const walker = walk.walk('./src', {
      filters: ignoredDirectories,
    })

    walker.on('names', (root, nodeNamesArray) => {
      nodeNamesArray.sort((a, b) => {
        if (a > b) { return 1 }
        if (a < b) { return -1 }
        return 0
      })
    })

    walker.on('directories', (root, dirStatsArray, next) => {
      // dirStatsArray is an array of `stat` objects with the additional attributes
      // * type
      // * error
      // * name

      next()
    })

    walker.on('file', (root, fileStats, next) => {
      fs.readFile(`${root}/${fileStats.name}`, (err, contents) => {
        if (err) { next() } // who cares about errors? not me.

        if (ignoredFiles.indexOf(fileStats.name) > -1) {
          // skip ignoredFiles
          return next()
        }

        if (contents.indexOf(violatingString) >= 0) {
          // add the violating file name to violatingFiles
          violatingFiles.push(`${root}/${fileStats.name}`)
          }
        next()
      })
    })

    walker.on('errors', (root, nodeStatsArray, next) => {
      next()
    })

    walker.on('end', () => {
      expect(violatingFiles).to.have.lengthOf(0)
      done()
    })
  })
})

describe('package.json', () => {
  /**
   * @types/validator is frequently out of date because of the number of
   * dependencies in the validator package. Do not add this to dependencies.
   */
  it('should not contain "@types/validator"', (done) => {
    const contents: string = fs.readFileSync('package.json').toString()
    const containsString: boolean = contents.indexOf('@types/validator') >= 0 ? true : false
    expect(containsString).to.be.false
    done()
  })
})
