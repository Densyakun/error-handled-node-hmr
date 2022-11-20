module.exports = (hmr, watchFile, callbackImported, callbackPreImport, options, callbackCatch) => {
  hmr(() => {
    if (callbackPreImport) callbackPreImport()

    try {
      const importedModule = require(watchFile)

      if (callbackImported) callbackImported(importedModule)
    } catch (e) {
      callbackCatch ? callbackCatch(e) : console.error(e)

      const moduleId = require.resolve(watchFile)
      require.cache[moduleId] = { id: moduleId }
    }
  }, { watchFilePatterns: [watchFile], ...options })
}