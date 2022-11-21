const path = require('path')

module.exports = (hmr, watchFile, callbackImported, callbackPreImport, options, callbackCatch) => {
  const modulePath = path.resolve(path.dirname(module.parent.filename), watchFile)
  hmr(() => {
    if (callbackPreImport) callbackPreImport()

    try {
      const importedModule = require(modulePath)

      if (callbackImported) callbackImported(importedModule)
    } catch (e) {
      callbackCatch ? callbackCatch(e) : console.error(e)

      const moduleId = require.resolve(modulePath)
      require.cache[moduleId] = { id: moduleId }
    }
  }, { watchFilePatterns: [watchFile], ...options })
}