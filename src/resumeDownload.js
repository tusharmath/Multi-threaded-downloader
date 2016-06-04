import {normalizePath} from './utils'
import _ from 'lodash'
import Rx from 'rx'

export default (createDownload, pFlags) => pFlags
  .skipWhile((x) => x.url)
  .flatMap((x) => {
    const defaultParams = {
      mtdPath: normalizePath(x.file),
      path: normalizePath(x.file.replace('.mtd', ''))
    }
    _.defaults(x, defaultParams)
    const source = createDownload(x)
    return Rx.Observable.merge(source.download(), source.stats)
  })
