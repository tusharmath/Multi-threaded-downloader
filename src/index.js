/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import * as U from './Utils'
import * as T from './IO'
import request from 'request'
import R from 'ramda'
import fs from 'graceful-fs'
import progress from 'progress'
import {CreateMTDFile as _CreateMTDFile} from './CreateMTDFile'
import {DownloadFromMTDFile as _DownloadFromMTDFile} from './DownloadFromMTDFile'
import {FinalizeDownload as _FinalizeDownload} from './FinalizeDownload'

export const HTTP = T.HTTP(request)
export const FILE = T.FILE(fs)
export const BAR = T.BAR(progress)

/**
 * Creates a new .mtd file that is a little larger in size than the original
 * file. The file is initially empty and has all the relevant meta
 * information regarding the download appended to the end.
 * @function
 * @param {object} options - The `options` must have `mtdPath` and `url`.
 * @param {string} options.url - Download url.
 * @param {string} options.path - Relative path where the file needs to be saved.
 * @param {number} [options.range=3] - Number of concurrent downloads.
 * @param {number} [options.metaWrite=300] - Throttles the write frequency of meta data.
 * @return {external:Observable} multiplexed stream
 */
export const CreateMTDFile = R.compose(_CreateMTDFile({
  FILE,
  HTTP
}), U.MergeDefaultOptions)

/**
 * Reads a `.mtd` file and resumes the download from the last successfully saved
 * byte.
 * @function
 * @param {String} mtdPath - Relative path to the `.mtd` file.
 * @return {external:Observable} multiplexed stream
 */
export const DownloadFromMTDFile = _DownloadFromMTDFile({FILE, HTTP})

/**
 * Removes the meta information and the `.mtd` extension from the file once the
 * download is successfully completed.
 * @function
 * @param {Observable} meta$ - Meta data stream ie. exposed by {@link DownloadFromMTDFile}
 * @return {external:Observable} multiplexed stream
 */
export const FinalizeDownload = _FinalizeDownload({FILE})

export const MTDPath = U.MTDPath
export const GetDownloadType = U.GetDownloadType(U.NormalizePath)
export const DOWNLOAD_TYPES = U.DOWNLOAD_TYPES

/**
 * Util method that calculates the total completion percentage.
 * @function
 * @param {Observable} meta$ - Meta data stream ie. exposed by {@link DownloadFromMTDFile}
 * @return {external:Observable} Value between 0 - 100
 */
export const Completion = U.Completion
export const CliValidOptions = U.CliValidOptions

/**
 * @external Observable
 * @see {@link https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md}
 */
