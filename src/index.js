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
 * @public
 * @params {Object} options - The `options` must have `mtdPath` and `url`.
 * @returns {Observable} multiplexed stream
 */
export const CreateMTDFile = R.compose(_CreateMTDFile({
  FILE,
  HTTP
}), U.MergeDefaultOptions)
export const DownloadFromMTDFile = _DownloadFromMTDFile({FILE, HTTP})
export const FinalizeDownload = _FinalizeDownload({FILE})
export const MTDPath = U.MTDPath
export const GetDownloadType = U.GetDownloadType(U.NormalizePath)
export const DOWNLOAD_TYPES = U.DOWNLOAD_TYPES
export const Completion = U.Completion
export const CliValidOptions = U.CliValidOptions
