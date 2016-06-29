/**
 * Created by tushar.mathur on 29/06/16.
 */

'use strict'

import {mux} from 'muxer'
import {Observable as O} from 'rx'
import R from 'ramda'
import {IsCompleted$} from './Utils'

/**
 * Removes the appended meta data and the .mtd extension from the file. In case
 * there still some data leftover to be downloaded, this step will be ignored.
 * @function
 * @param {Object} FILE - File transformer
 * @param {Observable} fd$ - File descriptor observable
 * @param {Observable} meta$ - Download meta information
 * @returns {Observable}
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
