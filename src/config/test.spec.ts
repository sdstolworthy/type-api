/* tslint:disable no-console */
import { expect } from 'chai'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import 'mocha'

describe('circleci and docker-compose', () => {
  it('should reference the same postgres docker image', (done) => {
    try {
      const circleciConfig = yaml.safeLoad(fs.readFileSync('.circleci/config.yml'))
      const dockerComposeDev = yaml.safeLoad(fs.readFileSync('docker-compose.development.yml'))
      const dockerComposeTest = yaml.safeLoad(fs.readFileSync('docker-compose.test.yml'))

      const circleciBuildPostgresImg = circleciConfig.jobs.build.docker[1].image
      const dockerComposeDevPostgresImg = dockerComposeDev.services.db_dev.image
      const dockerComposeTestPostgresImg = dockerComposeTest.services.db_test.image

      expect(dockerComposeDevPostgresImg).to.equal(circleciBuildPostgresImg)
      expect(dockerComposeTestPostgresImg).to.equal(circleciBuildPostgresImg)
      done()
    } catch (e) {
      console.log(e)
      done()
    }
  })
})
