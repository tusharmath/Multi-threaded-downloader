#!/usr/bin/env node
/**
 * Created by tushar.mathur on 04/06/16.
 */

'use strict'
import meow from 'meow'
import R from 'ramda'
import {demux} from 'muxer'
import {Observable as O} from 'rx'
import Progress from 'progress'
import {
  CreateMTDFile,
  DownloadFromMTDFile,
  FinalizeDownload,
  GetDownloadType,
  DOWNLOAD_TYPES,
  Completion
} from '../index'

const HELP_TEXT = `		
 Usage		
 	  mtd		
 		
 	Options		
 	  --url            The url of the file that needs to be downloaded		
 	  --file           Path to the .mtd file for resuming failed downloads		
 		
 	Examples		
 	  mtd --url http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4		
 	  mtd --file big_buck_bunny_720p_1mb.mp4.mtd		
   `

/**
 * LIB
 */
const options = meow(HELP_TEXT).flags
const options$ = O.just(options)
const FlatMapShare = R.curry((func, $) => $.flatMap(func).share())

if (!R.any(R.identity)([options.url, options.file])) {
  console.log(HELP_TEXT)
  process.exit(0)
}

// Check if its a new or an old download
const [new$, resume$] = GetDownloadType(options$).partition(R.whereEq({type: DOWNLOAD_TYPES.NEW}))

// Pluck options
const newOptions$ = new$.pluck('options')
const resumeOptions$ = resume$.pluck('options')

// Create .mtd file if new
const created$ = FlatMapShare(CreateMTDFile, newOptions$).last()

// Create options for download resume

const mtdFile$ = O.merge(
  resumeOptions$,
  created$.withLatestFrom(newOptions$, R.nthArg(1))
).pluck('mtdPath').shareReplay(1)

// Start downloading
const downloaded$ = FlatMapShare(DownloadFromMTDFile, mtdFile$)

// Extract meta$
const [{fdR$, meta$}] = demux(downloaded$, 'meta$', 'fdR$')

// Finalize Downloaded FILE
FlatMapShare(
  FinalizeDownload,
  downloaded$.last().withLatestFrom(fdR$, meta$, (_, fd, meta) => ({
    fd$: O.just(fd),
    meta$: O.just(meta)
  }))
).last().subscribe('COMPLETED')

// Update progressbar
const bar = new Progress(':bar :percent', {
  total: 1000,
  complete: '█',
  incomplete: '░'
})
Completion(meta$).subscribe((i) => bar.update(i))
