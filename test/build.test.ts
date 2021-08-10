import { build } from '../src/build'

describe('Build function', () => {
  test("Should return null if there's no input", async () => {
    // @ts-ignore
    let a = await build({})
    expect(a).toBe(null)
  })
})
