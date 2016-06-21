/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import Rx from 'rx'
import R from 'ramda'
import request from 'request'
import {demux} from 'muxer'
import fs from 'graceful-fs'
import {MergeDefaultOptions, DownloadFromMTDFile, CreateMTDFile, FinalizeDownload} from './Utils'
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
    const [{metaPosition$, fd$, meta$}] = demux(
      DownloadFromMTDFile({HTTP, FILE, mtdPath: options.mtdPath}),
      'metaPosition$', 'fd$', 'meta$'
    )
    const complete$ = metaPosition$.last()
    const [_, rest$] = demux(FinalizeDownload({FILE, fd$, meta$, complete$}))
    return rest$
  }
  return {
    start, download, init
  }
}
