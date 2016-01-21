var express = require('express')
var app = express()
var http = require('http')
var https = require('https')
var fs = require('fs')
var options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/key-cert.pem')
}
var httpServer = http.createServer(app)
var httpsServer = https.createServer(options, app)
var getChar = function* () {
  var char = 0
  while (true) {
    yield char
    char = char === 9 ? 0 : char + 1
  }
}
app
  .use('/files', express.static(__dirname + '/files'))
  .get('/chunk/:size.txt', function (req, res) {
    var count = 0,
      size = parseInt(req.params.size),
      char = getChar()
    while (count < size) {
      res.write(char.next().value.toString())
      count++
    }
    res.send()
  })
  .get('/range/:size.txt', function (req, res) {
    var count = 0,
      str = '',
      size = parseInt(req.params.size),
      char = getChar()
    while (count < size) {
      str += char.next().value.toString()
      count++
    }
    res.send(str)
  })

const startServer = (app, port) => new Promise(i => {
  const onClose = () => new Promise(i => server.close(i))
  const onStart = () => i(onClose)
  const server = app.listen(port, onStart)
})

exports.http = (port) => startServer(httpServer, port)
exports.https = (port) => startServer(httpsServer, port)
