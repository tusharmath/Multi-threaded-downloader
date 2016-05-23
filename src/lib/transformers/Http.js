/**
 * Created by tushar.mathur on 23/05/16.
 */

'use strict'

const O = require('rx').Observable

exports.createHttpTransformer = ({request}) => {
  return {
    requestBody$ ({params$}) {
      return params$.flatMap(params => O.create(observer => request(params)
        .on('data', message => observer.onNext({event: 'data', message}))
        .on('response', message => observer.onNext({event: 'response', message}))
        .on('complete', message => observer.onCompleted({event: 'completed', message}))
        .on('error', error => observer.onError(error))
      ))
    },
    requestHead$ ({params$}) {
      this.requestBody$(params$)
        .first()
        .pluck('message')
    },
    requestContentLength$ ({params$}) {
      return this.requestHead$({params$})
        .pluck('headers', 'content-length')
        .map(len => parseInt(len, 10))
    }
  }
}
