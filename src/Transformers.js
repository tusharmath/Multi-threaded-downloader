import request from 'request'
import Rx from 'rx'
import fs from 'graceful-fs'
import _ from 'lodash'
import * as u from './Utils'

export const requestBody = (params) => Rx.Observable.create((observer) => request(params)
  .on('data', (message) => observer.onNext({event: 'data', message}))
  .on('response', (message) => observer.onNext({event: 'response', message}))
  .on('complete', (message) => observer.onCompleted({event: 'completed', message}))
  .on('error', (error) => observer.onError(error))
)

export const requestHead = (params) => requestBody(params)
  .first()
  .pluck('message')
  .tap((x) => x.destroy())

export const requestContentLength = (params) => requestHead(params)
  .pluck('headers', 'content-length')
  .map((x) => parseInt(x, 10))

export const fsOpen = Rx.Observable.fromNodeCallback(fs.open)
export const fsWrite = Rx.Observable.fromNodeCallback(fs.write)
export const fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
export const fsRename = Rx.Observable.fromNodeCallback(fs.rename)
export const fsStat = Rx.Observable.fromNodeCallback(fs.fstat)
export const fsRead = Rx.Observable.fromNodeCallback(fs.read)
export const fsReadBuffer = (x) => fsRead(x.fd, x.buffer, 0, x.buffer.length, x.offset)
export const fsWriteBuffer = (x) => fsWrite(x.fd, x.buffer, 0, x.buffer.length, x.offset)
export const fsWriteJSON = (x) => fsWriteBuffer(_.assign({}, x, {buffer: u.toBuffer(x.json)}))
export const fsReadJSON = (x) => fsReadBuffer(x).map((x) => JSON.parse(x[1].toString()))
export const buffer = (size) => Rx.Observable.just(u.createEmptyBuffer(size))
