const VALID_URL = require('valid-url')
const _ = require('lodash')
const pathGenerator = require('../src/utils').pathGenerator

module.exports = (createDownload, pFlags) => pFlags
    .filter(x => VALID_URL.isUri(x.url))
    .map(x => {
      const defaultParams = {path: pathGenerator(x.url)}
      _.defaults(x, defaultParams)
      const download = createDownload(x)
      const downloadable = download.start()
      return {download, downloadable}
    })
