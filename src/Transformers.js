'use strict'

import {Observable as O} from 'rx'
import {demux} from 'muxer'
import R from 'ramda'
import {Request} from './Request'

export const fromCB = R.compose(R.apply, O.fromNodeCallback)

export const FILE = R.curry((fs) => {
  return [{
    // New Methods
    open: signal$ => signal$.flatMap(fromCB(fs.open)).shareReplay(1),
    fstat: signal$ => signal$.flatMap(fromCB(fs.fstat)).shareReplay(1),
    read: signal$ => signal$.flatMap(fromCB(fs.read)).shareReplay(1),
    write: signal$ => signal$.flatMap(fromCB(fs.write)).shareReplay(1),
    close: signal$ => signal$.flatMap(fromCB(fs.close)).shareReplay(1),
    truncate: signal$ => signal$.flatMap(fromCB(fs.truncate)).shareReplay(1),
    rename: signal$ => signal$.flatMap(fromCB(fs.rename)).shareReplay(1)
  }]
})

export const HTTP = R.curry((_request) => {
  const request = Request(_request)
  const requestHead = (params) => {
    const [{response$}] = demux(request(params), 'response$')
    return response$.first().tap(x => x.destroy()).share()
  }

  const select = R.curry((event, request$) => request$.filter(x => x.event === event).pluck('message'))
  const executor = (signal$) => {
    const [{destroy$}] = demux(signal$, 'destroy$')
    destroy$.subscribe(request => request.destroy())
  }
  return [{
    requestHead,
    select,
    request
  }, executor]
})
