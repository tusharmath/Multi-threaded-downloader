/**
 * Created by tushar.mathur on 25/01/16.
 */

'use strict'
const Rx = require('rx')

const _create = (ob, path, flag) => ob.fsOpen(path, flag).map(fd => ({flag, fd}))

module.exports = (ob, path) => {
  const write = _create(ob, path, 'w')
  const readPlus = write.flatMap(() => _create(ob, path, 'r+'))
  return Rx.Observable.merge(write, readPlus)
}
