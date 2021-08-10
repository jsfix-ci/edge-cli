const { dependencies } = require('../package.json')

let deps = Object.keys(dependencies).map(dep => dep !== 'edge.js' ? dep : delete dep).filter(Boolean)

require('esbuild').build({
    entryPoints: ['src/index.ts', 'src/cli.ts'],
    outdir: 'dist',
    platform: 'node',
    target: 'node10.4',
    bundle: true,
    external: deps,
    watch: process.argv[2] == '-w'
})
