'use strict'

import request from 'request'
import Rx from 'rx'
import fs from 'graceful-fs'
import _ from 'lodash'
import R from 'ramda'

export const FILE = () => {
  const toBuffer = (obj, size) => {
    var buffer = createFilledBuffer(size)
    buffer.write(JSON.stringify(obj))
    return buffer
  }

  const createFilledBuffer = (size = 512, fill = ' ') => {
    const buffer = new Buffer(size)
    buffer.fill(fill)
    return buffer
  }
  const fsOpen = Rx.Observable.fromNodeCallback(fs.open)
  const fsOpenFP = _.curry((path, flag) => fsOpen(path, flag))
  const fsWrite = Rx.Observable.fromNodeCallback(fs.write)
  const fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
  const fsRename = Rx.Observable.fromNodeCallback(fs.rename)
  const fsStat = Rx.Observable.fromNodeCallback(fs.fstat)
  const fsRead = Rx.Observable.fromNodeCallback(fs.read)
  const fsReadBuffer = (x) => fsRead(x.fd, x.buffer, 0, x.buffer.length, x.offset)
  const fsWriteBuffer = (x) => fsWrite(x.fd, x.buffer, 0, x.buffer.length, x.offset)
  const fsWriteJSON = (x) => fsWriteBuffer(_.assign({}, x, {buffer: toBuffer(x.json)}))
  const fsReadJSON = (x) => fsReadBuffer(x).map((x) => JSON.parse(x[1].toString()))
  const buffer = (size) => Rx.Observable.just(createFilledBuffer(size))

  return {
    fsOpen,
    fsOpenFP,
    fsWrite,
    fsTruncate,
    fsRename,
    fsStat,
    fsRead,
    fsReadBuffer,
    fsWriteBuffer,
    fsWriteJSON,
    fsReadJSON,
    buffer
  }
}

export const HTTP = () => {
  const requestBody = (params) => Rx.Observable.create((observer) => request(params)
    .on('data', (message) => observer.onNext({event: 'data', message}))
    .on('response', (message) => observer.onNext({event: 'response', message}))
    .on('complete', (message) => observer.onCompleted({event: 'completed', message}))
    .on('error', (error) => observer.onError(error))
  )

  const requestHead = (params) => requestBody(params)
    .first()
    .pluck('message')
    .tap((x) => x.destroy())

  const requestContentLength = (params) => requestHead(params)
    .pluck('headers', 'content-length')
    .map((x) => parseInt(x, 10))
  const select = R.curry((event, request$) => request$.filter(x => x.event === event).pluck('message'))
  return {requestBody, requestHead, requestContentLength, select}
}
