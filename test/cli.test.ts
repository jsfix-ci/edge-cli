import path from 'path'
import execa from 'execa'
import { version } from '../package.json'

const cli = path.resolve('src/cli.ts')

test('Check version', async () => {
  const { stdout } = await execa('node', ['-r', 'ts-node/register', cli, '-v'])
  expect(stdout).toBe(version)
})

test('Show help', async () => {
  const { stdout } = await execa('node', ['-r', 'ts-node/register', cli, '-h'])

  expect(stdout).toMatchInlineSnapshot(`
"Usage: edge.js [options]

CLI tool for compiling html with edge.js

Options:
  -r, --root <root>          Root directory to mount edge.js from (default:
                             \\"src\\")
  -o, --output <output>      Output directory (default: \\"dist\\")
  -no-a, --no-all-in-output  all-in-output
  -w, --watch                Watch files
  -v, --version              output the version number
  -h, --help                 display help for command

      Examples:
      $ edge index.edge -r src -o dist -a -w
      $ edge *.edge pages/*.edge -r src -o dist -a -w"
`)
})

test('Exit with no input', async () => {
  const { stdout } = await execa('node', ['-r', 'ts-node/register', cli], { reject: false })
  expect(stdout).toMatch(/Input is required/)
})
