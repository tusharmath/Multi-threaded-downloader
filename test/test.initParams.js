import initParams from '../src/initParams'
import test from 'ava'

test((t) => {
  const out = initParams({range: 10, path: 'download.dmg', url: 'sample'})
  t.same(out, {range: 10, mtdPath: 'download.dmg.mtd', path: 'download.dmg', url: 'sample'})
})

test('default:range', (t) => {
  const out = initParams({path: 'download.dmg', url: 'sample'})
  t.same(out, {
    range: 3, mtdPath: 'download.dmg.mtd', path: 'download.dmg', url: 'sample'
  })
})
