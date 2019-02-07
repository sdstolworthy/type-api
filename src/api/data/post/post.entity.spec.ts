/* tslint:disable no-unused-expression newline-per-chained-call */
import { expect } from 'chai'
import 'mocha'
import { Connection, createConnection } from 'typeorm'
import settings from '../../../config/settings'
import { Post } from './post.entity'

describe('post entity', () => {
  let connection: Connection
  const testEntity = {
    title: 'Test title for Post',
    body: 'Test body for Post',
  }

  beforeEach(async () => {
    connection = await createConnection({
      type: 'postgres',
      url: settings.dbTestUrl,
      entities: [
        'src/**/*.entity.ts',
      ],
      logging: false,
      dropSchema: true, // isolate each test case
      synchronize: true,
    })
  })

  afterEach(async () => {
    await connection.close()
  })

  it('should have an id field of type number', (done) => {
    Post.create(testEntity).save().then((post) => {
      expect(post).to.haveOwnProperty('id')
      expect(post.id).to.be.a('number')
      done()
    })
  })

  it('should have a createdAt field of type date', (done) => {
    Post.create(testEntity).save().then((post) => {
      expect(post).to.haveOwnProperty('createdAt')
      expect(post.createdAt).to.be.a('Date')
      done()
    })
  })

  it('should have an updatedAt field of type date', (done) => {
    Post.create(testEntity).save().then((post) => {
      expect(post).to.haveOwnProperty('updatedAt')
      expect(post.updatedAt).to.be.a('Date')
      done()
    })
  })
})
