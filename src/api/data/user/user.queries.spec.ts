/* tslint:disable no-unused-expression newline-per-chained-call */
import { expect } from 'chai'
import 'mocha'
import { queryResolvers, queryTypes } from './user.queries'

describe('user queries', () => {
  it('should export queryTypes', (done: () => void) => {
    expect(queryTypes).to.be.a('function')
    expect(queryTypes()).to.be.an('array')
    done()
  })

  it('should export queryResolvers', (done: () => void) => {
    expect(queryResolvers).to.be.an('object')
    expect(queryResolvers).to.haveOwnProperty('Query')
    done()
  })
})
