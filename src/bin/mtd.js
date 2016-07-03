#!/usr/bin/env node
/**
 * Created by tushar.mathur on 04/06/16.
 */

'use strict'
import meow from 'meow'
import R from 'ramda'
import {demux, mux} from 'muxer'
import {Observable as O} from 'rx'
import * as Rx from '../RxFP'
import {
  GetDownloadType,
  DOWNLOAD_TYPES,
  CliValidOptions,
  CreateMTDFile,
  DownloadFromMTDFile,
  FinalizeDownload,
  Completion,
  BAR
} from '../index'
import {Help, Status} from './Messages'

/**
 * LIB
 */
export const Log = console.log.bind(console)
export const LogAlways = message => () => Log(message)
export const FlatMapShare = R.curry((func, $) => $.flatMap(func).shareReplay(1))
export const Size = meta$ => meta$.pluck('totalBytes').take(1)
export const ValidOptions = Rx.partition(CliValidOptions)
export const IsNewDownload = R.whereEq({type: DOWNLOAD_TYPES.NEW})
export const DownloadOptions = R.compose(R.map(Rx.pluck('options')), Rx.partition(IsNewDownload), GetDownloadType)
export const Executor = (signal$) => {
  const [{finalized$, size$, completion$, invalidOptions$}] = demux(
    signal$, 'finalized$', 'size$', 'completion$', 'invalidOptions$'
  )
  finalized$.subscribe(LogAlways('COMPLETED'))
  size$.subscribe(R.compose(Log, Status))
  invalidOptions$.subscribe(LogAlways(Help))
  completion$.subscribe(BAR)
}
const resumeDownload = (mtdFile$) => {
  const downloaded$ = FlatMapShare(DownloadFromMTDFile, mtdFile$)
  const [{fdR$, meta$}] = demux(downloaded$, 'meta$', 'fdR$')
  const finalized$ = FlatMapShare(
    FinalizeDownload,
    downloaded$.last().withLatestFrom(fdR$, meta$,
      (_, fd, meta) => ({fd$: O.just(fd), meta$: O.just(meta)}))
  ).last()
  const completion$ = Completion(meta$.throttle(1000))
  const size$ = Size(meta$)
  return mux({finalized$, completion$, size$})
}
const initializeDownload = (options$) => {
  const [new$, resume$] = DownloadOptions(options$)
  const created$ = FlatMapShare(CreateMTDFile, new$).takeLast(1)
  return O.merge(
    resume$,
    created$.withLatestFrom(new$, R.nthArg(1))
  ).pluck('mtdPath')
}

/**
 * Logic
 */
const options$ = O.just(meow(Help).flags)
const [validOptions$, invalidOptions$] = ValidOptions(options$)
const mtdFile$ = initializeDownload(validOptions$)
const [{finalized$, completion$, size$}] = demux(resumeDownload(mtdFile$), 'finalized$', 'completion$', 'size$')

Executor(mux({finalized$, size$, completion$, invalidOptions$}))
