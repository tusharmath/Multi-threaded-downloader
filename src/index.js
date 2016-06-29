/**
 * Created by tusharmathur on 5/15/15.
 */
'use strict'
import * as U from './Utils'
import * as T from '../src/IO'
import request from 'request'
import R from 'ramda'
import fs from 'graceful-fs'
import {CreateMTDFile as _CreateMTDFile} from './CreateMTDFile'
import {DownloadFromMTDFile as _DownloadFromMTDFile} from './DownloadFromMTDFile'
import {FinalizeDownload as _FinalizeDownload} from './FinalizeDownload'

export const HTTP = T.HTTP(request)
export const FILE = T.FILE(fs)
export const CreateMTDFile = R.compose(_CreateMTDFile({FILE, HTTP}), U.MergeDefaultOptions)
export const DownloadFromMTDFile = _DownloadFromMTDFile({FILE, HTTP})
export const FinalizeDownload = _FinalizeDownload({FILE})
export const MTDPath = U.MTDPath
