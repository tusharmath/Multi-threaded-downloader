/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import request from 'request'
import fs from 'graceful-fs'
import {Observable as O} from 'rx'
import R from 'ramda'
import * as U from './Utils'
import * as T from './Transformers'
import {mux, demux} from 'muxer'

export const Utils = U
export const createDownload = (_options) => {
  const [HTTP] = T.HTTP(request)
  const [FILE] = T.FILE(fs)
  const options = U.MergeDefaultOptions(_options)

  /**
   * Create MTD File
   */
  const createMTDFile$ = U.CreateMTDFile({FILE, HTTP, options}).share()
  const [{fdW$}] = demux(createMTDFile$, 'fdW$')

  /**
   * Download From MTD File
   */
  const downloadFromMTDFile$ = createMTDFile$.last()
    .map({HTTP, FILE, mtdPath: options.mtdPath})
    .flatMap(U.DownloadFromMTDFile)
    .share()

  const [{fdR$, meta$}] = demux(downloadFromMTDFile$, 'meta$', 'fdR$')

  /**
   * Finalize Downloaded FILE
   */
  const finalizeDownload$ = downloadFromMTDFile$.last()
    .withLatestFrom(fdR$, meta$, (_, fd, meta) => ({FILE, fd$: O.just(fd), meta$: O.just(meta)}))
    .flatMap(U.FinalizeDownload)
    .share()
    .last()

  /**
   * Close File Descriptors
   */
  const fd$ = finalizeDownload$.withLatestFrom(fdW$, fdR$)
    .map(R.slice(1, Infinity))
    .flatMap(R.map(R.of))
  const closed$ = FILE.close(fd$)

  /**
   * Create Sink
   */
  return mux({finalizeDownload$, meta$, closed$})
}
