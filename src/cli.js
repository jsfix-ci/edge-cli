#!/usr/bin/env node
import meow from 'meow'

const cli = meow(
  `
    Usage: edge <input>

    Options:
        --help -h        CLI Help
        --version -v     CLI Version

    Examples:
        $ edge index
        $ edge -h
        $ edge -v
`,
  {
    flags: {
      version: {
        type: 'boolean',
        alias: 'v',
      },
      help: {
        type: 'boolean',
        alias: 'h',
      },
    },
  }
)
