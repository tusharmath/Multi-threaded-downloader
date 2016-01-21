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

httpServer.listen(HTTP_PORT, () => console.log('Started HTTP server on port:', HTTP_PORT))
httpsServer.listen(HTTPS_PORT, () => console.log('Started HTTPS server on port', HTTPS_PORT))
