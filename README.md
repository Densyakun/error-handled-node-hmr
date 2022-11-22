# error-handled-node-hmr

Module to handle errors when using [node-hmr](https://github.com/serhiinkh/node-hmr).

## Install

```bash
npm i error-handled-node-hmr
```

## API

```js
ehhmr(hmr, watchFile, [callbackImported], [callbackPreImport], [options], [callbackCatch])
```

- `hmr` node-hmr module. Required
- `watchFile` import module name or path. Required
- `callbackImported` Function called when module is imported
- `callbackPreImport` Function called before importing a module
- `options` node-hmr [options](https://github.com/serhiinkh/node-hmr#api)
  - The `watchFilePatterns` option is set to `[watchFile]` by default
- `callbackCatch`
  - By default, errors are output to the console,
  - but you can output errors to the console yourself by assigning a function to callbackCatch.

## Usage

```js
const hmr = require('node-hmr')
const ehhmr = require('error-handled-node-hmr')

var watchFile = './watched.js'

ehhmr(hmr, watchFile, importedModule => {
  console.log('imported')
})
```

Equivalent to:

```js
const hmr = require('node-hmr')

var watchFile = './watched.js'

hmr(() => {
  try {
    const importedModule = require(watchFile)

    console.log('imported')
  } catch (e) {
    console.error(e)

    const moduleId = require.resolve(watchFile)
    require.cache[moduleId] = { id: moduleId }
  }
}, { watchFilePatterns: [watchFile] })
```

## Customize the handling before importing a module

```js
let watchedModule
ehhmr(hmr, watchFile, importedModule => {
  watchedModule = importedModule
}, () => console.log('pre import'))
```

## Custom node-hmr options

```js
ehhmr(hmr, watchFile, importedModule => {
  console.log('imported')
}, undefined, {
  watchFilePatterns: [
    watchFile,
    './moduleB.js'
  ]
})
```

## Use hmr only in development mode

```js
const dev = process.env.NODE_ENV !== 'production'

let handleModule
const fn = importedModule => {
  handleModule = importedModule
}

if (dev) {
  const hmr = require('node-hmr')
  const ehhmr = require('error-handled-node-hmr')

  var handleFile = './watched.js'

  ehhmr(hmr, handleFile, importedModule => {
    fn(importedModule)
  })
} else
  fn(require(handleFile))
```
