var mtd = require('../lib/TaskExecuter');

var options = {
    count: 2,
    method: 'GET',
    port: 80,
    range: '0-100',
    timeout: 5000,
    onStart: function(meta) {
        console.log('Download Started', meta);
    },
    onData: function(threads) {
        //console.log('Data was written to the file');
    },
    onEnd: function(err, result) {
        if (err) console.error(err);
        console.log('Download Complete');
    },
    //TODO : Implement
    retry: true
};
var url = 'https://upload.wikimedia.org/wikipedia/commons/4/47/Gadget_the_pug_expressive_eyes.jpg';
var file = '/Users/tusharmathur/Desktop/temp/Gadget_the_pug_expressive_eyes.jpg';
var downloader = new mtd(file, url, options);
downloader.start();