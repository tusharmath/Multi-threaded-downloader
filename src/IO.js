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
export const FILE = R.curry((fs) => {
  return {
    // New Methods
    open: toOB(fs.open),
    fstat: toOB(fs.fstat),
    read: toOB(fs.read),
    write: toOB(fs.write),
    close: toOB(fs.close),
    truncate: toOB(fs.truncate),
    rename: toOB(fs.rename)
  }
})

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
