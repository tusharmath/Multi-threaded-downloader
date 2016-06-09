'use strict'

import Rx, {Observable as O} from 'rx'
import {demux} from 'muxer'
import R from 'ramda'

export const fromCB = R.compose(R.apply, O.fromNodeCallback)

export const FILE = R.curry((fs) => {
  return [{
    // New Methods
    open: signal$ => signal$.flatMap(fromCB(fs.open)),
    fstat: signal$ => signal$.flatMap(fromCB(fs.fstat)),
    read: signal$ => signal$.flatMap(fromCB(fs.read)),
    write: signal$ => signal$.flatMap(fromCB(fs.write)),
    close: signal$ => signal$.flatMap(fromCB(fs.close)),
    truncate: signal$ => signal$.flatMap(fromCB(fs.truncate)),
    rename: signal$ => signal$.flatMap(fromCB(fs.rename))
  }]
})

export const HTTP = R.curry((request) => {
  const requestBody = (params) => Rx.Observable.create((observer) => request(params)
    .on('data', (message) => observer.onNext({event: 'data', message}))
    .on('response', (message) => observer.onNext({event: 'response', message}))
    .on('complete', (message) => observer.onCompleted({event: 'completed', message}))
    .on('error', (error) => observer.onError(error))
  )

  const requestHead = (params) => requestBody(params)
    .first()
    .pluck('message')
    .tap((x) => x.destroy())

  const select = R.curry((event, request$) => request$.filter(x => x.event === event).pluck('message'))
  const executor = (signal$) => {
    const [{destroy$}] = demux(signal$, 'destroy$')
    destroy$.subscribe(request => request.destroy())
  }
  return [{
    // TODO: DEPRECATE
    requestBody,
    requestHead,
    select,
    // UPDATED METHODS
    request: signal$ => signal$.flatMap(requestBody)
  }, executor]
})
