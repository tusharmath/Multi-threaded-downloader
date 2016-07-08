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

/**
 * Creates a new .mtd file that is a little larger in size than the original
 * file. The file is initially empty and has all the relevant meta
 * information regarding the download appended to the end.
 * @function
 * @param {object} options - The `options` must have `mtdPath` and `url`.
 * @param {string} options.url - Download url.
 * @param {string} options.path - Relative path where the file needs to be saved.
 * @param {number} [options.range=3] - Number of concurrent downloads.
 * @param {number} [options.metaWrite=300] - Throttles the write frequency of meta data.
 * @return {external:Observable}
 * A {@link https://github.com/tusharmath/muxer multiplexed stream} containing ~
 * - `written$` - Bytes being saved on disk.
 * - `meta$` - Meta information about the download.
 * - `remoteFileSize$` - Size of the content that is to be downloaded.
 * - `fdW$` - File descriptor in `w` mode.
 */
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
