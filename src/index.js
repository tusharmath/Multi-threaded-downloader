/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import Rx from 'rx'
import R from 'ramda'
import request from 'request'
import fs from 'graceful-fs'
import {mergeDefaultOptions, resumeFromMTDFile, createMTDFile} from './Utils'
import * as ob from './Transformers'

export const createDownload = (_options) => {
  const HTTP = ob.HTTP(request)
  const FILE = ob.FILE(fs)
  const options = mergeDefaultOptions(_options)
  const stats = new Rx.BehaviorSubject({event: 'INIT', message: options})
  const toStat = R.curry((event, message) => stats.onNext({event, message}))

  const start = () => {
    return init().flatMap(() => download())
  }

  const init = () => {
    return createMTDFile({FILE, HTTP, options}).tap(toStat('CREATE'))
  }
  const download = () => {
    return resumeFromMTDFile({HTTP, FILE, options})
      .tap(toStat('DATA'))
      .last()
      .flatMap((x) => FILE.fsTruncate(options.mtdPath, x.totalBytes))
      .tap(toStat('TRUNCATE'))
      .flatMap(() => FILE.fsRename(options.mtdPath, options.path))
      .tap(toStat('RENAME'))
      .tapOnCompleted((x) => stats.onCompleted())
  }
  return {

    start, download, init
  }
}
