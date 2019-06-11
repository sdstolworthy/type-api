/* tslint:disable no-console newline-per-chained-call */
import * as fs from 'fs'
import * as walk from 'walk'

describe('config/settings', () => {
  /**
   * Check all files in /src for the string "process.env." to ensure that we
   * abstract the environment variables and avoid having to refactor dozens of
   * files after one change.
   */
  it('should be the only file that contains "process.env.*"', (done) => {
    const violatingString = 'process.env.'
    const violatingFiles = []
    const ignoredFiles = ['settings.ts', 'settings.spec.ts']
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
      expect(violatingFiles).toHaveLength(0)
      done()
    })
  })
})
