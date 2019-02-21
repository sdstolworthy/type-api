import handlebars from './handlebars'

describe('handlebars cli helper', () => {
  it('should have a helper called "capitalize" that capitalizes the first letter of the string', () => {
    const source: string = 'This is a {{ capitalize variable }}.'
    const expected: string = 'This is a Test.'
    const template = handlebars.compile(source)
    expect(template({ variable: 'test' })).toBe(expected)
  })

  it('should have a helper called "uppercase" that makes all letters of the string uppercase', () => {
    const source: string = 'This is a {{ uppercase variable }}.'
    const expected: string = 'This is a TEST.'
    const template = handlebars.compile(source)
    expect(template({ variable: 'test' })).toBe(expected)
  })
})
