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
  RxThrottleComplete
} from './Utils'

export const DownloadFromMTDFile = R.curry(({FILE, HTTP}, mtdPath) => {
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

  /**
   * Make a HTTP request for each thread
   */
  const {response$, buffer$} = demuxFPH(
    ['buffer$', 'response$'], RequestWithMeta(HTTP, meta$)
  )

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
    metaWritten$, response$,
    localFileSize$: size$,
    fdR$: fd$, metaPosition$,
    meta$: O.merge(nMeta$, meta$)
  })
})
