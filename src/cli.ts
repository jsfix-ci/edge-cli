import { Command } from 'commander'
import { red } from 'chalk'
import { build } from '.'
import { version } from '../package.json'
import { BuildOptions } from './types'

const program = new Command('edge.js')

program
  .option('-r, --root <root>','Root directory to mount edge.js from').preset('src')
  .option('-o, --output <output>','Output directory').preset('dist')
  .option('-no-a, --no-all-in-output', "Don't save the nesting structure for output")
  .option('-w, --watch', 'Watch files')
  .version(version, '-v, --version')
  .description('CLI tool for compiling html with edge.js')
  .addHelpText(
    'after',
    `
      Examples:
      $ edge index.edge -r src -o dist -w
      $ edge *.edge pages/*.edge -r src -o dist --no-all-in-output -w`
  )
  .parse(process.argv)

const options: BuildOptions = {
  // @ts-ignore
  input: program.args,
  ...program.opts(),
}

if (!options.input.length) {
  console.log(red('Input is required'))
  process.exit(1)
}

build(options)
