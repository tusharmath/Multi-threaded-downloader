/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import Rx from 'rx'
import R from 'ramda'
import {initParams, downloadMTD, initMTD} from './Utils'
import * as ob from './Transformers'

export const createDownload = (_options) => {
  const options = initParams(_options)
  const fd = ob.fsOpenFP(options.mtdPath)
  const stats = new Rx.BehaviorSubject()
  const toStat = R.curry((event, message) => stats.onNext({event, message}))
  toStat('INIT', options)

  const start = () => {
    return init().flatMap(() => download())
  }

  const init = () => {
    return initMTD(ob, fd('w'), options).tap(toStat('CREATE'))
  }
  const download = () => {
    const fd$ = fd('r+')
    return downloadMTD(ob, fd$)
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
