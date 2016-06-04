import Rx from 'rx'
import VALID_URL from 'valid-url'
import _ from 'lodash'
import {pathGenerator} from './Utils'

export default (createDownload, pFlags) => pFlags
  .filter((x) => VALID_URL.isUri(x.url))
  .flatMap((x) => {
    const defaultParams = {path: pathGenerator(x.url)}
    _.defaults(x, defaultParams)
    const source = createDownload(x)
    return Rx.Observable.merge(source.start(), source.stats)
  })
