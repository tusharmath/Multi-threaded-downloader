/**
 * Created by tushar.mathur on 21/01/16.
 */

'use strict'

import Path from 'path'
import test from 'ava'
import {createDownload, removeFile} from './../../perf/utils'

const path = Path.normalize(Path.join(__dirname, '../../.temp/in.txt'))
test.after(async function () {
  await removeFile(path)
})

test(async function (t) {
  var digest = await createDownload({url: 'http://localhost:3100/files/in.txt', path})
  t.same(digest, 'A9070D71168B5135910A04F0650A91541B72762E'.toLowerCase())
})
