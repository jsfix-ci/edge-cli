#!/usr/bin/env node
import { writeFile } from 'fs'
import { resolve, dirname } from 'path'
import meow from 'meow'
import fg from 'fast-glob'
import chokidar from 'chokidar'
import edge from 'edge.js'
import makeDir from 'make-dir'
import cfgResolve from './cfg-resolve'
import outResolve from './out-resolve'

const cli = meow(
  `
    Usage: edge <input>

    Options:
        --config -c      Path to config file
        --root -r        Root dir default 'src'
        --output -o      Output dir default 'dist'
        --allInOutput -a Save the nesting structure for output
        --watch -w       Watch files
        --version -v     CLI Version
        --help -h        CLI Help

    Examples:
        $ edge index.edge
        $ edge -c .edgerc
        $ edge *.edge pages/*.edge -r src -o dist -a 
        $ edge -h
        $ edge -v
`,
  {
    flags: {
      config: {
        type: 'string',
        alias: 'c',
      },
      root: {
        type: 'string',
        alias: 'r',
        default: './src',
      },
      output: {
        type: 'string',
        alias: 'o',
        default: './dist',
      },
      allInOutput: {
        type: 'boolean',
        default: false,
        alias: 'a',
      },
      watch: {
        type: 'boolean',
        default: false,
        alias: 'w',
      },
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

const config = cfgResolve(cli)
const shouldWatch = cli.flags.watch

const buildHtml = async (file) => {
  const output = await outResolve(file, config)
  let fileName = output.replace('.edge', '.html')
  let dir = dirname(fileName)
  makeDir(dir).then(() => {
    edge.mount(resolve(config.root))
    edge.render(file, {}).then((html) => {
      writeFile(fileName, html, 'utf8', (error) => {
        if (error) {
          console.log(error)
        }
        console.log(`file ${fileName} created successfully`)
      })
    })
  })
}

const run = () => {
  fg.stream(config.input).on('data', buildHtml).once('error', console.warn)
}

if (shouldWatch) {
  chokidar.watch(resolve(config.root)).on('all', (event, path) => {
    run()
  })
} else {
  run()
}
