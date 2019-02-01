import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as validator from 'validator'
import * as walk from 'walk'
import Handlebars from '../../helpers/handlebars'

export default class CreateEntity extends Command {
  public static description = 'create a new GraphQL entity'

  public static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  public static args = [
    {
      name: 'entityName',
      required: true,
      parse: (input: string) => {
        // force camelCase
        return input[0].toLowerCase() + input.slice(1)
      },
    },
  ]

  public async run() {
    const {args, flags} = this.parse(CreateEntity)
    const entityPath = './src/api/data'
    const entityName = args.entityName
    const templateDir = './cli/src/templates/entity'

    if (!validator.isAlpha(args.entityName)) {
      this.error('Please use an entity name with only letters.')
    }

    if (args.entityName.slice(-1).toLowerCase() === 's' && !flags.force) {
      let msg = 'That entity name ends with an "s" which looks funky.\n'
      msg += 'If you really want to use that entity name, add the "-f" flag.'
      this.error(msg)
    }

    if (fs.existsSync(`${entityPath}/${args.entityName}`)) {
      this.error('That entity (or a directory named the same thing) already exists.')
    }

    this.log(`Creating entity: ${args.entityName}`)

    const walker = walk.walk(templateDir)

    walker.on('file', (root, fileStats, next) => {
      const source = fs.readFileSync(`${root}/${fileStats.name}`).toString()
      const template = Handlebars.compile(source)
      const filePath = `${entityPath}/${entityName}`
      const fileName = fileStats.name === 'index.ts' ? 'index.ts' : `${entityName}.${fileStats.name}`

      mkdirp.sync(filePath)
      fs.writeFileSync(`${filePath}/${fileName}`, template({ entityName }))

      this.log(`  > Created ${fileName}`)

      next()
    })
    walker.on('errors', (root, nodeStatsArray, next) => {
      next()
    })
    walker.on('end', () => {
      this.log('All done! Enjoy!')
    })
  }
}
