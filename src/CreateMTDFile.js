/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict'
import {mux} from 'muxer'
import R from 'ramda'
import {Observable as O} from 'rx'
import {
  RemoteFileSize$,
  CreateMeta$,
  CreateWriteBufferAtParams,
  JSToBuffer$
} from './Utils'

export const CreateMTDFile = R.curry(({FILE, HTTP}, options) => {
  /**
   * Create a new file
   */
  const fd$ = FILE.open(O.just([options.mtdPath, 'w']))

  /**
   * Retrieve file size on remote server
   */
  const size$ = RemoteFileSize$({HTTP, options})

  /**
   * Create initial meta data
   */
  const meta$ = CreateMeta$({options, size$})

  /**
   * Create a new file with meta info appended at the end
   */
  const written$ = FILE.write(CreateWriteBufferAtParams({
    FILE,
    fd$: fd$,
    buffer$: JSToBuffer$(meta$),
    position$: size$
  }))
  return mux({written$, meta$, remoteFileSize$: size$, fdW$: fd$})
})
