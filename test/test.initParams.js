import {mergeDefaultOptions} from '../src/Utils'
import test from 'ava'

test((t) => {
  const out = mergeDefaultOptions({range: 10, path: 'download.dmg', url: 'sample'})
  t.deepEqual(out, {range: 10, mtdPath: 'download.dmg.mtd', path: 'download.dmg', url: 'sample'})
})

test('default:range', (t) => {
  const out = mergeDefaultOptions({path: 'download.dmg', url: 'sample'})
  t.deepEqual(out, {
    range: 3, mtdPath: 'download.dmg.mtd', path: 'download.dmg', url: 'sample'
  })
})
