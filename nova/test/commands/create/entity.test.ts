import {expect, test} from '@oclif/test'

describe('create:entity', () => {
  test
    .stdout()
    .command(['create:entity'])
    .it('runs hello', ctx => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['create:entity', '--name', 'jeff'])
    .it('runs hello --name jeff', ctx => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
