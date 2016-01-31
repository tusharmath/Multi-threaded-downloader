const normalizePath = require('../src/utils').normalizePath
const _ = require('lodash')

module.exports = (createDownload, pFlags) => pFlags
    .skipWhile(x => x.url)
    .map(x => {
      const defaultParams = {
        mtdPath: normalizePath(x.file),
        path: normalizePath(x.file.replace('.mtd', ''))
      }
      _.defaults(x, defaultParams)
      const download = createDownload(x)
      const downloadable = download.download()
      return {download, downloadable}
    })
