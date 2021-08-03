import path from 'path'
import execa from 'execa'
import readPkg from 'read-pkg'

const cli = path.resolve('dist/cli.js')

test('Check version', async () => {
  const { stdout } = await execa(cli, ['-v'])
  const { version } = await readPkg(path.dirname(__dirname))
  expect(stdout).toBe(version)
})
