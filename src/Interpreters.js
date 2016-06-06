/**
 * Created by tushar.mathur on 05/06/16.
 */

'use strict'
import R from 'ramda'
import {demux, mux} from 'muxer'
import {Observable as O} from 'rx'

export const fromCB = O.fromNodeCallback
export const FILE = R.curry((fs, signal$) => {
  const [{write$, close$, truncate$, rename$}] = demux(signal$, 'write$', 'close$', 'truncate$', 'rename')
  write$.subscribe(R.apply(fs.write))
  close$.subscribe(R.apply(fs.close))
  truncate$.subscribe(R.apply(fs.truncate))
  rename$.subscribe(R.apply(fs.rename))
  return {
    open: signal$ => signal$.flatMap(R.apply(fromCB(fs.open))),
    stat: signal$ => signal$.flatMap(R.apply(fromCB(fs.stat))),
    read: signal$ => signal$.flatMap(R.apply(fromCB(fs.read)))
  }
})

export const Request = R.curry((request, params) => {
  const response$ = O.create((observer) => request(params)
    .on('data', (message) => observer.onNext(['data', message]))
    .on('response', (message) => observer.onNext(['response', message]))
    .on('complete', (message) => observer.onCompleted())
    .on('error', (error) => observer.onError(error))
  )
  const select = event => R.compose(R.equals(event), R.nth(0))
  return mux({
    response$: response$.filter(select('response')).map(R.nth(1)),
    data$: response$.filter(select('data')).map(R.nth(1))
  })
})

export const HTTP = R.curry((request, signal$) => {
  const request$ = Request(request)
  const [{destroy$}] = demux(signal$, 'destroy$')
  destroy$.subscribe(request => request.destroy())

  return {
    request: signal$.flatMap(request$)
  }
})