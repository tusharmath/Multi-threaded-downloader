/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import Rx from 'rx'
import R from 'ramda'
import request from 'request'
import fs from 'graceful-fs'
import {MergeDefaultOptions, DownloadFromMTDFile, CreateMTDFile} from './Utils'
import * as T from './Transformers'

export const createDownload = (_options) => {
  const [HTTP] = T.HTTP(request)
  const [FILE] = T.FILE(fs)
  const options = MergeDefaultOptions(_options)
  const stats = new Rx.BehaviorSubject({event: 'INIT', message: options})
  const toStat = R.curry((event, message) => stats.onNext({event, message}))

  const start = () => {
    return init().flatMap(() => download())
  }

  const init = () => {
    return CreateMTDFile({FILE, HTTP, options}).tap(toStat('CREATE'))
  }
  const download = () => {
    return DownloadFromMTDFile({HTTP, FILE, options})
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
