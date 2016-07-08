/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict'

import {mux} from 'muxer'
import {Observable as O} from 'rx'
import R from 'ramda'
import {IsCompleted$} from './Utils'

/**
 * Removes the meta information and the `.mtd` extension from the file once the
 * download is successfully completed.
 * @function
 * @param {object} params - `{fd$, meta$}`
 * @param {external:Observable} params.fd$ - File descriptor Observable
 * @param {external:Observable} params.meta$ - Download meta information
 * @returns {external:Observable}
 * A {@link https://github.com/tusharmath/muxer multiplexed stream} containing ~
 * - `truncated$` - Fired when the meta data is removed.
 * - `renamed$` - Fired when the `.mtd` extension is removed.
 */
export const FinalizeDownload = R.curry(({FILE}, {fd$, meta$}) => {
  const [ok$, noop$] = IsCompleted$(meta$).partition(Boolean)
  const Truncate = ({FILE, meta$, fd$}) => {
    const size$ = meta$.pluck('totalBytes')
    return FILE.truncate(O.combineLatest(fd$, size$).take(1))
  }
  const Rename = ({FILE, meta$}) => {
    const params$ = meta$.map(meta => [meta.mtdPath, meta.path]).take(1)
    return FILE.rename(params$)
  }
  return O.merge(
    mux({noop$}),
    ok$.flatMap(() => {
      const truncated$ = Truncate({FILE, meta$, fd$})
      const renamed$ = truncated$.flatMap(() => Rename({FILE, meta$}))
      return mux({truncated$, renamed$})
    })
  )
})
