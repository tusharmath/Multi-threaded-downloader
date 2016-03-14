const request = require('request')
const Rx = require('rx')
const fs = require('graceful-fs')
const _ = require('lodash')
const u = require('./utils')

const requestBody = (params) => Rx.Observable.create((observer) => request(params)
  .on('data', (message) => observer.onNext({event: 'data', message}))
  .on('response', (message) => observer.onNext({event: 'response', message}))
  .on('complete', (message) => observer.onCompleted({event: 'completed', message}))
  .on('error', (error) => observer.onError(error))
)

const fsOpen = Rx.Observable.fromNodeCallback(fs.open)
const fsWrite = Rx.Observable.fromNodeCallback(fs.write)
const fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
const fsRename = Rx.Observable.fromNodeCallback(fs.rename)
const fsStat = Rx.Observable.fromNodeCallback(fs.fstat)
const fsRead = Rx.Observable.fromNodeCallback(fs.read)
const fsReadBuffer = (x) => fsRead(x.fd, x.buffer, 0, x.buffer.length, x.offset)
const fsWriteBuffer = (x) => fsWrite(x.fd, x.buffer, 0, x.buffer.length, x.offset)
const fsWriteJSON = (x) => fsWriteBuffer(_.assign({}, x, {buffer: u.toBuffer(x.json)}))
const fsReadJSON = (x) => fsReadBuffer(x).map((x) => JSON.parse(x[1].toString()))
const buffer = (size) => Rx.Observable.just(u.createEmptyBuffer(size))
module.exports = {
  requestBody,
  requestContentLength: (x) => requestBody(_.assign({}, x, {method: 'HEAD'}))
    .pluck('message', 'headers', 'content-length')
    .map((x) => parseInt(x, 10)),
  fsOpen,
  fsWrite,
  fsWriteBuffer,
  fsWriteJSON,
  fsReadJSON,
  fsReadBuffer,
  fsTruncate,
  fsRename,
  fsStat,
  buffer
}
