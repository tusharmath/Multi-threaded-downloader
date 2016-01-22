/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'

import Path from 'path'
import test from 'ava'
import {createDownload, removeFile} from './../../perf/utils'

const path = Path.normalize(Path.join(__dirname, '../../.temp/pug_https'))
test.after(async function () {
  await removeFile(path)
})
test(async function (t) {
  var digest = await createDownload({url: 'https://localhost:3101/files/pug.jpg', path})
  t.same(digest, '25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1'.toLowerCase())
})
