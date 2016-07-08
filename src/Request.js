/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict'

import {Observable as O} from 'rx'
import {mux} from 'muxer'
import R from 'ramda'

export const ev = R.curry(($, event) => $.filter(R.whereEq({event})).pluck('message'))

export const RequestParams = R.curry((request, params) => {
  return O.create((observer) => request(params)
    .on('data', (message) => observer.onNext({event: 'data', message}))
    .on('response', (message) => observer.onNext({event: 'response', message}))
    .on('complete', () => observer.onCompleted())
    .on('error', (error) => observer.onError(error))
  )
})

export const Request = R.curry((request, params) => {
  const Response$ = ev(RequestParams(request, params))
  return mux({
    response$: Response$('response'),
    data$: Response$('data')
  })
})
