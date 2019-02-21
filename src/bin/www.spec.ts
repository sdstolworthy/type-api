import * as path from 'path'
import Server from '../server'
import www from './www'

describe('www', () => {
  it('starts the server', async () => {
    expect(www).toBeInstanceOf(Server)
  })
})
