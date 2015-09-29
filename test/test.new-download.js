var Download = require('../src/app'),
  Rx = require('rx'),
  chai = require('chai'),
  crypto = require('crypto'),
  fs = require('fs')
chai.should()

function * createDownload (parameters) {
  var url = parameters.url
  var path = parameters.path
  var mtd = new Download({path, url, strictSSL: false})
  yield mtd.start()
  var defer = Promise.defer()
  var hash = crypto.createHash('sha1')
  fs.createReadStream(path)
    .on('data', x => hash.update(x))
    .on('end', () => defer.resolve(hash.digest('hex')))
  return yield defer.promise
}

var removeFile = (x) => Rx.Observable.fromCallback(fs.unlink)(x).toPromise()

describe('NewDownload', function () {
  describe("range-file", function () {
    afterEach(function *() {
      return yield removeFile('./.temp/1024.txt')
    })

    it("download dynamically created 1024 bytes file", function * () {
      var digest = yield createDownload({url: 'http://localhost:3000/range/1024.txt', path: './.temp/1024.txt'})
      digest.should.equal('41BE89713FA15BC83D093DD67E558BADA8546388'.toLowerCase())
    })
  })
  describe("static-file", function () {
    afterEach(function *() {
      return yield removeFile('./.temp/pug.jpg')
    })

    it("download static pug image", function * () {
      var digest = yield createDownload({url: 'http://localhost:3000/files/pug.jpg', path: './.temp/pug.jpg'})
      digest.should.equal('25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1'.toLowerCase())
    })

    it("download static pug image over SSL", function * () {
      var digest = yield createDownload({url: 'https://localhost:3001/files/pug.jpg', path: './.temp/pug.jpg'})
      digest.should.equal('25FD4542D7FFFB3AEC9EF0D25A533DDE4803B9C1'.toLowerCase())
    })
  })
})

