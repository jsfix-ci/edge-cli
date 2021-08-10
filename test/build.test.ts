import { build, resolveInput } from '../src/build'
import { resolve, join } from 'path'
import normalizePath from 'normalize-path'

describe('build function', () => {
  it("Should return null if there's no input", async () => {
    // @ts-ignore
    let a = await build({})
    expect(a).toBe(null)
  })
})

describe('resloveInput function', () => {
  it("Should ignore patterns that start with '!'", async () => {
    const root = resolve('test/fixtures/resolve-input')
    const input = ['**/*.edge', '!**/layouts/**', '!**/ignore/**']
    let paths = await resolveInput(root, input)
    const expected = [normalizePath(join(root, 'index.edge'))]
    expect(paths).toEqual(expected)
  })
})
