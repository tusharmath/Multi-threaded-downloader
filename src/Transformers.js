'use strict'

import Rx, {Observable as O} from 'rx'
import {demux} from 'muxer'
import R from 'ramda'

export const fromCB = R.compose(R.apply, O.fromNodeCallback)
export const FILE = R.curry((fs) => {
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
  const fsWrite = Rx.Observable.fromNodeCallback(fs.write)
  const fsTruncate = Rx.Observable.fromNodeCallback(fs.truncate)
  const fsRename = Rx.Observable.fromNodeCallback(fs.rename)
  const fsStat = Rx.Observable.fromNodeCallback(fs.fstat)
  const fsRead = Rx.Observable.fromNodeCallback(fs.read)
  const fsReadBuffer = (x) => fsRead(x.fd, x.buffer, 0, x.buffer.length, x.offset)
  const fsWriteBuffer = (x) => fsWrite(x.fd, x.buffer, 0, x.buffer.length, x.offset)
  const fsWriteJSON = (x) => fsWriteBuffer(R.mergeAll([x, {buffer: toBuffer(x.json)}]))
  const fsReadJSON = (x) => fsReadBuffer(x).map((x) => JSON.parse(x[1].toString()))
  const buffer = (size) => Rx.Observable.just(createFilledBuffer(size))
  const executor = (signal$) => {
    const [{write$, close$, truncate$, rename$}] = demux(signal$, 'write$', 'close$', 'truncate$', 'rename')
    write$.subscribe(fromCB(fs.write))
    close$.subscribe(fromCB(fs.close))
    truncate$.subscribe(fromCB(fs.truncate))
    rename$.subscribe(fromCB(fs.rename))
  }
  return [{
    fsOpen,
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
  }, executor]
})

export const HTTP = R.curry((request) => {
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
  const executor = (signal$) => {
    const [{destroy$}] = demux(signal$, 'destroy$')
    destroy$.subscribe(request => request.destroy())
  }
  return [{requestBody, requestHead, requestContentLength, select}, executor]
})
