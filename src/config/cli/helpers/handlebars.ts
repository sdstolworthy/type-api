import * as Handlebars from 'handlebars'
import * as walk from 'walk'

Handlebars.registerHelper('capitalize', (input: string) => {
  return input[0].toUpperCase() + input.slice(1)
})

Handlebars.registerHelper('uppercase', (input: string) => {
  return input.toUpperCase()
})

export default Handlebars
