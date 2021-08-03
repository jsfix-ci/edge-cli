import path from 'path'
import test from 'ava'
import execa from 'execa'
import readPkg from 'read-pkg'

const cli = path.resolve('dist/cli.js')

test('Check version', async (t) => {
  const { stdout } = await execa(cli, ['-v'])
  const { version } = await readPkg(path.dirname(__dirname))
  t.is(stdout, version)
})
