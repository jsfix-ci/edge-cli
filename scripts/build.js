const { dependencies } = require('../package.json')

let deps = Object.keys(dependencies).map(dep => dep !== 'edge.js' ? dep : delete dep)

require('esbuild').build({
    entryPoints: ['src/cli.ts', 'src/cfg-resolve.ts', 'src/out-resolve.ts'],
    outdir: 'dist',
    platform: 'node',
    target: 'node10.4',
    bundle: true,
    external: deps,
    watch: process.argv[2] == '-w'
})
