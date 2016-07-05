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
 * Stream based utils for file manipulations
 * @namespace FILE
 */
export const FILE = R.curry((fs) => {
  return {
    /**
     * Stream based for `fs.open`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    open: toOB(fs.open),

    /**
     * Stream based for `fs.fstat`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    fstat: toOB(fs.fstat),

    /**
     * Stream based for `fs.read`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    read: toOB(fs.read),

    /**
     * Stream based for `fs.write`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    write: toOB(fs.write),

    /**
     * Stream based for `fs.close`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    close: toOB(fs.close),

    /**
     * Stream based for `fs.truncate`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    truncate: toOB(fs.truncate),

    /**
     * Stream based for `fs.rename`
     * @function
     * @memberOf FILE
     * @param {external:Observable} params$
     * @returns {external:Observable}
     */
    rename: toOB(fs.rename)
  }
})

/**
 * Stream based utils for HTTP request.
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
     * Makes HTTP requests.
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
