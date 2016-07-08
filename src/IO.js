'use strict'

import {Observable as O} from 'rx'
import * as Rx from './RxFP'
import {demux} from 'muxer'
import R from 'ramda'
import {Request} from './Request'

export const fromCB = R.compose(R.apply, O.fromNodeCallback)
export const toOB = cb => R.compose(
  Rx.shareReplay(1),
  Rx.flatMap(fromCB(cb))
)

/**
 * Provides wrappers over the async utils inside the
 * {@link https://nodejs.org/api/fs.html fs module}.
 * The wrappers take in an input stream of arguments
 * and returns the result of function call as another stream.
 * @namespace FILE
 */
export const FILE = R.curry((fs) => {
  return {
    /**
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    open: toOB(fs.open),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    fstat: toOB(fs.fstat),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    read: toOB(fs.read),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    write: toOB(fs.write),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_close_fd_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    close: toOB(fs.close),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_truncate_path_len_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    truncate: toOB(fs.truncate),

    /**
     * {@link https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback}
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @return {external:Observable}
     */
    rename: toOB(fs.rename)
  }
})

/**
 * @namespace HTTP
 */
export const HTTP = R.curry((_request) => {
  const request = Request(_request)
  const requestHead = (params) => {
    const [{response$}] = demux(request(params), 'response$')
    return response$.first().tap(x => x.destroy()).share()
  }

  const select = R.curry((event, request$) => request$.filter(x => x.event === event).pluck('message'))
  return {
    requestHead,
    select,
    /**
     * Stream based wrapper over {@link https://www.npmjs.com/package/request npm/request}
     * @function
     * @memberOf HTTP
     * @param {object} params - {@link https://www.npmjs.com/package/request  request} module params.
     * @return {external:Observable} multiplex stream
     */
    request
  }
})

export const BAR = R.curry((ProgressBar) => {
  const bar = new ProgressBar(':bar :percent ', {
    total: 1000,
    complete: '█',
    incomplete: '░'
  })
  return bar.update.bind(bar)
})
