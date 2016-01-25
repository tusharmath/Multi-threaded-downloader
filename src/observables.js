const request = require('request')
const Rx = require('rx')
const fs = require('fs')
const _ = require('lodash')
const u = require('./utils')

const requestBody = params => Rx.Observable.create(observer => request(params)
  .on('data', message => observer.onNext({event: 'data', message}))
  .on('response', message => observer.onNext({event: 'response', message}))
  .on('complete', message => observer.onCompleted({event: 'completed', message}))
  .on('error', error => observer.onError(error))
)

const fsOpen = Rx.Observable.fromNodeCallback(fs.open)
const fsWrite = Rx.Observable.fromNodeCallback(fs.write)
const fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
const fsRename = Rx.Observable.fromNodeCallback(fs.rename)
const fsStat = Rx.Observable.fromNodeCallback(fs.fstat)
const fsRead = Rx.Observable.fromNodeCallback(fs.read)
const fsReadBuffer = x => fsRead(x.fd, x.buffer, 0, x.buffer.length, x.offset)
const fsWriteBuffer = x => fsWrite(x.fd, x.buffer, 0, x.buffer.length, x.offset)
const fsWriteJSON = x => fsWriteBuffer(_.assign({}, x, {buffer: u.toBuffer(x.json)}))
module.exports = {
  requestBody,
  requestContentLength: x => requestBody(_.assign({}, x, {method: 'HEAD'}))
    .pluck('message', 'headers', 'content-length')
    .map(x => parseInt(x, 10)),
  fsOpen,
  fsWrite,
  fsWriteBuffer,
  fsWriteJSON,
  fsReadBuffer,
  fsTruncate,
  fsRename,
  fsStat
}
