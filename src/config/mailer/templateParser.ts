import * as fs from 'fs'
import * as handlebars from 'handlebars'

export default (filename: string, link: string) => {
  const templateDir = 'src/config/mailer/templates'

  const source = fs.readFileSync(`${templateDir}/${filename}.hbs`).toString()
  const template = handlebars.compile(source)

  return template({ link })
}
