/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import Rx from 'rx'
import R from 'ramda'
import request from 'request'
import {demux} from 'muxer'
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
    const [{written$}] = demux(CreateMTDFile({FILE, HTTP, options}), 'written$')
    return written$.tap(toStat('CREATE'))
  }
  const download = () => {
    const [{metaPosition$}] = demux(DownloadFromMTDFile({HTTP, FILE, mtdPath: options.mtdPath}), 'metaPosition$')
    const totalBytes$ = metaPosition$.tap(toStat('DATA')).last()
    const truncated$ = FILE.truncate(totalBytes$.map(bytes => [options.mtdPath, bytes]))
      .tap(toStat('TRUNCATE'))
    return FILE.rename(truncated$.map([options.mtdPath, options.path]))
      .tap(toStat('RENAME'))
      .tapOnCompleted((x) => stats.onCompleted())
  }
  return {

    start, download, init
  }
}
