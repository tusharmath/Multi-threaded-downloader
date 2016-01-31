const Rx = require('rx')
const newDownload = require('../src/newDownload')
const resumeDownload = require('../src/resumeDownload')

module.exports = (createDownload, params) => {
  const pFlags = Rx.Observable.just(params.flags)
  const downloads = Rx.Observable.merge(
    newDownload(createDownload, pFlags),
    resumeDownload(createDownload, pFlags)
  )

  return Rx.Observable.combineLatest(
    downloads.map(x => x.download),
    downloads.flatMap(x => x.downloadable),
    (a, b) => b
  ).tap(x => console.log(x))
}
