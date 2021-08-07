// Code in this file copied from posthtml-cli
// https://github.com/posthtml/posthtml-cli/blob/master/src/out-resolve.js
// We will write our own later. Just make it work right now.

import path from 'path'

// @ts-ignore
export default (input, { output, root, allInOutput } = {}) =>
  new Promise((resolve) => {
    if (output && path.extname(output)) {
      return resolve(output)
    }

    if (output) {
      let inputPath = path.basename(input)

      if (allInOutput) {
        inputPath = path.relative(root, input)
      }

      return resolve(path.join(output, inputPath))
    }

    return resolve(input)
  })
