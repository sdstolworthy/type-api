/* tslint:disable no-unused-expression newline-per-chained-call */
import * as fs from 'fs'
import * as util from 'util'
import * as walk from 'walk'

describe('all app files', () => {
  it('should not call "console.*"', () => {
    const violatingString = 'console.'
    const violatingFiles = []
    const ignoredFiles = [
      './src/global.spec.ts', // this file
      './src/config/cli/index.ts',
    ]
    const ignoredDirectories = ['node_modules']
    const walker = walk.walk('./src', {
      filters: ignoredDirectories,
    })

    walker.on('names', (root, nodeNamesArray) => {
      nodeNamesArray.sort((a, b) => {
        if (a > b) {
          return 1
        }
        if (a < b) {
          return -1
        }
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
        if (err) {
          next()
        } // who cares about errors? not me.

        if (ignoredFiles.indexOf(`${root}/${fileStats.name}`) > -1) {
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
      expect(violatingFiles).toHaveLength(0)
    })
  })
})

describe('package.json', () => {
  /**
   * @types/validator is frequently out of date because of the number of
   * dependencies in the validator package. Do not add this to dependencies.
   */
  it('should not contain "@types/validator"', () => {
    const contents: string = fs.readFileSync('package.json').toString()
    const containsString: boolean =
      contents.indexOf('@types/validator') >= 0 ? true : false
    expect(containsString).toBeFalsy
  })
})
