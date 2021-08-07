import path from 'path'
import { cosmiconfigSync } from 'cosmiconfig'
import mergeOptions from 'merge-options'
import normalizePath from 'normalize-path'

// @ts-ignore
export default ({ input, flags = {} }) => {
  const explorer = cosmiconfigSync('edge')
  // @ts-ignore
  let { config, output, root, allInOutput = false } = flags

  if (config) {
    // @ts-ignore
    ;({ config } = explorer.load(config))
  } else {
    ;({ config } = explorer.search(config) ?? {})
  }

  if (config?.root) {
    root = config.root
  }

  if (config?.allInOutput) {
    allInOutput = config.allInOutput
  }

  input = []
    .concat(input && input.length > 0 ? input : config?.input)
    .filter(Boolean)
    .map((file) => {
      return `${normalizePath(path.join(path.resolve(root), file))}`
    })

  if (input.length === 0) {
    throw new TypeError('input files not found')
  }

  output = output ?? config?.output
  if (output) {
    output = normalizePath(output)
  }

  return mergeOptions(config ?? {}, {
    input,
    output,
    root,
    allInOutput,
  })
}
