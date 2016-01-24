var request = require('request')
var Rx = require('rx')
var fs = require('fs')

var requestBody = params => Rx.Observable.create(observer => request(params)
  .on('data', message => observer.onNext({event: 'data', message}))
  .on('response', message => observer.onNext({event: 'response', message}))
  .on('complete', message => observer.onCompleted({event: 'completed', message}))
  .on('error', error => observer.onError(error))
)

var fsOpen = Rx.Observable.fromNodeCallback(fs.open)
var fsWrite = Rx.Observable.fromNodeCallback(fs.write)
var fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
var fsRename = Rx.Observable.fromNodeCallback(fs.rename)
var fsStat = Rx.Observable.fromNodeCallback(fs.fstat)
var fsRead = Rx.Observable.fromNodeCallback(fs.read)
module.exports = {
  requestBody,
  fsOpen,
  fsWrite,
  fsWriteBuffer: x => fsWrite(x.fd, x.buffer, 0, x.buffer.length, x.offset),
  fsReadBuffer: x => fsRead(x.fd, x.buffer, 0, x.buffer.length, x.offset),
  fsTruncate,
  fsRename,
  fsStat
}
