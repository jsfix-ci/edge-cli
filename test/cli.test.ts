import path from 'path'
import execa from 'execa'
// import readPkg from 'read-pkg'

const cli = path.resolve('src/cli.ts')

test('Check version', async () => {
  const { stdout } = await execa('node', ['-r', 'ts-node/register', cli, '-v'])
  // const { version } = await readPkg(path.dirname(__dirname))
  expect(stdout).toBe('0.0.2')
})
