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

app.use('/files', express.static(__dirname + '/files'))

const startServer = (app, port) => new Promise(i => {
  const onClose = () => new Promise(i => server.close(i))
  const onStart = () => i(onClose)
  const server = app.listen(port, onStart)
})

exports.http = (port) => startServer(httpServer, port)
exports.https = (port) => startServer(httpsServer, port)
