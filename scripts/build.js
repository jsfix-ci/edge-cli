const { build } = require('esbuild')
const { dependencies } = require('../package.json')

// We will bundle edge.js with our code to work in versions older than node 14 
let deps = Object.keys(dependencies).map(dep => dep !== 'edge.js' ? dep : delete dep).filter(Boolean)

const developmentMode = process.env.NODE_ENV == 'development'

build({
    entryPoints: ['src/index.ts', 'src/cli.ts'],
    outdir: 'dist',
    platform: 'node',
    target: 'node10.4',
    bundle: true,
    external: deps,
    watch: developmentMode
})

if(developmentMode){
    console.log('esbuild watching...')
}
