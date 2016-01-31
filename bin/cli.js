const _ = require('lodash')
const URL = require('url')
const PATH = require('path')
const Rx = require('rx')
const VALID_URL = require('valid-url')
const fileNameGenerator = x => _.last(URL.parse(x).pathname.split('/')) || Date.now()
const normalizePath = path => PATH.resolve(__dirname, path)
const pathGenerator = x => normalizePath(fileNameGenerator(x))

module.exports = (createDownload, params) => {
  const pFlags = Rx.Observable.just(params.flags)
  const newDownload = pFlags
    .filter(x => VALID_URL.isUri(x.url))
    .map(x => x.path ? x : _.defaults(x, {path: pathGenerator(x.url)}))
    .flatMap(x => createDownload(x).start())

  const resumeDownloads = pFlags
    .skipWhile(x => x.url)
    .map(x => _.assign({}, x, {mtdPath: normalizePath(x.file), path: normalizePath(x.file.replace('.mtd', ''))}))
    .flatMap(x => createDownload(x).download())

  return Rx.Observable.merge(newDownload, resumeDownloads)
}
