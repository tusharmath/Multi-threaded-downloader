var request = require('request')
var Rx = require('rx')
var _ = require('lodash')
var fs = require('fs')

var requestBody = function (params) {
  var response = new Rx.Subject()
  var data = new Rx.Subject()

  request(params)
    .on('data', buffer => data.onNext({buffer}))
    .on('response', x => response.onNext(x))
    .on('complete', x => data.onCompleted(x))
    .on('complete', x => response.onCompleted(x))
    .on('error', x => data.onError(x))
    .on('error', x => response.onError(x))

  return {data, response}
}
var requestHead = Rx.Observable.fromNodeCallback(request.head, null, _.identity)
var fsOpen = Rx.Observable.fromNodeCallback(fs.open)
var fsWrite = Rx.Observable.fromNodeCallback(fs.write)
var fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
var fsRename = Rx.Observable.fromNodeCallback(fs.rename)
module.exports = {
  requestBody,
  requestHead,
  fsOpen,
  fsWrite,
  fsTruncate,
  fsRename
}
