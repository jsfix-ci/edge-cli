# @kamona/edge-cli

### CLI tool for [edge-js/edge](https://github.com/edge-js/edge)

> This project did not tested yet and have a lot of edge cases. I just was try something

## Quick start

```sh
npx edge index.edge -r src -o dist -w
```

## Config example

```sh
npx edge -c edge.config.js
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
