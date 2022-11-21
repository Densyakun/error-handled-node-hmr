const path = require('path')

module.exports = (hmr, watchFile, callbackImported, callbackPreImport, options, callbackCatch) => {
  const parentDirName = path.dirname(module.parent.filename)
  const watchModules = options?.watchFilePatterns || [watchFile]

  hmr(() => {
    if (callbackPreImport)
      callbackPreImport()

    try {
      const modulePath = path.resolve(parentDirName, watchFile)

      // Modules set in require.cache to watch for file changes by this module,
      // may return undefined when imported by the require function, so
      // modules to be imported must be deleted from require.cache.
      watchModules.forEach(modulePath => {
        delete require.cache[require.resolve(path.resolve(parentDirName, modulePath))]
      })

      const importedModule = require(modulePath)

      if (callbackImported)
        callbackImported(importedModule)
    } catch (e) {
      callbackCatch ? callbackCatch(e) : console.error(e)

      // If an error is thrown when importing a module, the modules is removed from require.cache.
      // So, to watch for changes in the file, here we add a modules to require.cache.
      watchModules.forEach(modulePath => {
        const moduleId = require.resolve(path.resolve(parentDirName, modulePath))
        if (!require.cache[moduleId])
          require.cache[moduleId] = { id: moduleId } // Importing a module set here with the require function returns undefined.
      })
    }
  }, { watchFilePatterns: [watchFile], ...options })
}