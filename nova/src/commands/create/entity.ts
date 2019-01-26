import {Command, flags} from '@oclif/command'

export default class CreateEntity extends Command {
  static description = 'Create a new GraphQL entity automagically'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [
    {
      name: 'name',
      required: true,
      description: 'The singular name of the entity',
    },
  ]

  async run() {
    const {args, flags} = this.parse(CreateEntity)

    this.log(`Creating the ${args.name} entity.`)
    if (args.name && flags.force) {
      this.log(`You're forcing me to create the ${args.name} entity. Fine.`)
    }
  }
}
