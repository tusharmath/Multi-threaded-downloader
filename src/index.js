/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import Rx from 'rx'
import R from 'ramda'
import {mergeDefaultOptions, resumeFromMTDFile, createMTDFile} from './Utils'
import * as ob from './Transformers'

export const createDownload = (_options) => {
  const options = mergeDefaultOptions(_options)
  const fd = ob.fsOpenFP(options.mtdPath)
  const stats = new Rx.BehaviorSubject()
  const toStat = R.curry((event, message) => stats.onNext({event, message}))
  toStat('INIT', options)

  const start = () => {
    return init().flatMap(() => download())
  }

  const init = () => {
    const fd$ = fd('w')
    return createMTDFile({FILE: ob, HTTP: ob, fd$, options}).tap(toStat('CREATE'))
  }
  const download = () => {
    const fd$ = fd('r+')
    return resumeFromMTDFile({HTTP: ob, FILE: ob, fd$})
      .tap(toStat('DATA'))
      .last()
      .flatMap((x) => ob.fsTruncate(options.mtdPath, x.totalBytes))
      .tap(toStat('TRUNCATE'))
      .flatMap(() => ob.fsRename(options.mtdPath, options.path))
      .tap(toStat('RENAME'))
      .tapOnCompleted((x) => stats.onCompleted())
  }
  return {

    start, download, init
  }
}
