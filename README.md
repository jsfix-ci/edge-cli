# @kamona/edge-cli

### CLI tool for compiling your html with [edge-js/edge](https://github.com/edge-js/edge)

[![GitHub license](https://img.shields.io/github/license/Kamona-WD/edge-cli)](https://github.com/Kamona-WD/edge-cli/blob/main/LICENSE)
[![Version](https://img.shields.io/npm/v/@kamona/edge-cli.svg?sanitize=true)](https://www.npmjs.com/package/@kamona/edge-cli)

> This project did not tested yet.

## Quick start

```sh
npx @kamona/edge-cli index.edge -r src -o dist -w
```

## Config example

```sh
npx @kamona/edge-cli -c edge.config.js
```

Config file

```js
// edge.config.js
module.exports = {
  input: ['*.edge', 'pages/*.edge'],
  root: 'src',
  output: 'dist',
  allInOutput: true,
}
```

If you don't specify config flag it will search for `.edgerc`, `edge.config.js`, `edge.config.cjs` or `edge` key in `package.json`.
