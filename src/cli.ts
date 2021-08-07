#!/usr/bin/env node
import { writeFile } from 'fs'
import { resolve, dirname } from 'path'
import { Command } from 'commander'
import { version } from '../package.json'
import fg from 'fast-glob'
import chokidar from 'chokidar'
import edge from 'edge.js'
import makeDir from 'make-dir'
import cfgResolve from './cfg-resolve'
import outResolve from './out-resolve'

const program = new Command('edge.js')

program
  .option('-r, --root <root>', 'Root directory to mount edge.js from', 'src')
  .option('-o, --output <output>', 'Output directory', 'dist')
  .option('-c, --config <config>', 'Config file name')
  .option('-a, --all-in-output', 'all-in-output')
  .option('-w, --watch', 'Watch files')
  .version(version, '-v, --version')
  .description('CLI tool for compiling html with edge.js')
  .addHelpText(
    'after',
    `
Examples:
  $ edge -c config.js
  $ edge index.edge -r src -o dist -a -w
  $ edge *.edge pages/*.edge -r src -o dist -a -w`
  )
  .parse(process.argv)

const options = {
  input: program.args,
  flags: program.opts(),
}

const config = cfgResolve(options)
const shouldWatch = options.flags.watch

const buildHtml = async (file: string) => {
  const output = await outResolve(file, config)
  // @ts-ignore
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
  chokidar.watch(resolve(config.root)).on('all', () => {
    run()
  })
} else {
  run()
}
