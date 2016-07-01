/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'
import crypto from 'crypto'
import Rx, {Observable as O} from 'rx'
import fs from 'graceful-fs'
import R from 'ramda'
import {
  CreateMTDFile,
  DownloadFromMTDFile,
  FILE,
  FinalizeDownload,
  MTDPath
} from '../src'
import {demux} from 'muxer'

export const removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(x).toPromise()

export const createFileDigest = (path) => {
  const hash = crypto.createHash('sha1')
  return new Promise((resolve) => fs
    .createReadStream(path)
    .on('data', (x) => hash.update(x))
    .on('end', () => resolve(hash.digest('hex').toUpperCase()))
  )
}

export const fsStat = (x) => Rx.Observable.fromCallback(fs.stat)(x).toPromise()

export const createTestObserver = (stream) => {
  const out = []
  stream.subscribe((x) => out.push(x))
  return out
}

/**
 * Test UTILS for doing a real download
 * @param options
 * @returns {Observable}
 */
export const createDownload = (options) => {
  /**
   * Create MTD File
   */
  const createMTDFile$ = CreateMTDFile(options).share()
  const [{fdW$}] = demux(createMTDFile$, 'fdW$')

  /**
   * Download From MTD File
   */
  const downloadFromMTDFile$ = createMTDFile$.last()
    .map(MTDPath(options.path)).flatMap(DownloadFromMTDFile).share()

  const [{fdR$, meta$}] = demux(downloadFromMTDFile$, 'meta$', 'fdR$')

  /**
   * Finalize Downloaded FILE
   */
  const finalizeDownload$ = downloadFromMTDFile$.last()
    .withLatestFrom(fdR$, meta$, (_, fd, meta) => ({
      fd$: O.just(fd),
      meta$: O.just(meta)
    }))
    .flatMap(FinalizeDownload)
    .share()
    .last()

  /**
   * Close File Descriptors
   */
  const fd$ = finalizeDownload$
    .withLatestFrom(fdW$, fdR$)
    .map(R.tail)
    .flatMap(R.map(R.of))

  return FILE.close(fd$)
}
