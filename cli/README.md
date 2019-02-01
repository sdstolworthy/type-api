cli
===



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli
$ cli COMMAND
running command...
$ cli (-v|--version|version)
cli/0.0.0 linux-x64 node-v11.8.0
$ cli --help [COMMAND]
USAGE
  $ cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli create:entity ENTITYNAME`](#cli-createentity-entityname)
* [`cli hello [FILE]`](#cli-hello-file)
* [`cli help [COMMAND]`](#cli-help-command)

## `cli create:entity ENTITYNAME`

create a new GraphQL entity

```
USAGE
  $ cli create:entity ENTITYNAME

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

## `cli hello [FILE]`

describe the command here

```
USAGE
  $ cli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ cli hello
  hello world from ./src/hello.ts!
```

## `cli help [COMMAND]`

display help for cli

```
USAGE
  $ cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_
<!-- commandsstop -->
