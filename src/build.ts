import { resolve, join, basename, relative, extname, dirname } from 'path'
import { existsSync, writeFileSync } from 'fs'
import edge from 'edge.js'
import fg from 'fast-glob'
import normalizePath from 'normalize-path'
import makeDir from 'make-dir'
import chokidar from 'chokidar'
import { green, cyan, bold, yellow, cyanBright } from 'chalk'
import { BuildOptions } from './types'

const errors: string[] = []

export const resolveInput = (root: string, input: any): Promise<string[]> => {
  return new Promise(async (res) => {
    if (input == undefined || null) {
      errors.push('Input is required')
    }

    let paths = []
    let ignoredPaths: string[] = []
    let inputArray = (input = [].concat(input).filter(Boolean))
    inputArray.forEach((pattern) => {
      const ignoreInput = String(pattern).startsWith('!')
      if (ignoreInput) {
        ignoredPaths.push(`${normalizePath(join(resolve(root, String(pattern).slice(1))))}`)
      }
    })

    for (let pattern of inputArray) {
      let files = await fg([normalizePath(join(resolve(root), pattern))], {
        ignore: ['**/node_modules/**', ...ignoredPaths],
      })

      paths.push(...files)
    }
    if (!paths.length) {
      errors.push(`Patern ${yellow(inputArray)} dosn't exist in ${yellow(basename(root))}`)
    }

    return res(paths)
  })
}

export const resolveOutput = ({
  input,
  root,
  output,
  allInOutput = true,
}: {
  input: string
  root: string
  output: string
  allInOutput: boolean
}): Promise<string> => {
  return new Promise((res) => {
    let inputPath = basename(input)
    if (allInOutput) {
      inputPath = relative(root, input)
    }
    return res(join(output, inputPath))
  })
}

export const resolveOptions = async (options: BuildOptions): Promise<BuildOptions> => {
  return new Promise(async (res) => {
    let { root = 'src', input, output = 'dist', watch = false, allInOutput = true } = options
    root = resolve(root)

    if (!existsSync(root)) {
      errors.push(`root ${yellow(basename(root))} dosn't exist`)
    }

    output = resolve(output)

    input = await resolveInput(root, input)

    return res({
      root,
      input,
      output,
      watch,
      allInOutput,
    })
  })
}

export const compile = async (root: string, file: string) => {
  edge.mount(root)

  let html = await edge.render(file)
  return html
}

export const write = async (html: string, path: string): Promise<void> => {
  await makeDir(dirname(path))
  writeFileSync(`${path}.html`, html, 'utf-8')
}

export const build = async (options: BuildOptions): Promise<void | null> => {
  const { root, input, output, watch, allInOutput } = await resolveOptions(options)

  if (errors.length) {
    console.log(cyanBright('[Edge]:'))
    errors.forEach((error, i) => {
      console.log(`  ${i + 1}- ${error}`)
    })
    return null
  }

  if (watch) {
    console.log(`${cyan('[edge]')} Watching ${yellow(basename(root))}`)
    chokidar
      .watch(`${normalizePath(join(root, '**/*.edge'))}`, {
        ignoreInitial: false,
        awaitWriteFinish: {
          stabilityThreshold: 50,
          pollInterval: 10,
        },
      })
      .on('all', async (event, path) => {
        console.log(`[${cyan(event)}]: ${path}`)
        // TODO: Refactor
        for (const path of input) {
          let html = await compile(root, relative(root, path))

          let filePath = await resolveOutput({
            input: path.replace(extname(path), ''),
            root,
            output,
            allInOutput,
          })
          await write(html, filePath)
        }
      })
    return
  }

  console.log('Compiling html....')
  for (const path of input) {
    let html = await compile(root, relative(root, path))

    let filePath = await resolveOutput({
      input: path.replace(extname(path), ''),
      root,
      output,
      allInOutput,
    })
    console.log(`Writing ${cyan(relative(output, filePath) + '.html')}`)
    await write(html, filePath)
  }

  console.log(bold(green('Done')))
}
