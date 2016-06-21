import {MergeDefaultOptions} from '../src/Utils'
import test from 'ava'

test((t) => {
  const out = MergeDefaultOptions({range: 10, path: 'download.dmg', url: 'sample'})
  t.deepEqual(out, {range: 10, mtdPath: 'download.dmg.mtd', path: 'download.dmg', url: 'sample', metaWrite: 300})
})

test('default:range', (t) => {
  const out = MergeDefaultOptions({path: 'download.dmg', url: 'sample'})
  t.deepEqual(out, {
    range: 3, mtdPath: 'download.dmg.mtd', path: 'download.dmg', url: 'sample', metaWrite: 300
  })
})
