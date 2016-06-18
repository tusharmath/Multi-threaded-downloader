/**
 * Created by tushar.mathur on 18/06/16.
 */

'use strict'

import {Observable as O} from 'rx'
import {mux} from 'muxer'
import R from 'ramda'

export const ev = R.curry((event, message) => message.event === event)

export const RequestParams = R.curry((request, params) => {
  return O.create((observer) => request(params)
    .on('data', (message) => observer.onNext({event: 'data', message}))
    .on('response', (message) => observer.onNext({event: 'response', message}))
    .on('complete', () => observer.onCompleted())
    .on('error', (error) => observer.onError(error))
  )
})

export const Request = R.curry((request, requestParams$) => {
  const response$ = requestParams$.flatMap(RequestParams(request))
  return mux({
    response$: response$.filter(ev('response')),
    data$: response$.filter(ev('data'))
  })
})
