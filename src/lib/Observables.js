var request = require('request')
var Rx = require('rx')
var _ = require('lodash')
var fs = require('fs')

var requestBody = function (params) {
  var responseHeaders
  return Rx.Observable.create(function (observer) {
    request(params)
      .on('data', buffer => observer.onNext({buffer, headers: responseHeaders}))
      .on('response', x => responseHeaders = x.headers)
      .on('complete', x => observer.onCompleted(x))
      .on('error', x => observer.onError(x))
  })
}
var requestHead = Rx.Observable.fromNodeCallback(request.head, null, _.identity)
var fsOpen = Rx.Observable.fromNodeCallback(fs.open)
var fsWrite = Rx.Observable.fromNodeCallback(fs.write)
var fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
var fsRename = Rx.Observable.fromNodeCallback(fs.rename)
var immutable = function (obj) {
  var observer
  const stream = Rx.Observable.create(function (_observer) {
    observer = _observer
  })
  return {stream, update: (cb) => observer.onNext(obj = cb(obj))}
}
module.exports = {
  requestBody,
  requestHead,
  fsOpen,
  fsWrite,
  fsTruncate,
  fsRename
}
