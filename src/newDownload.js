const Rx = require('rx')
const VALID_URL = require('valid-url')
const _ = require('lodash')
const pathGenerator = require('../src/utils').pathGenerator

module.exports = (createDownload, pFlags) => pFlags
    .filter((x) => VALID_URL.isUri(x.url))
    .flatMap((x) => {
      const defaultParams = {path: pathGenerator(x.url)}
      _.defaults(x, defaultParams)
      const source = createDownload(x)
      return Rx.Observable.merge(source.start(), source.stats)
    })
