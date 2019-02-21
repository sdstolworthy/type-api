# CLI

The CLI for this API is located in [src/config/cli](../src/config/cli/).

Call all commands using yarn:

```bash
yarn cli <command>
```

## Commands

### create:entity

```bash
yarn cli create:entity <name>
```

Creates a new entity in `/src/api/data/`. This entity will be added to GraphQL but _will not be added to the database until you run [TypeORM's `migration:generate` command](http://typeorm.io/#/using-cli/generate-a-migration-from-exist-table-schema).

### create:test

```bash
yarn cli create:test <name>
```

Creates a new end-to-end test in `/test/`.
