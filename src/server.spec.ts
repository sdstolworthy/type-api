/* tslint:disable no-unused-expression */
import Server from './server'

describe('App Server', () => {
  it('should export a server', () => {
    expect(Server).toBeDefined
  })

  it('should have the function "up()"', () => {
    expect(Server.prototype).toHaveProperty('up')
  })

  it('should have the function "down()"', () => {
    expect(Server.prototype).toHaveProperty('down')
  })
})
