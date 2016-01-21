var express = require('express'),
  app = express(),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  options = {
    key: fs.readFileSync(__dirname + '/key.pem'),
    cert: fs.readFileSync(__dirname + '/key-cert.pem')
  },
  httpServer = http.createServer(app),
  httpsServer = https.createServer(options, app),
  HTTP_PORT = 3100,
  HTTPS_PORT = HTTP_PORT + 1

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
