# error-handled-node-hmr

Module to handle errors when using [node-hmr](https://github.com/serhiinkh/node-hmr).

## API

```js
ehhmr(hmr, handleFile, [callbackImported], [options], [callbackCatch])
```

The `watchFilePatterns` option is set to `[handleFile]` by default.

- `hmr` node-hmr module. Required
- `handleFile` import module name or path. Required
- `callbackImported` Function called when module is imported
- `options` node-hmr [options](https://github.com/serhiinkh/node-hmr#api)
- `callbackCatch`
  - By default, errors are output to the console,
  - but you can output errors to the console yourself by assigning a function to callbackCatch.

## Usage

`test.js`:

```js
const hmr = require('node-hmr')
const ehhmr = require('error-handled-node-hmr')

var handleFile = './handle.js'

ehhmr(hmr, handleFile, importedModule => {
  console.log('imported')
})

// or

ehhmr(hmr, handleFile, importedModule => {
  console.log('imported')
}, {}, e => console.error(e))
```

Equivalent to:

```js
const hmr = require('node-hmr')

var handleFile = './handle.js'

hmr(() => {
  try {
    const importedModule = require(handleFile)

    console.log('imported')
  } catch (e) {
    console.error(e)

    const moduleId = require.resolve(handleFile)
    require.cache[moduleId] = { id: moduleId }
  }
}, { watchFilePatterns: [handleFile] })
```
