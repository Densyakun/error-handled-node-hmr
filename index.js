module.exports = (hmr, handleFile, callbackImported, options, callbackCatch) => {
  hmr(() => {
    try {
      const importedModule = require(handleFile)

      if (callbackImported) callbackImported(importedModule)
    } catch (e) {
      callbackCatch ? callbackCatch(e) : console.error(e)

      const moduleId = require.resolve(handleFile)
      require.cache[moduleId] = { id: moduleId }
    }
  }, { watchFilePatterns: [handleFile], ...options })
}