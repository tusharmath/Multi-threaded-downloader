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
export const LogError = console.error.bind(console)
export const LogAlways = message => () => Log(message)
export const FlatMapShare = R.curry((func, $) => $.flatMap(func).share())
export const Size = meta$ => meta$.pluck('totalBytes').take(1)
export const ValidOptions = Rx.partition(CliValidOptions)
export const IsNewDownload = R.whereEq({type: DOWNLOAD_TYPES.NEW})
export const DownloadOptions = R.compose(R.map(Rx.pluck('options')), Rx.partition(IsNewDownload), GetDownloadType)
export const Executor = (signal$) => {
  const [{size$, completion$, invalidOptions$, validOptions$}] = demux(
    signal$, 'size$', 'completion$', 'invalidOptions$', 'validOptions$'
  )
  O.merge(
    validOptions$.take(1).map(msg => [msg, LogAlways('\nStarting...')]),
    size$.map(msg => [msg, R.compose(Log, Status)]),
    invalidOptions$.map(msg => [msg, LogAlways(Help)]),
    completion$.map(msg => [msg, BAR])
  ).subscribe(
    ([msg, action]) => action(msg),
    R.partial(LogError, ['Failure']), R.partial(Log, ['Complete'])
  )
}

const [validOptions$, invalidOptions$] = ValidOptions(O.just(meow(Help).flags).shareReplay(1))
const [new$, resume$] = DownloadOptions(validOptions$)
const created$ = FlatMapShare(CreateMTDFile, new$).takeLast(1)
const mtdFile$ = O.merge(resume$, Rx.sample([new$], created$).map(R.head)).pluck('mtdPath')
const downloaded$ = FlatMapShare(DownloadFromMTDFile, mtdFile$)
const [{fdR$, meta$}] = demux(downloaded$, 'meta$', 'fdR$')
const finalized$ = FlatMapShare(
  FinalizeDownload,
  Rx.sample([fdR$, meta$], downloaded$.last()).map(
    ([fd, meta]) => ({fd$: O.just(fd), meta$: O.just(meta)})
  ).last()
)
const completion$ = Completion(meta$.throttle(1000))
const size$ = Size(meta$)
Executor(mux({finalized$, size$, completion$, invalidOptions$, validOptions$}))
