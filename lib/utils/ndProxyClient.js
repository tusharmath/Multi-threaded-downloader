var http = require('http');
var core = require('../core');
var listen_port = process.env.PORT || 8080;


var _startAccleration = function(url, callback) {



};

var _requestListener = function(request, response) {
  console.log('Request recieved:', request.url);

var _onChunkComplete = function(){
response.write()
};

  var options = {
    //GET PRIVATE PATH
    path: '/Users/tusharmathur/desktop/temp',
    url: url,
    threadCount: 4,
    onChunkComplete: _onChunkComplete,
    onDownloadComplete: _onDownloadComplete
  };

  var downloader = new core(options);
  downloader.download();

  var proxy_client = http.request(options, function(res) {
    res.on('data', function(chunk) {
      response.write(chunk, 'binary');
    });
    res.on('end', function() {
      response.end();
    });
    res.on('error', function(e) {
      console.log('Error with client ', e);
    });
    response.writeHead(res.statusCode, res.headers);
  });

  request.on('data', function(chunk) {
    console.log('Write to server ', chunk.length);
    //console.log(chunk.toString('utf8'));
    request_data = request_data + chunk;
    proxy_client.write(chunk, 'binary');
  });

  request.on('end', function() {
    //console.log('End chunk write to server');
    proxy_client.end();
  });

  request.on('error', function(e) {
    console.log('Problem with request ', e);
  });

};


http.createServer(_requestListener).listen(listen_port);
console.log('Video Accelerator started on port ' + listen_port);