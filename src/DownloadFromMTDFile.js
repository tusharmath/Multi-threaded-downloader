/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict'

import {mux} from 'muxer'
import {Observable as O} from 'rx'
import R from 'ramda'
import {
  CreateWriteBufferAtParams,
  JSToBuffer$,
  LocalFileSize$,
  MetaPosition$,
  ReadJSON$,
  demuxFPH,
  RequestWithMeta,
  WriteBuffer,
  SetMetaOffsets,
  RxThrottleComplete,
  RxTakeN,
  GetThreadCount
} from './Utils'

/**
 * Reads a `.mtd` file and resumes the download from the last successfully saved
 * byte.
 * @function
 * @param {String} mtdPath - Relative path to the `.mtd` file.
 * @param {Object} [meta] - Optional meta data to override the one that's being
 * loaded from the `.mtd` file.
 * @return {external:Observable}
 * A {@link https://github.com/tusharmath/muxer multiplexed stream} containing ~
 * - `metaWritten$` - Meta data buffer stream.
 * - `response$` - HTTP response object.
 * - `responses$` - List of all the HTTP response objects.
 * - `localFileSize$` - Size of the `.mtd` file on disk.
 * - `fdR$` - File Descriptor in `r+` mode.
 * - `meta$` - Download meta information.
 */
export const DownloadFromMTDFile = R.curryN(2, ({FILE, HTTP}, mtdPath, _meta) => {
  /**
   * Open file to read+append
   */
  const fd$ = FILE.open(O.just([mtdPath, 'r+']))

  /**
   * Retrieve File size on disk
   */
  const size$ = LocalFileSize$({FILE, fd$})

  /**
   * Retrieve Meta info
   */
  const metaPosition$ = MetaPosition$({size$})
  const meta$ = ReadJSON$({FILE, fd$, position$: metaPosition$})
    .map(meta => R.merge(meta, _meta))

  /**
   * Make a HTTP request for each thread
   */
  const {response$, buffer$} = demuxFPH(
    ['buffer$', 'response$'], RequestWithMeta(HTTP, meta$).share()
  )

  /**
   * Select all the responses
   */
  const responses$ = RxTakeN(meta$.map(GetThreadCount), response$)

  /**
   * Create write params and save buffer+offset to disk
   */
  const bufferWritten$ = WriteBuffer({FILE, fd$, buffer$})

  /**
   * Update META info
   */
  const nMeta$ = SetMetaOffsets({meta$, bufferWritten$})

  /**
   * Persist META to disk
   */
  const metaWritten$ = FILE.write(CreateWriteBufferAtParams({
    fd$,
    buffer$: JSToBuffer$(RxThrottleComplete(meta$.pluck('metaWrite'), nMeta$)),
    position$: size$
  }))

  /**
   * Create sink$
   */
  return mux({
    metaWritten$, response$, responses$,
    localFileSize$: size$,
    fdR$: fd$, metaPosition$,
    meta$: O.merge(nMeta$, meta$)
  })
})
